import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {ItemAggregator} from '../../../../components/ItemAggregator/ItemAggregator';

export function BuildIngredientsScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'Build Ingredients'>;
  route: RouteProp<RecipeStackParamList, 'Build Ingredients'>;
}) {
  const [dataset, setDataset] = useState<string[]>([]);
  useEffect(() => {
    const newLocal = route.params.data.text.map(value => value.text);
    setDataset(newLocal);
  }, [setDataset, route]);

  const onSubmit = (ingredients: string[]) => {
    const {recipe} = route.params;
    navigation.navigate('Scan Methods', {
      ...recipe,
      ingredients,
    });
  };

  return (
    <ItemAggregator itemType="ingredients" data={dataset} onSubmit={onSubmit} />
  );
}
