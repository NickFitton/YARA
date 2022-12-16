import React from 'react';
import {View} from 'react-native';
import {OcrCamera} from '../components/OcrCamera';
import {CreateRecipeProps, ScanData} from '../types';

export function IngredientsScreen({
  navigation,
  route,
}: CreateRecipeProps<'Scan Ingredients'>) {
  const loadBlocks = (data: ScanData | undefined) => {
    if (data) {
      const routeRecipe = route.params;
      navigation.navigate('Build Ingredients', {
        data,
        recipe: routeRecipe,
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <OcrCamera onSelect={loadBlocks} />
    </View>
  );
}
