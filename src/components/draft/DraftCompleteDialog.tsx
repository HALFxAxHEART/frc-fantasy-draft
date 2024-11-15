import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DraftComplete } from "@/components/DraftComplete";
import { format } from "date-fns";
import { TBAEvent } from "@/services/tbaService";
import { DraftState } from "@/types/draft";

interface DraftCompleteDialogProps {
  draftState: DraftState;
  eventDetails: TBAEvent;
}

export const DraftCompleteDialog = ({ draftState, eventDetails }: DraftCompleteDialogProps) => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Draft Complete!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DraftComplete participants={draftState.participants} />
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Event Details</h3>
            <p>Start Date: {format(new Date(eventDetails.start_date), 'PPP')}</p>
            <p>End Date: {format(new Date(eventDetails.end_date), 'PPP')}</p>
            <a 
              href={`https://www.thebluealliance.com/event/${eventDetails.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Watch Event on The Blue Alliance
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};