import { Utensils } from "lucide-react";
import { TabCard } from "./TabCard";

export default async function IngredientsEditor() {
  return (
    <TabCard
      title="Ingredients"
      subtitle="Add or edit the ingredients needed for your recipe"
      tabValue="ingredients"
      Icon={Utensils}
    >
      <span>Ingredient</span>
    </TabCard>
  );
}
