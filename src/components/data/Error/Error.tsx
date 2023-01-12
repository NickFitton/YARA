import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

export function ErrorFiller({
  subject,
  error,
}: {
  subject: string;
  error: unknown;
}) {
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
        <Text variant="displayMedium">Something went wrong</Text>
        <Text variant="bodyMedium">
          We couldn&apos;t retrieve your {subject}, you can go back and try
          again.
        </Text>
        <Text variant="displaySmall">{JSON.stringify(error)}</Text>
      </View>
    </View>
  );
}
