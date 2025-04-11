import { Tag } from "lucide-react";
import { TabCard } from "./TabCard";

export default async function InstructionsEditor() {
  return (
    <TabCard
      title="Categories & Tags"
      subtitle="Categorize your recipe to help users find it"
      tabValue="details"
      Icon={Tag}
    >
      <span>Categories & Tags</span>
    </TabCard>
  );
}
