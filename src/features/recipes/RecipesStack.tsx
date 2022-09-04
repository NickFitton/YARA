import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateRecipeScreen} from './screens/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import React from 'react';
import {RecipeRealm} from './models/index';

const Stack = createNativeStackNavigator();

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
      </Stack.Navigator>
    </RecipeRealm.RealmProvider>
  );
};
