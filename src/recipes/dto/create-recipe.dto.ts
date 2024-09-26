export interface CreateInstructionDto {
  step: string;
  order: number;
}
export interface CreateIngredientDto {
  name: string;
  quantity: string;
}
export interface CreateRecipeDto {
  name: string;
  description?: string;
  instructions: CreateInstructionDto[];
  ingredients: CreateIngredientDto[];
}
