import { Leaf } from "lucide-react";
import { TabCard } from "./TabCard";

export default async function InstructionsEditor() {
  return (
    <TabCard
      title="Nutrition"
      subtitle="Add nutritional details for your recipe"
      tabValue="nutrition"
      Icon={Leaf}
    >
      <span>Nutrition</span>
    </TabCard>
  );
}
