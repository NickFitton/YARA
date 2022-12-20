import React, {useEffect, useState} from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {ItemAggregator} from '../components/ItemAggregator';
import {CreateRecipeStackParamList} from '../types';
import {SuperStackParamList} from '../../../RootStackParam';

export function MethodsScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<SuperStackParamList>;
  route: RouteProp<CreateRecipeStackParamList, 'Methods'>;
}) {
  const [dataset, setDataset] = useState<string[]>([]);
  // useEffect(() => {
  //   const newLocal = route.params.data.text.map(value => value.text);
  //   setDataset(newLocal);
  // }, [setDataset, route]);

  const onSubmit = (method: string[]) => {
    // const {recipe} = route.params;
    // navigation.navigate('Tabs', {
    //   screen: 'Recipes',
    //   params: {screen: 'Create Recipe', params: {...recipe, method}},
    // });
  };

  return (
    <ItemAggregator itemType="methods" data={dataset} onSubmit={onSubmit} />
  );
}
