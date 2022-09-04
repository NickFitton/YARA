import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BooksScreen} from './screens/BooksScreen';
import React from 'react';

const Stack = createNativeStackNavigator();

export const BooksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BooksRoot"
        options={{title: 'Books'}}
        component={BooksScreen}
      />
    </Stack.Navigator>
  );
};
