import React from 'react';
import {View} from 'react-native';
import {OcrCamera} from '../components/OcrCamera';
import {CreateRecipeProps, ScanData} from '../types';

export function MethodScreen({
  navigation,
  route,
}: CreateRecipeProps<'Scan Methods'>) {
  const loadBlocks = (data: ScanData | undefined) => {
    if (data) {
      const recipe = route.params;
      navigation.navigate('Build Methods', {data, recipe});
    }
  };

  return (
    <View style={{flex: 1}}>
      <OcrCamera onSelect={loadBlocks} />
    </View>
  );
}
