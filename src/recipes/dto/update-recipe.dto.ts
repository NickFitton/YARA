import { CreateIngredientDto, CreateInstructionDto } from './create-recipe.dto';

export interface UpdateInstructionDto extends Partial<CreateInstructionDto> {
  id: string;
}
export interface UpdateIngredientDto extends Partial<CreateIngredientDto> {
  id: string;
}
export interface UpdateRecipeDto {
  name: string;
  description?: string;
}
