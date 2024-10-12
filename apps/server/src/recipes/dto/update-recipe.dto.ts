import { z } from 'zod';
import { createRecipeSchema } from './create-recipe.dto';

export const updateRecipeSchema = createRecipeSchema.partial().omit({
  ingredients: true,
  instructions: true,
});
export type UpdateRecipeSchema = z.infer<typeof updateRecipeSchema>;
