import { ReadRecipeDto } from "@/app/recipes/create/create.action";

// TODO Request errors and better handling

export type Instruction = {
  id: string;
  step: string;
  order: number;
};
export type Ingredient = {
  id: string;
  name: string;
  quantity: string;
};
export type Recipe = {
  id: string;
  name: string;
  description?: string;
  instructions: Instruction[];
  ingredients: Ingredient[];
};
export type Login = {
  email: string;
  password: string;
};
export type AccessToken = {
  accessToken: string;
};
export type CreateRecipe = {
  name: string;
  instructions: {
    order: number;
    step: string;
  }[];
  ingredients: {
    name: string;
    quantity: string;
  }[];
  description?: string | undefined;
};

export type CreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ReadUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const baseUrl = process.env.BACKEND_URL!;

export const createRecipe = async (
  data: CreateRecipe,
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

export const getRecipes = async (accessToken: string): Promise<Recipe[]> => {
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

export const createUser = async (data: CreateUser): Promise<ReadUser> => {
  const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
    body: JSON.stringify(data),
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (signupResponse.status !== 201) {
    throw new Error("Failed to sign up");
  }
  return signupResponse.json();
};

export const login = async (data: Login): Promise<AccessToken> => {
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    body: JSON.stringify(data),
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (loginResponse.status !== 201) {
    throw new Error("Bad request");
  }

  return loginResponse.json();
};
