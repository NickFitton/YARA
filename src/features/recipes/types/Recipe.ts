export interface DBRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe extends Partial<DBRecord> {
  name: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: IngredientModel[];
  method: MethodModel[];
}

export interface RecipeModel extends Required<Recipe> {}

export interface RawIngredientModel extends Partial<DBRecord> {
  ingredient: string;
}

export interface ParsedIngredientModel extends Partial<DBRecord> {
  quantity: number;
  unit?: string;
  name: string;
}

export interface RawMethodModel extends Partial<DBRecord> {
  step: string;
}

export type IngredientModel =
  | ({type: 'raw'} & RawIngredientModel)
  | ({type: 'parsed'} & ParsedIngredientModel);

export type MethodModel = {type: 'raw'} & RawMethodModel;
