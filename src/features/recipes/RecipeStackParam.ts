import {IngredientModel} from '../../db/models/Ingredient';
import {MethodModel} from '../../db/models/Method';

export type RecipeStackParamList = {
  RecipesRoot: undefined;
  'Create Recipe'?: {
    name?: string;
    description?: string;
    ingredients?: IngredientModel[];
    method?: MethodModel[];
  };
  'Scan Name': undefined;
  'View Recipe': {
    id: string;
  };
  'Scan Description': {name?: string};
  'Scan Ingredient': {name?: string; description?: string};
  'Scan Method': {
    name?: string;
    description?: string;
    IngredientModel?: string[];
  };
};
