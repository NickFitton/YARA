import {RecipeModel} from './Recipe';
import {DBRecord} from './shared';

export interface BookModel extends DBRecord {
  name: string;
  description: string;
  author: string;
  publisher: string;
  imageLocation: string;
  recieps: RecipeModel[];
}

export type PartialBook = Pick<BookModel, 'id' | 'name' | 'description'>;
