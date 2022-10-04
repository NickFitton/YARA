import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Transaction} from 'react-native-sqlite-storage';
import {v4} from 'uuid';
import {useDatabase} from '../../providers/database/Provider';
import {
  IngredientModel,
  MethodModel,
  ParsedIngredientModel,
  RawIngredientModel,
  RawMethodModel,
  Recipe,
} from './types/Recipe';

export const useCreateRecipe = () => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const createRecipe = (recipe: Recipe): Promise<string> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        const recipeId = v4();
        tx.executeSql(
          'INSERT INTO Recipe (id, name, description, servings, prepTimeMinutes, cookTimeMinutes) VALUES (?, ?, ?, ?, ?, ?)',
          [
            recipeId,
            recipe.name,
            recipe.description,
            recipe.servings,
            recipe.prepTimeMinutes,
            recipe.cookTimeMinutes,
          ],
          tx => {
            recipe.ingredients.forEach(ingredient => {
              const ingredientId = v4();
              switch (ingredient.type) {
                case 'parsed':
                  tx.executeSql(
                    'INSERT INTO ParsedIngredient (id, recipeId, quantity, unit, name) VALUES (?, ?, ?, ?, ?)',
                    [
                      ingredientId,
                      recipeId,
                      ingredient.quantity,
                      ingredient.unit,
                      ingredient.name,
                    ],
                  );
                  break;
                case 'raw':
                  tx.executeSql(
                    'INSERT INTO RawIngredient (id, recipeId, ingredient) VALUES (?, ?, ?)',
                    [ingredientId, recipeId, ingredient.ingredient],
                  );
                  break;
              }
            });
            recipe.method.forEach((step, i) => {
              const stepId = v4();
              switch (step.type) {
                case 'raw':
                  tx.executeSql(
                    'INSERT INTO RawMethod (id, recipeId, step, stepIndex) VALUES (?, ?, ?, ?)',
                    [stepId, recipeId, step.step, i],
                  );
              }
            });
            resolve(recipeId);
            queryClient.invalidateQueries(['recipes']);
          },
          (_, err) => {
            reject(err);
          },
        );
      });
    });
  };
  return {createRecipe};
};

export const useDeleteRecipe = (id: string) => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const deleteRecipe = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Recipe WHERE id=?', [id], () => {
        queryClient.invalidateQueries(['recipes']);
      });
    });
  };
  return {deleteRecipe};
};

export const useRecipe = (recipeId: string) => {
  const db = useDatabase();

  return useQuery<Recipe>({
    queryKey: ['recipes', recipeId],
    queryFn: () => {
      return new Promise((resolve, reject) => {
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

          Promise.all([
            recipePromise,
            parsedIngredientsPromise,
            rawIngredientsPromise,
            rawMethodPromise,
          ]).then(([recipe, parsedIngredients, rawIngredients, rawMethod]) => {
            const raw: IngredientModel[] = rawIngredients.map(ingredient => ({
              ...ingredient,
              type: 'raw',
            }));
            const parsed: IngredientModel[] = parsedIngredients.map(
              ingredient => ({
                ...ingredient,
                type: 'parsed',
              }),
            );
            const ingredients: IngredientModel[] = [...parsed, ...raw];
            const method = [
              ...rawMethod.map(
                method => ({...method, type: 'raw'} as MethodModel),
              ),
            ];
            resolve({
              ...recipe,
              ingredients,
              method,
            });
          });
        });
      });
    },
  });
};

type RecipeById = Required<Pick<Recipe, 'id'>>;

export const useRecipes = (search?: string) => {
  const db = useDatabase();

  return useQuery<RecipeById[]>({
    queryKey: ['recipes'],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT id FROM Recipe;',
            [],
            (_, results) => {
              const rows: RecipeById[] = [];
              for (let i = 0; i < results.rows.length; i++) {
                rows.push(results.rows.item(i));
              }
              console.log(rows);
              resolve(rows);
            },
            error => {
              console.error(error);
              reject(error);
            },
          );
        });
      });
    },
  });
};

const getRecipeByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<Omit<Recipe, 'ingredients'>> => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM Recipe;',
      [],
      (_, results) => {
        if (results.rows.length === 0) {
          reject('Recipe not found');
        }
        resolve(results.rows.item(0));
      },
      error => {
        console.error(error);
        reject(error);
      },
    );
  });
};

const getParsedIngredientsByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<ParsedIngredientModel[]> => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM ParsedIngredient WHERE recipeId=?',
      [recipeId],
      (tx, result) => {
        const ingredients: ParsedIngredientModel[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          ingredients.push(result.rows.item(i));
        }
        resolve(ingredients);
      },
      (tx, error) => reject(error),
    );
  });
};

const getRawIngredientsByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<RawIngredientModel[]> => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM RawIngredient WHERE recipeId=?',
      [recipeId],
      (tx, result) => {
        const ingredients: RawIngredientModel[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          ingredients.push(result.rows.item(i));
        }
        resolve(ingredients);
      },
      (tx, error) => reject(error),
    );
  });
};

const getRawMethodByRecipeId = (
  tx: Transaction,
  recipeId: string,
): Promise<RawMethodModel[]> => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM RawMethod WHERE recipeId=?',
      [recipeId],
      (tx, result) => {
        const steps: RawMethodModel[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          steps.push(result.rows.item(i));
        }
        resolve(steps);
      },
      (tx, error) => reject(error),
    );
  });
};
