// as I've omitted book from recipe
// eslint-disable-next-line import/no-cycle
import {RecipePreview} from './Recipe';
import {DBRecord} from './shared';

export interface BookModel extends DBRecord {
  name: string;
  description: string;
  author: string;
  publisher: string;
  imageLocation: string;
  recipes: RecipePreview[];
}

export type PartialBook = Pick<BookModel, 'id' | 'name' | 'description'>;

export type SearchBook = Pick<BookModel, 'id' | 'name'>;
