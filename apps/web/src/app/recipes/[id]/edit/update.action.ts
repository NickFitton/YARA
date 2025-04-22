"use server";

import { cookies } from "next/headers";
import { updateRecipe as updateRecipeApi } from "@/lib/api";
import { UpdateRecipeDto } from "@yara/api/recipe";

export const updateRecipe = async (
  id: string,
  data: UpdateRecipeDto
): Promise<void> => {
  const accessToken = (await cookies()).get("accessToken")!.value;
  return updateRecipeApi(accessToken, id, data);
};
