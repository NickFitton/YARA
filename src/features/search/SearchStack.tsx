import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SearchScreen} from './screens/SearchScreen';
import React from 'react';

const Stack = createNativeStackNavigator();

export const SearchStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchRoot"
        options={{title: 'Search'}}
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
};
