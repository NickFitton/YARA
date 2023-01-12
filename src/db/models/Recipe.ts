// as I've omitted recipe from book
// eslint-disable-next-line import/no-cycle
import {BookModel} from './Book';
import {IngredientModel} from './Ingredient';
import {MethodModel} from './Method';
import {DBRecord} from './shared';

export interface RecipeModel extends DBRecord {
  name: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: IngredientModel[];
  method: MethodModel[];
  book?: Omit<BookModel, 'recipes'>;
}

export type RecipePreview = Required<
  Pick<RecipeModel, 'id' | 'name' | 'description'>
>;
