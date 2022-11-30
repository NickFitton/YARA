import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {ScanData} from '../../types';
import {OcrCamera} from './OcrCamera';

export function DescriptionScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Scan Description'>;
  route: RouteProp<RecipeStackParamList, 'Scan Description'>;
}) {
  const loadBlocks = (data: ScanData | undefined) => {
    if (data) {
      const recipe = route.params;
      navigation.navigate('Build Description', {data, recipe});
    }
  };

  return (
    <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
      <OcrCamera onSelect={loadBlocks} />
    </View>
  );
}
