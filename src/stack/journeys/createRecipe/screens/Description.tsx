import React from 'react';

import {CreateRecipeProps} from '../types';
import {SingleItemAggregator} from '../components/SingleItemAggregator';
import {useOcrImage} from '../hooks/useOcrImage';

export function DescriptionScreen({
  navigation,
  route,
}: CreateRecipeProps<'Description'>) {
  const {simpleData, scanImage} = useOcrImage();

  const navigateToScanDescription = (description?: string) => {
    const {recipe} = route.params;
    navigation.navigate('Ingredients', {
      recipe: {...recipe, description},
    });
  };

  return (
    <SingleItemAggregator
      itemType="description"
      data={simpleData}
      onSubmit={navigateToScanDescription}
      onRetry={scanImage}
      casing="sentence"
    />
  );
}
