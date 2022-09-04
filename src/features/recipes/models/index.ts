import {createRealmContext} from '@realm/react';
import {RecipeModel} from './Recipe';

const config = {
  schema: [RecipeModel.schema],
};

export const RecipeRealm = createRealmContext(config);
