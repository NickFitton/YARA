import {NavigationProp, RouteProp} from '@react-navigation/native';
import {OCRFrame} from 'vision-camera-ocr';

export type TextBlock = OCRFrame['result']['blocks'][0];

export type IdTextBlock = TextBlock & {
  id: string;
};

export type ScanData = {
  frame: {width: number; height: number};
  text: IdTextBlock[];
};

type ScanProps = {data: ScanData};

export type RecipeData = Partial<{
  name: string;
  description: string;
  ingredients: string[];
  method: string[];
}>;

export type CreateRecipeStackParamList = {
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
};

export type CreateRecipeNavigation<T extends keyof CreateRecipeStackParamList> =
  {navigation: NavigationProp<CreateRecipeStackParamList, T>};
export type CreateRecipeRoute<T extends keyof CreateRecipeStackParamList> = {
  route: RouteProp<CreateRecipeStackParamList, T>;
};

export type CreateRecipeProps<T extends keyof CreateRecipeStackParamList> =
  CreateRecipeNavigation<T> & CreateRecipeRoute<T>;
