import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';

import {CreateRecipeScreen} from './screens/CreateRecipeScreen';
import {RecipesScreen} from './screens/RecipesScreen';
import {ViewRecipeScreen} from './screens/ViewRecipeScreen';
import {RecipeStackParamList} from './RecipeStackParam';
import MyBottomSheet from './screens/ViewRecipeOptions';

const Stack = createNativeStackNavigator<RecipeStackParamList>();

function Header({options, navigation}: NativeStackHeaderProps) {
  const theme = useTheme();
  return (
    <Appbar.Header style={{backgroundColor: theme.colors.elevation.level1}}>
      <Appbar.Content title={options.title} />
      {options.headerRight?.({
        canGoBack: navigation.canGoBack(),
        tintColor: options.headerTintColor,
      })}
    </Appbar.Header>
  );
}

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
