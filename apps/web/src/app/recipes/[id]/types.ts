import { ReadIngredientDto, ReadRecipeDto } from "@yara/api/recipe";

type DietaryLabel = {
  status: "warning" | "okay";
  label: string;
};

type MissingData = {
  totalTime: number;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: number;
  calories: number;
  image?: string;
  keyIngredients: Pick<ReadIngredientDto, "id" | "name">[];
  equipment: string[];
  dietaryLabels: DietaryLabel[];
};
export type RecipePageData = {
  recipe: MissingData & ReadRecipeDto;
};
