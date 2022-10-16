import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {BooksScreen} from './screens/BooksScreen';

const Stack = createNativeStackNavigator();

export function BooksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BooksRoot"
        options={{title: 'Books'}}
        component={BooksScreen}
      />
    </Stack.Navigator>
  );
}
