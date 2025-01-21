export interface ReadInstructionDto {
  id: string;
  step: string;
  order: number;
}
export interface ReadIngredientDto {
  id: string;
  name: string;
  quantity: string;
}
export interface ReadRecipeDto {
  id: string;
  name: string;
  description?: string;
  instructions: ReadInstructionDto[];
  ingredients: ReadIngredientDto[];
}
