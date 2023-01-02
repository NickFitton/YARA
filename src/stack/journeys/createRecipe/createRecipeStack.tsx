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
      <CreateRecipe.Screen
        options={{title: 'Scan Name'}}
        name="Name"
        component={NameScreen}
      />
      <CreateRecipe.Screen
        options={{title: 'Scan Description'}}
        name="Description"
        component={DescriptionScreen}
      />
      <CreateRecipe.Screen
        options={{title: 'Scan Ingredients'}}
        name="Ingredients"
        component={IngredientsScreen}
      />
      <CreateRecipe.Screen
        options={{title: 'Scan Methods'}}
        name="Methods"
        component={MethodsScreen}
      />
    </CreateRecipe.Navigator>
  );
}
