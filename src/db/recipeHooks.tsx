import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Transaction} from 'react-native-sqlite-storage';
import {v4} from 'uuid';
import {
  IngredientModel,
  ParsedIngredientModel,
  RawIngredientModel,
} from './models/Ingredient';
import {MethodModel, RawMethodModel} from './models/Method';
import {RecipeModel, RecipePreview} from './models/Recipe';
import {useDatabase} from '../providers/database/Provider';
import {RatingModel} from './models/Rating';
import {DBRecord} from './models/shared';
import {getBookByRecipeId} from './bookHooks';

type BaseRecipe = Omit<RecipeModel, 'ingredients' | 'method'>;

const getRecipeRatingsByRecipeId = (tx: Transaction, recipeId: string) =>
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

const getRecipeByRecipeId = (
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

const getParsedIngredientsByRecipeId = (
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

const getRawIngredientsByRecipeId = (
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

const getRawMethodByRecipeId = (
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

export const useCreateRecipe = () => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const createRecipe = (
    recipe: Omit<RecipeModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      db.transaction(initialTransaction => {
        const recipeId = v4();
        initialTransaction.executeSql(
          'INSERT INTO Recipe (id, name, description, servings, prepTimeMinutes, cookTimeMinutes) VALUES (?, ?, ?, ?, ?, ?)',
          [
            recipeId,
            recipe.name,
            recipe.description,
            recipe.servings,
            recipe.prepTimeMinutes,
            recipe.cookTimeMinutes,
          ],
          passedTransaction => {
            recipe.ingredients.forEach(ingredient => {
              const ingredientId = v4();
              switch (ingredient.type) {
                case 'parsed':
                  passedTransaction
                    .executeSql(
                      'INSERT INTO ParsedIngredient (id, recipeId, quantity, unit, name) VALUES (?, ?, ?, ?, ?)',
                      [
                        ingredientId,
                        recipeId,
                        ingredient.quantity,
                        ingredient.unit,
                        ingredient.name,
                      ],
                    )
                    .catch(console.trace);
                  break;
                case 'raw':
                  passedTransaction
                    .executeSql(
                      'INSERT INTO RawIngredient (id, recipeId, ingredient) VALUES (?, ?, ?)',
                      [ingredientId, recipeId, ingredient.ingredient],
                    )
                    .catch(console.trace);
                  break;
              }
            });
            recipe.method.forEach((step, i) => {
              const stepId = v4();
              switch (step.type) {
                case 'raw':
                  passedTransaction
                    .executeSql(
                      'INSERT INTO RawMethod (id, recipeId, step, stepIndex) VALUES (?, ?, ?, ?)',
                      [stepId, recipeId, step.step, i],
                    )
                    .catch(console.trace);
              }
            });
            resolve(recipeId);
            queryClient.invalidateQueries(['recipes']).catch(console.trace);
          },
          (_, err) => {
            reject(err);
          },
        );
      }).catch(console.trace);
    });
  return {createRecipe};
};

export const useDeleteRecipe = (id: string) => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const deleteRecipe = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Recipe WHERE id=?', [id], () => {
        queryClient.invalidateQueries(['recipes']).catch(console.trace);
      });
    }).catch(console.trace);
  };
  return {deleteRecipe};
};

export const useRecipe = (recipeId: string) => {
  const db = useDatabase();

  return useQuery<RecipeModel>({
    queryKey: ['recipes', recipeId],
    queryFn: () =>
      new Promise(resolve => {
        db.readTransaction(tx => {
          const parsedIngredientsPromise = getParsedIngredientsByRecipeId(
            tx,
            recipeId,
          );
          const rawIngredientsPromise = getRawIngredientsByRecipeId(
            tx,
            recipeId,
          );
          const rawMethodPromise = getRawMethodByRecipeId(tx, recipeId);
          const recipePromise = getRecipeByRecipeId(tx, recipeId);
          const bookPromise = getBookByRecipeId(tx, recipeId);

          Promise.all([
            recipePromise,
            parsedIngredientsPromise,
            rawIngredientsPromise,
            rawMethodPromise,
            bookPromise,
          ])
            .then(
              ([
                recipe,
                parsedIngredients,
                rawIngredients,
                rawMethod,
                book,
              ]) => {
                console.log(book);
                const raw: IngredientModel[] = rawIngredients.map(
                  ingredient => ({
                    ...ingredient,
                    type: 'raw',
                  }),
                );
                const parsed: IngredientModel[] = parsedIngredients.map(
                  ingredient => ({
                    ...ingredient,
                    type: 'parsed',
                  }),
                );
                const ingredients: IngredientModel[] = [...parsed, ...raw];
                const method = [
                  ...rawMethod.map(
                    rMethod => ({...rMethod, type: 'raw'} as MethodModel),
                  ),
                ];
                resolve({
                  ...recipe,
                  ingredients,
                  method,
                  book,
                });
              },
            )
            .catch(e => {
              console.log(recipeId);
              console.trace(e);
            });
        }).catch(console.trace);
      }),
  });
};

export type Rating = Omit<RatingModel, keyof DBRecord | 'recipeId'>;

/**
 * id, recipeId, rater, value, scaleFrom, scaleTo
 * @param recipeId
 * @param rating
 * @returns
 */
const flattenRating = (
  recipeId: string,
  rating: Rating,
): [string, string, string, number, number, number] => [
  v4(),
  recipeId,
  rating.rater,
  rating.value,
  rating.scaleFrom,
  rating.scaleTo,
];

const genValueTemplate = (
  variableCount: number,
  valueCount: number,
): string => {
  const variableTemplate = `(${new Array(variableCount).fill('?').join(', ')})`;
  return new Array(valueCount).fill(variableTemplate).join(', ');
};

export const useRateRecipe = (id: string) => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const rateRecipe = (ratings: Rating[]) =>
    db.transaction(tx => {
      console.log(ratings);
      tx.executeSql(
        `INSERT INTO Rating (id, recipeId, rater, value, scaleFrom, scaleTo) VALUES ${genValueTemplate(
          6,
          ratings.length,
        )}`,
        ratings.flatMap(rating => flattenRating(id, rating)),
      )
        .then(() => queryClient.invalidateQueries(['recipes', id, 'ratings']))
        .catch(console.trace);
    });
  return {rateRecipe};
};

export const useRecipeRatings = (recipeId: string) => {
  const db = useDatabase();

  return useQuery<RatingModel[]>({
    queryKey: ['recipes', recipeId, 'ratings'],
    queryFn: () =>
      new Promise(resolve => {
        db.readTransaction(tx => {
          const ratingsPromise = getRecipeRatingsByRecipeId(tx, recipeId);
          resolve(ratingsPromise);
        }).catch(console.trace);
      }),
  });
};

type RecipeById = Required<Pick<RecipeModel, 'id'>>;

// TODO: Add search to hook
export const useRecipes = () => {
  const db = useDatabase();

  return useQuery<RecipeById[]>({
    queryKey: ['recipes'],
    queryFn: () =>
      new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT id FROM Recipe;',
            [],
            (_, results) => {
              const rows: RecipeById[] = [];
              for (let i = 0; i < results.rows.length; i++) {
                rows.push(results.rows.item(i) as RecipeById);
              }
              resolve(rows);
            },
            error => {
              reject(error);
            },
          );
        }).catch(console.trace);
      }),
  });
};

export const getRecipesByBookId = (tx: Transaction, bookId: string) =>
  new Promise<RecipePreview[]>((resolve, reject) => {
    tx.executeSql(
      `SELECT
         A.id, A.name, A.description
     FROM
         Recipe A
     WHERE
         A.id in (
             select B.recipeId from RecipeBook B where B.bookId = ?
);`,
      [bookId],
      (_, success) => {
        console.log(`Oh my god it actually worked: ${success.rows.length}`);
        const data = [];
        for (let i = 0; i < success.rows.length; i++) {
          data.push(success.rows.item(i) as RecipePreview);
        }
        console.log(data);
        resolve(data);
      },
      error => reject(error),
    );
  });
