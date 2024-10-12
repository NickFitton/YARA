"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createRecipe as createRecipeApi } from "@/lib/api";

const createInstructionSchema = z.object({
  step: z.string().min(1, "Step is required"),
  order: z.number().positive(),
});

const createIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createRecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  instructions: z
    .array(createInstructionSchema)
    .min(1, "At least one instruction is required"),
  ephemeralInstruction: z.string().optional(),
  ingredients: z
    .array(createIngredientSchema)
    .min(1, "At least one ingredient is required"),
  ephemeralIngredient: z.object({
    name: z.string(),
    quantity: z.string(),
  }),
});
type CreateRecipe = z.infer<typeof createRecipeSchema>;

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

export const createRecipe = async (
  data: CreateRecipe
): Promise<ReadRecipeDto> => {
  const accessToken = cookies().get("accessToken")!.value;
  return createRecipeApi(data, accessToken);
};
