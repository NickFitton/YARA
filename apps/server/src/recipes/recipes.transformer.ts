import { CreateRecipeDto } from '@yara/api/recipe';
import {
  Prisma,
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
} from '@prisma/client';
import { ReadRecipeDto, UpdateRecipeDto } from '@yara/api/recipe';

export const createToDbEntity = (
  { name, description, instructions = [], ingredients = [] }: CreateRecipeDto,
  userId: string,
): Prisma.RecipeCreateInput => {
  return {
    owner: { connect: { id: userId } },
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
  };
};

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
  recipe: UpdateRecipeDto,
): Prisma.RecipeUpdateInput => recipe;
