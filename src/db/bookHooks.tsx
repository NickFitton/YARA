import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Transaction} from 'react-native-sqlite-storage';
import {v4} from 'uuid';
import {useDatabase} from '../providers/database/Provider';
import {BookModel, PartialBook} from './models/Book';
import {DBRecord} from './models/shared';

function getQuickBooks(
  tx: Transaction,
  resolve: (value: PartialBook[]) => void,
  reject: (reason: unknown) => void,
): void {
  return tx.executeSql(
    'SELECT id, name, description FROM Book ORDER BY updatedAt DESC',
    undefined,
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
        db.readTransaction(tx => resolve(getBookByBookId(tx, bookId))).catch(
          e => reject(e),
        );
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

export const useBooks = () => {
  const db = useDatabase();

  return useQuery<PartialBook[]>({
    queryKey: ['Books'],
    queryFn: () =>
      new Promise((resolve, reject) => {
        db.readTransaction(tx => getQuickBooks(tx, resolve, reject)).catch(
          console.error,
        );
      }),
  });
};
