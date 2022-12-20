import React, {useState} from 'react';

import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import TextRecognitionManager, {
  TextData,
} from '../../../../native/textRecognition';
import {CreateRecipeProps} from '../types';
import {NewSingleItemAggregator} from '../components/NewSingleItemAggregator';

const simplifyScan = (data: TextData[]): string[] => data.map(({text}) => text);

export function DescriptionScreen({
  navigation,
  route,
}: CreateRecipeProps<'Description'>) {
  const [scanData, setScanData] = useState<string[]>([]);

  const navigateToScanDescription = (description?: string) => {
    const {recipe} = route.params;
    navigation.navigate('Ingredients', {
      recipe: {...recipe, description},
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

  return (
    <NewSingleItemAggregator
      itemType="name"
      data={scanData}
      onSubmit={navigateToScanDescription}
      onRetry={scanNewImage}
      casing="title"
    />
  );
}
