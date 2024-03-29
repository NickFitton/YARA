import {useQuery, useQueryClient} from '@tanstack/react-query';
import {v4} from 'uuid';

import {useDatabase} from '../../providers/database/Provider';
import {
  createNewBook,
  getBookByBookId,
  getQuickBooks,
  searchBooks,
} from '../commands/book';
import {BookModel, PartialBook, SearchBook} from '../models/Book';
import {RecipeBook} from '../models/RecipeBook';
import {DBRecord} from '../models/shared';

import {getRecipesByBookId} from './recipeHooks';

export const useBook = (bookId: string) => {
  const db = useDatabase();
  return useQuery<BookModel>({
    queryKey: ['books', bookId],
    queryFn: () =>
      new Promise((resolve, reject) => {
        db.readTransaction(tx => {
          Promise.all([
            getBookByBookId(tx, bookId),
            getRecipesByBookId(tx, bookId),
          ])
            .then(([book, recipes]) => resolve({...book, recipes}))
            .catch(e => reject(e));
        }).catch(e => reject(e));
      }),
  });
};

export const useCreateBook = () => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const createBook = (book: Omit<BookModel, keyof DBRecord>): Promise<void> =>
    new Promise((resolve, reject) => {
      db.transaction(initialTransaction => {
        createNewBook(initialTransaction, book, queryClient, resolve, reject);
      }).catch(reject);
    })
      .then(() => queryClient.invalidateQueries(['books']))
      .then(() => queryClient.invalidateQueries(['BookSearch']))
      .catch(console.log);

  return {createBook};
};

export const useBooks = (query: string) => {
  const db = useDatabase();

  return useQuery<PartialBook[]>({
    queryKey: ['BookSearch', query],
    queryFn: () =>
      new Promise((resolve, reject) => {
        db.readTransaction(tx =>
          getQuickBooks(tx, query, resolve, reject),
        ).catch(console.error);
      }),
  });
};

export const useAddToBook = (recipeId: string) => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const addToBook = ({bookId}: Pick<RecipeBook, 'bookId'>): Promise<void> =>
    new Promise((resolve, reject) => {
      db.transaction(initialTransaction => {
        const id = v4();
        initialTransaction.executeSql(
          'INSERT INTO RecipeBook (id, bookId, recipeId) VALUES (?, ?, ?)',
          [id, bookId, recipeId],
          tx => {
            tx.executeSql('UPDATE Book SET updatedAt = ? WHERE id=?;', [
              new Date().toString(),
              bookId,
            ])
              .then(() => resolve())
              .catch(reject);
            resolve();
          },
          (_, err) => {
            reject(err);
          },
        );
      })
        .then(() => queryClient.invalidateQueries(['books']))
        .then(() => queryClient.invalidateQueries(['BookSearch']))
        .catch(console.log);
    });

  return {addToBook};
};

export const useBookSearch = (query: string) => {
  const db = useDatabase();

  return useQuery<SearchBook[]>({
    queryKey: ['BookSearch', query],
    queryFn: () =>
      new Promise((resolve, reject) => {
        db.readTransaction(tx => searchBooks(tx, query, resolve, reject)).catch(
          console.error,
        );
      }),
  });
};
