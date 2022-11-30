import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {ScanData} from '../../types';

import {OcrCamera} from './OcrCamera';

export function MethodScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Scan Methods'>;
  route: RouteProp<RecipeStackParamList, 'Scan Methods'>;
}) {
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
