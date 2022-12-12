import {ScanData} from './types';

type RecipeData = Partial<{
  name: string;
  description: string;
  ingredients: string[];
  method: string[];
}>;
type ScanProps = {data: ScanData};

export type RecipeStackParamList = {
  RecipesRoot?: {from: string; action: 'delete'};
  'Item Aggregator Test': undefined;
  'Create Recipe'?: RecipeData;
  'View Recipe': {id: string};
  'Scan Name': undefined;
  'Build Name': ScanProps;
  'Scan Description': Pick<RecipeData, 'name'>;
  'Build Description': ScanProps & {recipe: Pick<RecipeData, 'name'>};
  'Scan Ingredients': Pick<RecipeData, 'name' | 'description'>;
  'Build Ingredients': ScanProps & {
    recipe: Pick<RecipeData, 'name' | 'description'>;
  };
  'Scan Methods': Pick<RecipeData, 'name' | 'description' | 'ingredients'>;
  'Build Methods': ScanProps & {
    recipe: Pick<RecipeData, 'name' | 'description' | 'ingredients'>;
  };
  'View Recipe Options': {id: string};
};
