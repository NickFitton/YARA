import {NavigatorScreenParams} from '@react-navigation/native';
import {RecipeStackParamList} from './recipes/RecipeStackParam';

export type TabStackParamList = {
  Recipes: NavigatorScreenParams<RecipeStackParamList>;
  Search: undefined;
  Books: undefined;
  Settings: undefined;
};
