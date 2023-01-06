import React, {PropsWithChildren} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import {MD3Theme, useTheme} from 'react-native-paper';

const useStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
      backgroundColor: theme.colors.background,
      padding: 16,
    },
  });

export function ScrollScreen({
  children,
  style,
}: PropsWithChildren<{style?: ViewStyle}>) {
  const theme = useTheme();
  const styles = useStyles(theme);
  return <ScrollView style={[styles.screen, style]}>{children}</ScrollView>;
}

export function Screen({
  children,
  style,
}: PropsWithChildren<{style?: ViewStyle}>) {
  const theme = useTheme();
  const styles = useStyles(theme);
  return (
    <SafeAreaView>
      <View style={[styles.screen, style]}>{children}</View>
    </SafeAreaView>
  );
}
