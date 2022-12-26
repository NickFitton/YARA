import React, {PropsWithChildren} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {MD3Theme, useTheme} from 'react-native-paper';

const useStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
      backgroundColor: theme.colors.background,
      padding: 16,
    },
  });

export function Screen({children}: PropsWithChildren<unknown>) {
  const theme = useTheme();
  const styles = useStyles(theme);
  return <ScrollView style={styles.screen}>{children}</ScrollView>;
}
