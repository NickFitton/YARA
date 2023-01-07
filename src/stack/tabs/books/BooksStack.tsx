import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {Header} from '../../../components/Header/Header';
import {BookStackParamList} from './BookStackParam';
import {BooksScreen} from './screens/BooksScreen';
import {CreateBookScreen} from './screens/CreateBookScreen';
import {ViewBookScreen} from './screens/ViewBookScreen';

const Stack = createNativeStackNavigator<BookStackParamList>();

export function BooksStack() {
  const header = (props: NativeStackHeaderProps) => <Header {...props} />;
  return (
    <Stack.Navigator screenOptions={{header}}>
      <Stack.Screen
        name="BooksRoot"
        options={{title: 'Books'}}
        component={BooksScreen}
      />
      <Stack.Screen
        name="Create Book"
        options={{title: 'New Book'}}
        component={CreateBookScreen}
      />
      <Stack.Screen name="View Book" component={ViewBookScreen} />
    </Stack.Navigator>
  );
}
