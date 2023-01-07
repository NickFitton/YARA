import {DBRecord} from './shared';

export interface BookModel extends DBRecord {
  name: string;
  description: string;
  author: string;
  publisher: string;
  imageLocation: string;
}

export type PartialBook = Pick<BookModel, 'id' | 'name' | 'description'>;
