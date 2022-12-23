import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {Appbar} from 'react-native-paper';

import {CreateRecipeScreen} from './screens/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import {ViewRecipeScreen} from './screens/ViewRecipeScreen';
import {RecipeStackParamList} from './RecipeStackParam';
import MyBottomSheet from './screens/ViewRecipeOptions';
import {useCreateRecipeJourney} from '../../journeys/createRecipe/utils';

const Stack = createNativeStackNavigator<RecipeStackParamList>();

function Header({options: {title}}: NativeStackHeaderProps) {
  const startCreateRecipeJourney = useCreateRecipeJourney();
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Appbar.Action
        icon="plus"
        onPress={() => {
          startCreateRecipeJourney();
        }}
      />
    </Appbar.Header>
  );
}

export function RecipesStack() {
  return (
    <Stack.Navigator screenOptions={{header: props => <Header {...props} />}}>
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
