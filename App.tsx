import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {BooksStack} from './src/features/books/BooksStack';
import {RecipesStack} from './src/features/recipes/RecipesStack';
import {SearchStack} from './src/features/search/SearchStack';

export type TabParamList = {
  Recipes: undefined;
  Search: undefined;
  Books: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Recipes" component={RecipesStack} />
        <Tab.Screen name="Search" component={SearchStack} />
        <Tab.Screen name="Books" component={BooksStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
