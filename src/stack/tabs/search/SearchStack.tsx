import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {SearchStackParamList} from './SearchStackParam';
import {SearchScreen} from './screens/SearchScreen';
import {Header} from '../../../components/Header/Header';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  const header = (props: NativeStackHeaderProps) => <Header {...props} />;
  return (
    <Stack.Navigator screenOptions={{header}}>
      <Stack.Screen
        name="SearchRoot"
        options={{title: 'Search'}}
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
}
