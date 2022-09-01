import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateRecipeScreen } from './screens/CreateRecipeScreen';
import { RecipesScreen } from './screens/RecipesScreen';
import React from 'react';
const Stack = createNativeStackNavigator();

export const RecipesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecipesRoot"
        options={{ title: 'Recipes' }}
        component={RecipesScreen}
      />
      <Stack.Screen name="Create Recipe" component={CreateRecipeScreen} />
    </Stack.Navigator>
  );
};
