import React, {useEffect, useState} from 'react';

import {ItemAggregator} from '../components/ItemAggregator';
import {CreateRecipeProps} from '../types';

export function IngredientsScreen({
  navigation,
  route,
}: CreateRecipeProps<'Ingredients'>) {
  const [dataset, setDataset] = useState<string[]>([]);
  // useEffect(() => {
  //   const newLocal = route.params.data.text.map(value => value.text);
  //   setDataset(newLocal);
  // }, [setDataset, route]);

  const onSubmit = (ingredients: string[]) => {
    // const {recipe} = route.params;
    // navigation.navigate('Scan Methods', {
    //   ...recipe,
    //   ingredients,
    // });
  };

  return (
    <ItemAggregator itemType="ingredients" data={dataset} onSubmit={onSubmit} />
  );
}
