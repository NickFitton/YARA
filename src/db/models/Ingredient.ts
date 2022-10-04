import {Measurement} from '../../utils/measurement';
import {DBRecord} from './shared';

export type IngredientModel =
  | ({type: 'raw'} & RawIngredientModel)
  | ({type: 'parsed'} & ParsedIngredientModel);

export interface RawIngredientModel extends Partial<DBRecord> {
  ingredient: string;
}

export interface ParsedIngredientModel extends Partial<DBRecord> {
  quantity: number;
  unit: Measurement;
  name: string;
}
