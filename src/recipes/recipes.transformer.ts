import { CreateRecipeSchema } from './dto/create-recipe.dto';
import {
  Prisma,
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
} from '@prisma/client';
import { ReadRecipeDto } from './dto/read-recipe.dto';
import { UpdateRecipeSchema } from './dto/update-recipe.dto';

export const createToDbEntity = ({
  name,
  description,
  instructions,
  ingredients,
}: CreateRecipeSchema): Prisma.RecipeCreateInput => ({
  name,
  description,
  instructions: {
    create: instructions.map(({ order, step }) => ({
      order,
      step,
    })),
  },
  ingredients: {
    create: ingredients.map(({ name, quantity }) => ({
      name,
      quantity,
    })),
  },
});

export const createFromDbEntity = ({
  description,
  ...recipe
}: Recipe & {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}): ReadRecipeDto => ({
  description: description || undefined,
  ...recipe,
});

export const updateToDbEntity = (
  recipe: UpdateRecipeSchema,
): Prisma.RecipeUpdateInput => recipe;
