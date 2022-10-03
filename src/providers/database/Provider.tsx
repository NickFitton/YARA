import React, {createContext, PropsWithChildren, useContext} from 'react';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

const DbContext = createContext<SQLiteDatabase | null>(null);

export const DatabaseProvider = ({
  db,
  children,
}: PropsWithChildren<{db: SQLiteDatabase}>) => (
  <DbContext.Provider value={db}>{children}</DbContext.Provider>
);

export const useDatabase = () => {
  const db = useContext(DbContext);
  if (!db) {
    throw new Error(
      'Database was not initialized before calling "useDatabase"',
    );
  }
  return db;
};
