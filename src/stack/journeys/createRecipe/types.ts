import {NavigationProp, RouteProp} from '@react-navigation/native';

export type RecipeData = Partial<{
  name: string;
  description: string;
  ingredients: string[];
  method: string[];
}>;

export type RecipeParts<T extends keyof RecipeData> = {
  recipe: Pick<RecipeData, T>;
};

export type CreateRecipeStackParamList = {
  Name: undefined;
  Description: RecipeParts<'name'>;
  Ingredients: RecipeParts<'name' | 'description'>;
  Methods: RecipeParts<'name' | 'description' | 'ingredients'>;
};

export type CreateRecipeNavigation<T extends keyof CreateRecipeStackParamList> =
  {navigation: NavigationProp<CreateRecipeStackParamList, T>};
export type CreateRecipeRoute<T extends keyof CreateRecipeStackParamList> = {
  route: RouteProp<CreateRecipeStackParamList, T>;
};

export type CreateRecipeProps<T extends keyof CreateRecipeStackParamList> =
  CreateRecipeNavigation<T> & CreateRecipeRoute<T>;
