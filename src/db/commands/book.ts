import {QueryClient} from '@tanstack/react-query';
import {Transaction} from 'react-native-sqlite-storage';
import {v4} from 'uuid';

import {BookModel, PartialBook, SearchBook} from '../models/Book';
import {DBRecord} from '../models/shared';

export const getBookByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<BookModel | undefined> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      `SELECT A.* FROM Book A WHERE A.id in ( select B.bookId from RecipeBook B where B.recipeId = ? );`,
      [recipeId],
      (_, recipeResults) => {
        const book = recipeResults.rows.item(0) as BookModel;
        resolve(book);
      },
      error => reject(error),
    );
  });

export const searchBooks = (
  tx: Transaction,
  query: string,
  resolve: (value: SearchBook[]) => void,
  reject: (reason: unknown) => void,
): void =>
  tx.executeSql(
    'SELECT id, name FROM Book WHERE name LIKE ? ORDER BY updatedAt DESC',
    [`%${query}%`],
    (_, results) => {
      const rows: SearchBook[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        rows.push(results.rows.item(i) as SearchBook);
      }
      resolve(rows);
    },
    e => {
      reject(e);
    },
  );

export const getQuickBooks = (
  tx: Transaction,
  query: string,
  resolve: (value: PartialBook[]) => void,
  reject: (reason: unknown) => void,
): void =>
  tx.executeSql(
    'SELECT id, name, description FROM Book WHERE name LIKE ? ORDER BY updatedAt DESC',
    [`%${query}%`],
    (_, results) => {
      const rows: PartialBook[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        rows.push(results.rows.item(i) as PartialBook);
      }
      resolve(rows);
    },
    e => {
      reject(e);
    },
  );

export const getBookByBookId = (
  tx: Transaction,
  bookId: string,
): Promise<BookModel> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM Book WHERE id=?;',
      [bookId],
      (_, results) => {
        if (results.rows.length === 0) {
          reject(new Error('Book not found'));
        }
        resolve(results.rows.item(0) as BookModel);
      },
      error => {
        reject(error);
      },
    );
  });

export function createNewBook(
  tx: Transaction,
  book: Omit<BookModel, keyof DBRecord>,
  queryClient: QueryClient,
  resolve: (value: string) => void,
  reject: (reason?: unknown) => void,
) {
  const bookId = v4();
  tx.executeSql(
    `INSERT INTO Book (id, name, description, author, publisher, imageLocation) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      bookId,
      book.name,
      book.description,
      book.author,
      book.publisher,
      book.imageLocation,
    ],
    () => {
      queryClient.invalidateQueries(['books']).catch(console.trace);
      resolve(bookId);
    },
    (_, err) => reject(err),
  );
}
