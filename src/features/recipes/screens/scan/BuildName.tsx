import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {SingleItemAggregator} from '../../../../components/SingleItemAggregator/SingleItemAggregator';

export function BuildNameScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Build Name'>;
  route: RouteProp<RecipeStackParamList, 'Build Name'>;
}) {
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
    />
  );
}
