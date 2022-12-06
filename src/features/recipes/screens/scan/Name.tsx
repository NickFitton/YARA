import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {OcrCamera} from './OcrCamera';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {ScanData} from '../../types';

export function NameScreen({
  navigation,
}: {
  navigation: NavigationProp<RecipeStackParamList>;
}) {
  const loadBlocks = (data: ScanData | undefined) => {
    if (data) {
      navigation.navigate('Build Name', {data});
    }
  };
  return (
    <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
      <OcrCamera onSelect={loadBlocks} />
    </View>
  );
}
