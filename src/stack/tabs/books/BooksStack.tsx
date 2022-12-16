import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {BookStackParamList} from './BookStackParam';
import {BooksScreen} from './screens/BooksScreen';

const Stack = createNativeStackNavigator<BookStackParamList>();

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
