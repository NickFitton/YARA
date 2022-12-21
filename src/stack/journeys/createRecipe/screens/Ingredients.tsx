import React, {useState} from 'react';

import {ItemAggregator} from '../components/ItemAggregator';
import {CreateRecipeProps} from '../types';
import {useOcrImage} from '../hooks/useOcrImage';

export function IngredientsScreen({
  navigation,
  route,
}: CreateRecipeProps<'Ingredients'>) {
  const {simpleData, scanImage} = useOcrImage();
  const [savedIngredients, setSavedIngredients] = useState<string[]>([]);

  const onSubmit = () => {
    const {recipe} = route.params;
    navigation.navigate('Methods', {
      recipe: {...recipe, ingredients: savedIngredients},
    });
  };
  const onSaveIngredient = (ingredient: string) =>
    setSavedIngredients(pData => [...pData, ingredient]);

  return (
    <ItemAggregator
      itemType="ingredients"
      data={simpleData}
      savedIngredients={savedIngredients}
      onSaveIngredient={onSaveIngredient}
      onScan={scanImage}
      onSubmit={onSubmit}
    />
  );
}
