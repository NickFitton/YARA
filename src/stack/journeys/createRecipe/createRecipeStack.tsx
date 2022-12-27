import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import {CreateRecipeStackParamList} from './types';
import {
  DescriptionScreen,
  IngredientsScreen,
  MethodsScreen,
  NameScreen,
} from './screens';
import {Header} from '../../../components/Header/Header';

const CreateRecipe = createNativeStackNavigator<CreateRecipeStackParamList>();

export function CreateRecipeStack() {
  const header = (props: NativeStackHeaderProps) => <Header {...props} />;
  return (
    <CreateRecipe.Navigator screenOptions={{header}}>
      <CreateRecipe.Screen name="Name" component={NameScreen} />
      <CreateRecipe.Screen name="Description" component={DescriptionScreen} />
      <CreateRecipe.Screen name="Ingredients" component={IngredientsScreen} />
      <CreateRecipe.Screen name="Methods" component={MethodsScreen} />
    </CreateRecipe.Navigator>
  );
}
