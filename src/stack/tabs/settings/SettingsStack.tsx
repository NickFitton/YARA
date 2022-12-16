import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SettingsStackParamList} from './SettingsStackParam';
import {SettingsScreen} from './screens/SettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsRoot"
        options={{title: 'Settings'}}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}
