import {NavigatorScreenParams} from '@react-navigation/native';
import {CreateRecipeStackParamList} from './createRecipe/types';
import {MakeRecipeStackParamList} from './makeRecipe/types';

export type JourneyStackParamList = {
  'Create Recipe Journey': NavigatorScreenParams<CreateRecipeStackParamList>;
  'Make Recipe Journey': NavigatorScreenParams<MakeRecipeStackParamList>;
};
