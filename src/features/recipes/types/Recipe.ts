import {Measurement} from '../../../utils/measurement';

export interface IDBRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipe extends Partial<IDBRecord> {
  name: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: IIngredientModel[];
  method: IMethodModel[];
}

export interface IRecipeModel extends Required<IRecipe> {}

export interface IRawIngredientModel extends Partial<IDBRecord> {
  ingredient: string;
}

export interface IParsedIngredientModel extends Partial<IDBRecord> {
  quantity: number;
  unit?: Measurement;
  name: string;
}

export interface IRawMethodModel extends Partial<IDBRecord> {
  step: string;
}

export type IIngredientModel =
  | ({type: 'raw'} & IRawIngredientModel)
  | ({type: 'parsed'} & IParsedIngredientModel);

export type IMethodModel = {type: 'raw'} & IRawMethodModel;
