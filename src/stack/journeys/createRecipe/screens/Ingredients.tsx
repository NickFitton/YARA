import React, {useState} from 'react';

import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {NewItemAggregator} from '../components/NewItemAggregator';
import TextRecognitionManager, {
  TextData,
} from '../../../../native/textRecognition';
import {CreateRecipeProps} from '../types';

const simplifyScan = (data: TextData[]): string[] => data.map(({text}) => text);

export function IngredientsScreen({
  navigation,
  route,
}: CreateRecipeProps<'Ingredients'>) {
  const [scanData, setScanData] = useState<string[]>([]);
  const [savedIngredients, setSavedIngredients] = useState<string[]>([]);

  const onSubmit = () => {
    const {recipe} = route.params;
    navigation.navigate('Methods', {
      recipe: {...recipe, ingredients: savedIngredients},
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
    setSavedIngredients(pData => [...pData, ingredient]);

  return (
    <NewItemAggregator
      itemType="ingredients"
      data={scanData}
      savedIngredients={savedIngredients}
      onSaveIngredient={onSaveIngredient}
      onScan={scanNewImage}
      onSubmit={onSubmit}
    />
  );
}
