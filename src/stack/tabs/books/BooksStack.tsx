import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {Header} from '../../../components/Header/Header';
import {BookStackParamList} from './BookStackParam';
import {BooksScreen} from './screens/BooksScreen';

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
    </Stack.Navigator>
  );
}
