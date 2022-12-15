import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {SingleItemAggregator} from '../../../../components/SingleItemAggregator/SingleItemAggregator';

export function BuildDescriptionScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Build Description'>;
  route: RouteProp<RecipeStackParamList, 'Build Description'>;
}) {
  const [dataset, setDataset] = useState<string[]>([]);
  useEffect(() => {
    const newLocal = route.params.data.text.map(value => value.text);
    setDataset(newLocal);
  }, [setDataset, route]);

  const navigateToScanDescription = (description?: string) => {
    const {recipe} = route.params;
    navigation.navigate('Scan Ingredients', {
      ...recipe,
      description,
    });
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
