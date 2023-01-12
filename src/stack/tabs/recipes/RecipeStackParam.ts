export type RecipeData = Partial<{
  name: string;
  description: string;
  ingredients: string[];
  method: string[];
}>;

export type RecipeStackParamList = {
  RecipesRoot?: {from: string; action: 'delete'};
  'Create Recipe'?: RecipeData;
  'View Recipe': {id: string};
  'Recipe Ratings': {id: string};
  'Add to Book': {id: string};
};
