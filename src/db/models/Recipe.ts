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
}
