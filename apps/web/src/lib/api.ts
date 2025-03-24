import { LoginDto } from "@yara/api/auth";
import { CreateRecipeDto, ReadRecipeDto } from "@yara/api/recipe";
import { CreateUserDto, ReadUserDto } from "@yara/api/user";

// TODO Request errors and better handling

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const createRecipe = async (
  data: CreateRecipeDto,
  accessToken: string
): Promise<ReadRecipeDto> => {
  const response = await fetch(`${baseUrl}/recipes`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.status !== 201) {
    console.log(await response.json());
    throw new Error("Failed to create recipe");
  }
  return await response.json();
};

export const getRecipes = async (
  accessToken: string
): Promise<ReadRecipeDto[]> => {
  const recipesResponse = await fetch(`${baseUrl}/recipes`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (recipesResponse.status !== 200) {
    console.log(recipesResponse);
    throw new Error("failed to fetch recipes");
  }
  return recipesResponse.json();
};

export const getRecipe = async (
  accessToken: string,
  recipeId: string
): Promise<ReadRecipeDto> => {
  const recipesResponse = await fetch(`${baseUrl}/recipes/${recipeId}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (recipesResponse.status !== 200) {
    console.log(recipesResponse);
    throw new Error("failed to fetch recipes");
  }
  return recipesResponse.json();
};

export const createUser = async (data: CreateUserDto): Promise<ReadUserDto> => {
  const signupResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
    {
      body: JSON.stringify(data),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (signupResponse.status !== 201) {
    throw new Error("Failed to sign up");
  }
  return signupResponse.json();
};

export const login = async (data: LoginDto): Promise<Response> => {
  return fetch(`${baseUrl}/auth/login`, {
    body: JSON.stringify(data),
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
