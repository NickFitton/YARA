import {NavigatorScreenParams} from '@react-navigation/native';
import {CreateRecipeStackParamList} from './createRecipe/types';

export type JourneyStackParamList = {
  'Create Recipe Journey': NavigatorScreenParams<CreateRecipeStackParamList>;
};
