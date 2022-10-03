import {DBRecord} from './shared';

export type IngredientModel =
  | ({type: 'raw'} & RawIngredientModel)
  | ({type: 'parsed'} & ParsedIngredientModel);

interface RawIngredientModel extends Partial<DBRecord> {
  ingredient: string;
}

interface ParsedIngredientModel extends Partial<DBRecord> {
  quantity: number;
  unit: string;
  name: string;
}
