import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {ItemAggregator} from '../../../../components/ItemAggregator/ItemAggregator';

export function BuildMethodsScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Build Methods'>;
  route: RouteProp<RecipeStackParamList, 'Build Methods'>;
}) {
  const [dataset, setDataset] = useState<string[]>([]);
  useEffect(() => {
    const newLocal = route.params.data.text.map(value => value.text);
    setDataset(newLocal);
  }, [setDataset, route]);

  const onSubmit = (method: string[]) => {
    const {recipe} = route.params;
    navigation.navigate('Create Recipe', {...recipe, method});
  };

  return (
    <ItemAggregator itemType="methods" data={dataset} onSubmit={onSubmit} />
  );
}
