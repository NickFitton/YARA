import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {CreateRecipeScreen} from './screens/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import {ViewRecipeScreen} from './screens/ViewRecipeScreen';
import {RecipeStackParamList} from './RecipeStackParam';
import MyBottomSheet from './screens/ViewRecipeOptions';

const Stack = createNativeStackNavigator<RecipeStackParamList>();

export function RecipesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecipesRoot"
        options={{title: 'Recipes'}}
        component={RecipesScreen}
      />
      <Stack.Screen name="Create Recipe" component={CreateRecipeScreen} />
      <Stack.Screen name="View Recipe" component={ViewRecipeScreen} />
      <Stack.Screen
        name="View Recipe Options"
        component={MyBottomSheet}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
}
