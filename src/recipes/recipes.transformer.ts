import { CreateRecipeDto } from './dto/create-recipe.dto';
import {
  Prisma,
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
} from '@prisma/client';
import { ReadRecipeDto } from './dto/read-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

export const createToDbEntity = ({
  name,
  description,
  instructions,
  ingredients,
}: CreateRecipeDto): Prisma.RecipeCreateInput => ({
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

export const createFromDbEntity = (
  recipe: Recipe & {
    ingredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
  },
): ReadRecipeDto => recipe;

export const updateToDbEntity = (
  recipe: UpdateRecipeDto,
): Prisma.RecipeUpdateInput => recipe;
