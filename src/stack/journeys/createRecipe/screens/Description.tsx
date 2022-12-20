import React, {useEffect, useState} from 'react';

import {SingleItemAggregator} from '../components/SingleItemAggregator';
import {CreateRecipeProps} from '../types';

export function DescriptionScreen({
  navigation,
  route,
}: CreateRecipeProps<'Description'>) {
  const [dataset, setDataset] = useState<string[]>([]);
  // useEffect(() => {
  //   route.params.recipe.name;
  //   const newLocal = route.params.data.text.map(value => value.text);
  //   setDataset(newLocal);
  // }, [setDataset, route]);

  const navigateToScanDescription = (description?: string) => {
    // const {recipe} = route.params;
    // navigation.navigate('Ingredients', {
    //   ...recipe,
    //   description,
    // });
  };

  return (
    <SingleItemAggregator
      itemType="name"
      data={dataset}
      onSubmit={navigateToScanDescription}
      casing="sentence"
    />
  );
}
