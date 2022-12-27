import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';

import {TabStackParamList} from './types';
import {RecipesStack} from './recipes/RecipesStack';
import {BooksStack} from './books/BooksStack';
import {SearchStack} from './search/SearchStack';
import {SettingsStack} from './settings/SettingsStack';

const Tab = createMaterialBottomTabNavigator<TabStackParamList>();

const renderIcon = (iconName: string) =>
  function TabIcon({color}: {color: string}) {
    return <MaterialCommunityIcons name={iconName} color={color} size={26} />;
  };

export function Tabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator barStyle={{backgroundColor: theme.colors.elevation.level1}}>
      <Tab.Screen
        name="Recipes"
        component={RecipesStack}
        options={{
          tabBarIcon: renderIcon('chef-hat'),
          tabBarColor: theme.colors.error,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{tabBarIcon: renderIcon('magnify')}}
      />
      <Tab.Screen
        name="Books"
        component={BooksStack}
        options={{tabBarIcon: renderIcon('book')}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{tabBarIcon: renderIcon('cog')}}
      />
    </Tab.Navigator>
  );
}
