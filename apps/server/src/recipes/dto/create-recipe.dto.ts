import { z } from 'zod';

export const createInstructionSchema = z.object({
  step: z.string(),
  order: z.number().positive(),
});
export type CreateInstructionSchema = z.infer<typeof createInstructionSchema>;

export const createIngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});
export type CreateIngredientSchema = z.infer<typeof createIngredientSchema>;

export const createRecipeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  instructions: z.array(createInstructionSchema),
  ingredients: z.array(createIngredientSchema),
});
export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
