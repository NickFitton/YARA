import React, {useState} from 'react';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import TextRecognitionManager, {
  TextData,
} from '../../../../native/textRecognition';
import {NewSingleItemAggregator} from '../components/NewSingleItemAggregator';

import {CreateRecipeProps} from '../types';

const simplifyScan = (data: TextData[]): string[] => data.map(({text}) => text);

export function NameScreen({navigation}: CreateRecipeProps<'Name'>) {
  const [scanData, setScanData] = useState<string[]>([]);

  const navigateToScanDescription = (name: string | undefined) => {
    navigation.navigate('Description', {
      recipe: {name},
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
