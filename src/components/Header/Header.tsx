import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';

export function Header({options, navigation}: NativeStackHeaderProps) {
  const theme = useTheme();
  return (
    <Appbar.Header style={{backgroundColor: theme.colors.elevation.level1}}>
      <Appbar.Content title={options.title} />
      {options.headerRight?.({
        canGoBack: navigation.canGoBack(),
        tintColor: options.headerTintColor,
      })}
    </Appbar.Header>
  );
}
