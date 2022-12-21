import React from 'react';

import {SingleItemAggregator} from '../components/SingleItemAggregator';
import {useOcrImage} from '../hooks/useOcrImage';

import {CreateRecipeProps} from '../types';

export function NameScreen({navigation}: CreateRecipeProps<'Name'>) {
  const {simpleData, scanImage} = useOcrImage();

  const navigateToScanDescription = (name: string | undefined) => {
    navigation.navigate('Description', {
      recipe: {name},
    });
  };

  return (
    <SingleItemAggregator
      itemType="name"
      data={simpleData}
      onSubmit={navigateToScanDescription}
      onRetry={scanImage}
      casing="title"
    />
  );
}
