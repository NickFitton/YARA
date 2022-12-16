import React from 'react';
import {View} from 'react-native';
import {HeightDependentHeader} from '../components/HeightDependentHeader';
import {OcrCamera} from '../components/OcrCamera';
import {CreateRecipeProps, ScanData} from '../types';

export function DescriptionScreen({
  navigation,
  route,
}: CreateRecipeProps<'Scan Description'>) {
  const loadBlocks = (data: ScanData | undefined) => {
    if (data) {
      const recipe = route.params;
      navigation.navigate('Build Description', {data, recipe});
    }
  };

  return (
    <HeightDependentHeader minHeight={600}>
      <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
        <OcrCamera onSelect={loadBlocks} />
      </View>
    </HeightDependentHeader>
  );
}
