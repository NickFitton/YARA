import {Realm} from '@realm/react';
import {Recipe} from '../types/Recipe';

export class RecipeModel extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  description!: string;
  servings!: number;
  prepTimeMinutes!: number;
  cookTimeMinutes!: number;
  ingredients!: string[];
  method!: string[];
  createdAt!: Date;

  public static type = 'Recipe';

  static generate(recipe: Recipe): RecipeModel {
    return {
      _id: new Realm.BSON.ObjectId(),
      createdAt: new Date(),
      ...recipe,
    } as RecipeModel;
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: RecipeModel.type,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      description: 'string?',
      servings: 'int?',
      prepTimeMinutes: 'int?',
      cookTimeMinutes: 'int?',
      ingredients: 'string<>',
      method: 'string<>',
      createdAt: 'date',
    },
  };
}
