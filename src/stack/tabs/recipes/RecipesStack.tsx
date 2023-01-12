import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';

import {CreateRecipeScreen} from './screens/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import {ViewRecipeScreen} from './screens/ViewRecipeScreen';
import {RecipeStackParamList} from './RecipeStackParam';
import {RecipeRatingsBottomSheet} from './screens/RecipeRatingsBottomSheet/RecipeRatingsBottomSheet';
import {Header} from '../../../components/Header/Header';
import {AddToBookBottomSheet} from './screens/AddToBookBottomSheet/AddToBookBottomSheet';

const Stack = createNativeStackNavigator<RecipeStackParamList>();

export function RecipesStack() {
  const header = (props: NativeStackHeaderProps) => <Header {...props} />;
  return (
    <Stack.Navigator screenOptions={{header}}>
      <Stack.Screen
        name="RecipesRoot"
        options={{title: 'Recipes'}}
        component={RecipesScreen}
      />
      <Stack.Screen name="Create Recipe" component={CreateRecipeScreen} />
      <Stack.Screen name="View Recipe" component={ViewRecipeScreen} />
      <Stack.Screen
        name="Recipe Ratings"
        component={RecipeRatingsBottomSheet}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="Add to Book"
        component={AddToBookBottomSheet}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
}
