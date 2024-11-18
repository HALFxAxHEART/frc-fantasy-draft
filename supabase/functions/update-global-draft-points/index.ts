import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get active global draft
    const { data: activeDraft } = await supabaseClient
      .from('global_drafts')
      .select('*')
      .eq('status', 'active')
      .single()

    if (!activeDraft) {
      return new Response(
        JSON.stringify({ message: 'No active global draft found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all participants and their teams
    const { data: participants } = await supabaseClient
      .from('global_draft_participants')
      .select('*')
      .eq('global_draft_id', activeDraft.id)

    if (!participants) {
      return new Response(
        JSON.stringify({ message: 'No participants found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update points for each participant
    for (const participant of participants) {
      const teams = participant.teams as any[]
      let totalPoints = 0

      for (const team of teams) {
        if (team.stats) {
          // Calculate points based on wins and other stats
          const winPoints = (team.stats.wins || 0) * 2
          const oprPoints = Math.floor((team.stats.opr || 0) / 10)
          totalPoints += winPoints + oprPoints
        }
      }

      // Update participant's total points
      await supabaseClient
        .from('global_draft_participants')
        .update({ total_points: totalPoints })
        .eq('id', participant.id)
    }

    return new Response(
      JSON.stringify({ message: 'Points updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})