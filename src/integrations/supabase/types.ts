export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      draft_leaderboards: {
        Row: {
          created_at: string | null
          draft_id: string
          id: string
          participant_name: string
          rank: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          draft_id: string
          id?: string
          participant_name: string
          rank?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          draft_id?: string
          id?: string
          participant_name?: string
          rank?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draft_leaderboards_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_leaderboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drafts: {
        Row: {
          created_at: string
          draft_data: Json | null
          event_key: string
          event_name: string
          id: string
          nickname: string | null
          participants: Json | null
          share_code: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          draft_data?: Json | null
          event_key: string
          event_name: string
          id?: string
          nickname?: string | null
          participants?: Json | null
          share_code?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          draft_data?: Json | null
          event_key?: string
          event_name?: string
          id?: string
          nickname?: string | null
          participants?: Json | null
          share_code?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drafts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      global_draft_participants: {
        Row: {
          created_at: string
          current_pick: number | null
          draft_position: number | null
          global_draft_id: string | null
          id: string
          rank: number | null
          selected_teams: Json | null
          teams: Json | null
          total_points: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_pick?: number | null
          draft_position?: number | null
          global_draft_id?: string | null
          id?: string
          rank?: number | null
          selected_teams?: Json | null
          teams?: Json | null
          total_points?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_pick?: number | null
          draft_position?: number | null
          global_draft_id?: string | null
          id?: string
          rank?: number | null
          selected_teams?: Json | null
          teams?: Json | null
          total_points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "global_draft_participants_global_draft_id_fkey"
            columns: ["global_draft_id"]
            isOneToOne: false
            referencedRelation: "global_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "global_draft_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      global_drafts: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string | null
          pick_time_seconds: number | null
          picks_per_participant: number | null
          season_year: number
          settings: Json | null
          start_date: string
          status: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name?: string | null
          pick_time_seconds?: number | null
          picks_per_participant?: number | null
          season_year: number
          settings?: Json | null
          start_date: string
          status?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string | null
          pick_time_seconds?: number | null
          picks_per_participant?: number | null
          season_year?: number
          settings?: Json | null
          start_date?: string
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          is_admin: boolean | null
          profile_picture_url: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          is_admin?: boolean | null
          profile_picture_url?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_admin?: boolean | null
          profile_picture_url?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          status: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          status?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
