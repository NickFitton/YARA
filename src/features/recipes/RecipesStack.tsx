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
import {ItemAggregatorScreen} from './screens/ItemAggregatorScreen';
import {BuildNameScreen} from './screens/scan/BuildName';
import {BuildDescriptionScreen} from './screens/scan/BuildDescription';
import {BuildIngredientsScreen} from './screens/scan/BuildIngredients';
import {BuildMethodsScreen} from './screens/scan/BuildMethods';

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
      <Stack.Screen name="Build Name" component={BuildNameScreen} />
      <Stack.Screen name="Scan Description" component={DescriptionScreen} />
      <Stack.Screen
        name="Build Description"
        component={BuildDescriptionScreen}
      />
      <Stack.Screen name="Scan Ingredients" component={IngredientScreen} />
      <Stack.Screen
        name="Build Ingredients"
        component={BuildIngredientsScreen}
      />
      <Stack.Screen name="Scan Methods" component={MethodScreen} />
      <Stack.Screen name="Build Methods" component={BuildMethodsScreen} />
      <Stack.Screen
        name="Item Aggregator Test"
        component={ItemAggregatorScreen}
      />
    </Stack.Navigator>
  );
}
