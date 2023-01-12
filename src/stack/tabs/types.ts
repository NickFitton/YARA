import {NavigatorScreenParams} from '@react-navigation/native';

import {BookStackParamList} from './books/BookStackParam';
import {RecipeStackParamList} from './recipes/RecipeStackParam';

export type TabStackParamList = {
  Recipes: NavigatorScreenParams<RecipeStackParamList>;
  Search: undefined;
  Books: NavigatorScreenParams<BookStackParamList>;
  Settings: undefined;
};
