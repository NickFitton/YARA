import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Button, View} from 'react-native';
import {SuperStackParamList} from '../../../RootStackParam';
import {useHeightDependentHeader} from '../components/HeightDependentHeader';
import {OcrCamera} from '../components/OcrCamera';
import {CreateRecipeNavigation, ScanData} from '../types';

export function NameScreen({navigation}: CreateRecipeNavigation<'Build Name'>) {
  const superNavigation = useNavigation<NavigationProp<SuperStackParamList>>();
  useHeightDependentHeader(600);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => (
        <Button
          title="Cancel"
          onPress={() =>
            superNavigation.navigate('Tabs', {
              screen: 'Recipes',
              params: {screen: 'RecipesRoot'},
            })
          }
        />
      ),
    });
  }, [navigation, superNavigation]);

  const loadBlocks = (data: ScanData | undefined) => {
    if (data) {
      navigation.navigate('Build Name', {data});
    }
  };
  return (
    <View style={{flex: 1}}>
      <OcrCamera onSelect={loadBlocks} />
    </View>
  );
}
