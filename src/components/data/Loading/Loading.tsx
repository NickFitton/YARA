import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

export function LoadingFiller({subject}: {subject: string}) {
  return (
    <View
      style={{
        height: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium">Loading your {subject}</Text>
      </View>
    </View>
  );
}
