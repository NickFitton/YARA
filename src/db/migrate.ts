import {SQLiteDatabase} from 'react-native-sqlite-storage';

export const manifest = [
  `CREATE TABLE IF NOT EXISTS RawIngredient(
  id TEXT PRIMARY KEY NOT NULL,
  recipeId INTEGER NOT NULL,
  ingredient TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  `CREATE TABLE IF NOT EXISTS ParsedIngredient(
  id TEXT PRIMARY KEY NOT NULL,
  recipeId INTEGER NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT,
  name TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  `CREATE TABLE IF NOT EXISTS RawMethod(
  id TEXT PRIMARY KEY NOT NULL,
  recipeId INTEGER NOT NULL,
  step TEXT NOT NULL,
  stepIndex INTEGER NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  `create TABLE IF NOT EXISTS Recipe(
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  servings INT NOT NULL,
  prepTimeMinutes INT NOT NULL,
  cookTimeMinutes INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
];

export const teardown = [
  'DROP TABLE IF EXISTS RawIngredient;',
  'DROP TABLE IF EXISTS ParsedIngredient;',
  'DROP TABLE IF EXISTS RawMethod;',
  'DROP TABLE IF EXISTS Recipe;',
];

export const migrate = (db: SQLiteDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      manifest.forEach(tableDef => txn.executeSql(tableDef, []));
      resolve();
    });
  });
};

const recursiveExecutions = (statements: string[]) => {};
