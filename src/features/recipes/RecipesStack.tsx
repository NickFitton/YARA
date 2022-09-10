import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateRecipeScreen} from './screens/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import React from 'react';
import {RecipeRealm} from './models/index';
import {NameScreen} from './screens/scan/Name';
import {DescriptionScreen} from './screens/scan/Description';
import {IngredientScreen} from './screens/scan/Ingredients';
import {MethodScreen} from './screens/scan/Method';

export type RecipeStackParamList = {
  RecipesRoot: undefined;
  'Create Recipe'?: {
    name?: string;
    description?: string;
    ingredients?: string[];
    method?: string[];
  };
  'Scan Name': undefined;
  'Scan Description': {name?: string};
  'Scan Ingredient': {name?: string; description?: string};
  'Scan Method': {name?: string; description?: string; ingredients?: string[]};
};

const Stack = createNativeStackNavigator<RecipeStackParamList>();

export const RecipesStack = () => {
  return (
    <RecipeRealm.RealmProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="RecipesRoot"
          options={{title: 'Recipes'}}
          component={RecipesScreen}
        />
        <Stack.Screen name="Create Recipe" component={CreateRecipeScreen} />
        <Stack.Screen name="Scan Name" component={NameScreen} />
        <Stack.Screen name="Scan Description" component={DescriptionScreen} />
        <Stack.Screen name="Scan Ingredient" component={IngredientScreen} />
        <Stack.Screen name="Scan Method" component={MethodScreen} />
      </Stack.Navigator>
    </RecipeRealm.RealmProvider>
  );
};
