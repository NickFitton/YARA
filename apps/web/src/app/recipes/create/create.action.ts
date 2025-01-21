"use server";

import { cookies } from "next/headers";
import { createRecipe as createRecipeApi } from "@/lib/api";
import { CreateRecipeDto, ReadRecipeDto } from "@yara/api/recipe";

export const createRecipe = async (
  data: CreateRecipeDto
): Promise<ReadRecipeDto> => {
  const accessToken = cookies().get("accessToken")!.value;
  return createRecipeApi(data, accessToken);
};
