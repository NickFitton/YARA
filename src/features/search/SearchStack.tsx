import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SearchScreen} from './screens/SearchScreen';

const Stack = createNativeStackNavigator();

export function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchRoot"
        options={{title: 'Search'}}
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
}
