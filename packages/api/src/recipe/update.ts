import { z } from 'zod';
import { createRecipeSchema } from './create';

export const updateRecipeSchema = createRecipeSchema.partial().omit({
  ingredients: true,
  instructions: true,
});
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>;
