import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {TabStackParamList} from './types';
import {RecipesStack} from './recipes/RecipesStack';
import {BooksStack} from './books/BooksStack';
import {SearchStack} from './search/SearchStack';
import {SettingsStack} from './settings/SettingsStack';

const Tab = createBottomTabNavigator<TabStackParamList>();

export function Tabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Recipes" component={RecipesStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Books" component={BooksStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
