import React, {useState} from 'react';

import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {ItemAggregator} from '../components/ItemAggregator';
import TextRecognitionManager, {
  TextData,
} from '../../../../native/textRecognition';
import {CreateRecipeStackParamList} from '../types';
import {SuperStackParamList} from '../../../RootStackParam';

const simplifyScan = (data: TextData[]): string[] => data.map(({text}) => text);

export function MethodsScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<SuperStackParamList>;
  route: RouteProp<CreateRecipeStackParamList, 'Methods'>;
}) {
  const [scanData, setScanData] = useState<string[]>([]);
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

  const scanNewImage = () => {
    ImagePicker.openCamera({
      freeStyleCropEnabled: true,
      cropping: true,
      showCropFrame: false,
    })
      .then(image => TextRecognitionManager.parseTextInImage(image.path))
      .then(simplifyScan)
      .then(setScanData)
      .catch(Alert.alert);
  };

  const onSaveIngredient = (ingredient: string) =>
    setSavedMethod(pData => [...pData, ingredient]);

  return (
    <ItemAggregator
      itemType="methods"
      data={scanData}
      savedIngredients={savedMethod}
      onSaveIngredient={onSaveIngredient}
      onScan={scanNewImage}
      onSubmit={onSubmit}
    />
  );
}
