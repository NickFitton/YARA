import {Transaction} from 'react-native-sqlite-storage';
import {ParsedIngredientModel, RawIngredientModel} from '../models/Ingredient';
import {RawMethodModel} from '../models/Method';
import {RatingModel} from '../models/Rating';
import {BaseRecipe} from '../models/Recipe';

export const getRecipeRatingsByRecipeId = (tx: Transaction, recipeId: string) =>
  new Promise<RatingModel[]>((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM Rating WHERE recipeId=?;',
      [recipeId],
      (_, results) => {
        const rows: RatingModel[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          rows.push(results.rows.item(i) as RatingModel);
        }
        resolve(rows);
      },
      (_, error) => reject(error),
    );
  });

export const getRecipeByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<BaseRecipe> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM Recipe WHERE id=?;',
      [recipeId],
      (_, results) => {
        if (results.rows.length === 0) {
          reject(new Error('Recipe not found'));
        }
        resolve(results.rows.item(0) as BaseRecipe);
      },
      error => {
        reject(error);
      },
    );
  });

export const getParsedIngredientsByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<ParsedIngredientModel[]> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM ParsedIngredient WHERE recipeId=?',
      [recipeId],
      (_, result) => {
        const ingredients: ParsedIngredientModel[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          ingredients.push(result.rows.item(i) as ParsedIngredientModel);
        }
        resolve(ingredients);
      },
      (_, error) => reject(error),
    );
  });

export const getRawIngredientsByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<RawIngredientModel[]> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM RawIngredient WHERE recipeId=?',
      [recipeId],
      (_, result) => {
        const ingredients: RawIngredientModel[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          ingredients.push(result.rows.item(i) as RawIngredientModel);
        }
        resolve(ingredients);
      },
      (_, error) => reject(error),
    );
  });

export const getRawMethodByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<RawMethodModel[]> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM RawMethod WHERE recipeId=?',
      [recipeId],
      (_, result) => {
        const steps: RawMethodModel[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          steps.push(result.rows.item(i) as RawMethodModel);
        }
        resolve(steps);
      },
      (_, error) => reject(error),
    );
  });

export const deleteRecipeById = (
  tx: Transaction,
  recipeId: string,
): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.executeSql(
      'DELETE FROM Recipe WHERE id=?',
      [recipeId],
      () => resolve(),
      reject,
    );
  });
