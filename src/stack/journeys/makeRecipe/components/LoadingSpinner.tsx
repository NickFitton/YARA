import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#111',
  },
});

export function LoadingSpinner({message}: {message: string}) {
  return (
    <View style={styles.screen}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}
