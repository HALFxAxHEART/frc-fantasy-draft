import { DraftStateProvider } from "@/components/draft/DraftStateProvider";
import { DraftContent } from "@/components/draft/DraftContent";

const Draft = () => {
  return (
    <DraftStateProvider>
      <DraftContent />
    </DraftStateProvider>
  );
};

export default Draft;