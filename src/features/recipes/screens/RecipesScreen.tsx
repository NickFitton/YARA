import { NavigationProp } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { Button, View, Text } from 'react-native';

export const RecipesScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Create Recipe')}
          title="New"
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ padding: 16 }}>
      <Text>Hello</Text>
    </View>
  );
};
