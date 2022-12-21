import React, {useState} from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {ItemAggregator} from '../components/ItemAggregator';
import {CreateRecipeStackParamList} from '../types';
import {SuperStackParamList} from '../../../RootStackParam';
import {useOcrImage} from '../hooks/useOcrImage';

export function MethodsScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<SuperStackParamList>;
  route: RouteProp<CreateRecipeStackParamList, 'Methods'>;
}) {
  const {simpleData, scanImage} = useOcrImage();
  const [savedMethod, setSavedMethod] = useState<string[]>([]);

  const onSubmit = () => {
    const {recipe} = route.params;
    navigation.navigate('Tabs', {
      screen: 'Recipes',
      params: {
        screen: 'Create Recipe',
        params: {...recipe, method: savedMethod},
      },
    });
  };

  const onSaveMethod = (step: string) =>
    setSavedMethod(pData => [...pData, step]);

  return (
    <ItemAggregator
      text={simpleData}
      savedItems={savedMethod}
      onSaveItem={onSaveMethod}
      onScan={scanImage}
      onDone={onSubmit}
    />
  );
}
