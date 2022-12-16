import React, {useEffect, useState} from 'react';
import {SingleItemAggregator} from '../components/SingleItemAggregator';
import {CreateRecipeProps} from '../types';

export function BuildNameScreen({
  navigation,
  route,
}: CreateRecipeProps<'Build Name'>) {
  const [dataset, setDataset] = useState<string[]>([]);
  useEffect(() => {
    const newLocal = route.params.data.text.map(value => value.text);
    setDataset(newLocal);
  }, [setDataset, route]);

  const navigateToScanDescription = (name?: string) => {
    navigation.navigate('Scan Description', {name});
  };

  return (
    <SingleItemAggregator
      itemType="name"
      data={dataset}
      onSubmit={navigateToScanDescription}
      casing="title"
    />
  );
}
