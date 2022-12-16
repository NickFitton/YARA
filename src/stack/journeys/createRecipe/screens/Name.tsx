import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Button, View} from 'react-native';
import {SuperStackParamList} from '../../../RootStackParam';
import {HeightDependentHeader} from '../components/HeightDependentHeader';
import {OcrCamera} from '../components/OcrCamera';
import {CreateRecipeNavigation, ScanData} from '../types';

export function NameScreen({navigation}: CreateRecipeNavigation<'Build Name'>) {
  const superNavigation = useNavigation<NavigationProp<SuperStackParamList>>();

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
    <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
      <HeightDependentHeader minHeight={600}>
        <OcrCamera onSelect={loadBlocks} />
      </HeightDependentHeader>
    </View>
  );
}
