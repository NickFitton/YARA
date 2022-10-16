import {DBRecord} from './shared';

export interface RawIngredientModel extends Partial<DBRecord> {
  ingredient: string;
}

export type Measurement =
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'l'
  | 'ml'
  | 'g'
  | 'mg'
  | 'kg';

export interface ParsedIngredientModel extends Partial<DBRecord> {
  quantity: number;
  unit?: Measurement;
  name: string;
}

export type IngredientModel =
  | ({type: 'raw'} & RawIngredientModel)
  | ({type: 'parsed'} & ParsedIngredientModel);
