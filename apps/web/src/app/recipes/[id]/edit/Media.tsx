import { ImageIcon } from "lucide-react";
import { TabCard } from "./TabCard";

export default async function InstructionsEditor() {
  return (
    <TabCard
      title="Media"
      subtitle="Upload photos and videos of your recipe"
      tabValue="media"
      Icon={ImageIcon}
    >
      <span>Media</span>
    </TabCard>
  );
}
