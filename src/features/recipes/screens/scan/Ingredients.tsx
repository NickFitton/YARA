import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {ScanData} from '../../types';
import {OcrCamera} from './OcrCamera';

export function IngredientScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Scan Ingredients'>;
  route: RouteProp<RecipeStackParamList, 'Scan Ingredients'>;
}) {
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
