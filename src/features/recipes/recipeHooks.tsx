import {Recipe} from './types/Recipe';
import {v4} from 'uuid';
import {RecipeRealm} from './models';
import {RecipeModel} from './models/Recipe';

export const useRecipeStorage = () => {
  const realm = RecipeRealm.useRealm();
  const createRecipe = async (
    newRecipe: Recipe,
  ): Promise<Realm.BSON.ObjectId> => {
    const newLocal = RecipeModel.generate(newRecipe);
    // Save recipe somewhere
    try {
      realm.write(() => realm.create(RecipeModel.type, newLocal));
    } catch (e) {
      console.log(e);
    }
    return newLocal._id;
  };

  const recipes = realm.objects<RecipeModel>(RecipeModel.type);

  const getRecipe = (recipeId: string) => {};

  const updateRecipe = (recipeId: string, updatedValues: Partial<Recipe>) => {};

  const deleteRecipe = (recipeId: string) => {};

  return {
    createRecipe,
    recipes,
    getRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
