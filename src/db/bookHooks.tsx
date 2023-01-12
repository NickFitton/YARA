import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Transaction} from 'react-native-sqlite-storage';
import {v4} from 'uuid';
import {useDatabase} from '../providers/database/Provider';
import {BookModel, PartialBook, SearchBook} from './models/Book';
import {RecipeBook} from './models/RecipeBook';
import {DBRecord} from './models/shared';
import {getRecipesByBookId} from './recipeHooks';

function getQuickBooks(
  tx: Transaction,
  query: string,
  resolve: (value: PartialBook[]) => void,
  reject: (reason: unknown) => void,
): void {
  return tx.executeSql(
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
}

const getBookByBookId = (tx: Transaction, bookId: string): Promise<BookModel> =>
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

  const createBook = ({
    name,
    description,
    author,
    publisher,
    imageLocation,
  }: Omit<BookModel, keyof DBRecord>): Promise<string> =>
    new Promise((resolve, reject) => {
      db.transaction(initialTransaction => {
        const bookId = v4();
        initialTransaction.executeSql(
          `INSERT INTO Book (id, name, description, author, publisher, imageLocation) VALUES (?, ?, ?, ?, ?, ?)`,
          [bookId, name, description, author, publisher, imageLocation],
          () => {
            queryClient.invalidateQueries(['books']).catch(console.trace);
            resolve(bookId);
          },
          (_, err) => reject(err),
        );
      }).catch(console.log);
    });

  return {createBook};
};

export const useBooks = (query: string) => {
  const db = useDatabase();

  return useQuery<PartialBook[]>({
    queryKey: ['Books', 'search', query],
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
          () => {
            queryClient
              .invalidateQueries(['books', bookId])
              .catch(console.trace);
            resolve();
          },
          (_, err) => {
            reject(err);
          },
        );
      }).catch(console.log);
    });

  return {addToBook};
};

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

const SearchBooks = (
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

export const useBookSearch = (query: string) => {
  const db = useDatabase();

  return useQuery<SearchBook[]>({
    queryKey: ['Book Search', query],
    queryFn: () =>
      new Promise((resolve, reject) => {
        db.readTransaction(tx => SearchBooks(tx, query, resolve, reject)).catch(
          console.error,
        );
      }),
  });
};
