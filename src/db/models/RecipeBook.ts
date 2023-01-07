import {DBRecord} from './shared';

export interface RecipeBook extends DBRecord {
  bookId: string;
  recipeId: string;
}
