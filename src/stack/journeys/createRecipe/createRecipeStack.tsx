import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateRecipeStackParamList} from './types';
import {
  BuildDescriptionScreen,
  BuildMethodsScreen,
  DescriptionScreen,
  MethodScreen,
  BuildIngredientsScreen,
  BuildNameScreen,
  IngredientsScreen,
  NameScreen,
} from './screens';

const CreateRecipe = createNativeStackNavigator<CreateRecipeStackParamList>();

export function CreateRecipeStack() {
  return (
    <CreateRecipe.Navigator>
      <CreateRecipe.Screen name="Scan Name" component={NameScreen} />
      <CreateRecipe.Screen name="Build Name" component={BuildNameScreen} />
      <CreateRecipe.Screen
        name="Scan Description"
        component={DescriptionScreen}
      />
      <CreateRecipe.Screen
        name="Build Description"
        component={BuildDescriptionScreen}
      />
      <CreateRecipe.Screen
        name="Scan Ingredients"
        component={IngredientsScreen}
      />
      <CreateRecipe.Screen
        name="Build Ingredients"
        component={BuildIngredientsScreen}
      />
      <CreateRecipe.Screen name="Scan Methods" component={MethodScreen} />
      <CreateRecipe.Screen
        name="Build Methods"
        component={BuildMethodsScreen}
      />
    </CreateRecipe.Navigator>
  );
}
