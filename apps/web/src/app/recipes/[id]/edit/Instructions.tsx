import { ChefHat } from "lucide-react";
import { TabCard } from "./TabCard";

export default async function InstructionsEditor() {
  return (
    <TabCard
      title="Instructions"
      subtitle="Add or edit the step-by-step cooking instructions"
      tabValue="instructions"
      Icon={ChefHat}
    >
      <span>Instruction</span>
    </TabCard>
  );
}
