import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {CreateRecipeScreen} from './screens/CreateRecipe/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import {NameScreen} from './screens/scan/Name';
import {DescriptionScreen} from './screens/scan/Description';
import {IngredientScreen} from './screens/scan/Ingredients';
import {MethodScreen} from './screens/scan/Method';
import {ViewRecipeScreen} from './screens/ViewRecipeScreen';
import {RecipeStackParamList} from './RecipeStackParam';

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
      <Stack.Screen name="Scan Name" component={NameScreen} />
      <Stack.Screen name="Scan Description" component={DescriptionScreen} />
      <Stack.Screen name="Scan Ingredient" component={IngredientScreen} />
      <Stack.Screen name="Scan Method" component={MethodScreen} />
    </Stack.Navigator>
  );
}
