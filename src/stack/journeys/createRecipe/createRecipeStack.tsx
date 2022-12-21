import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateRecipeStackParamList} from './types';
import {
  DescriptionScreen,
  IngredientsScreen,
  MethodsScreen,
  NameScreen,
} from './screens';

const CreateRecipe = createNativeStackNavigator<CreateRecipeStackParamList>();

export function CreateRecipeStack() {
  return (
    <CreateRecipe.Navigator>
      <CreateRecipe.Screen name="Name" component={NameScreen} />
      <CreateRecipe.Screen name="Description" component={DescriptionScreen} />
      <CreateRecipe.Screen name="Ingredients" component={IngredientsScreen} />
      <CreateRecipe.Screen name="Methods" component={MethodsScreen} />
    </CreateRecipe.Navigator>
  );
}
