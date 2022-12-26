import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {SettingsStackParamList} from './SettingsStackParam';
import {SettingsScreen} from './screens/SettingsScreen';
import {Header} from '../../../components/Header/Header';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  const header = (props: NativeStackHeaderProps) => <Header {...props} />;
  return (
    <Stack.Navigator screenOptions={{header}}>
      <Stack.Screen
        name="SettingsRoot"
        options={{title: 'Settings'}}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}
