import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SuperStackParamList} from './RootStackParam';
import {Tabs} from './tabs/Tabs';
import {Journeys} from './journeys/Journeys';

const SuperStack = createNativeStackNavigator<SuperStackParamList>();

export function Stack() {
  return (
    <SuperStack.Navigator screenOptions={{headerShown: false}}>
      <SuperStack.Screen name="Tabs" component={Tabs} />
      <SuperStack.Screen name="Journeys" component={Journeys} />
    </SuperStack.Navigator>
  );
}
