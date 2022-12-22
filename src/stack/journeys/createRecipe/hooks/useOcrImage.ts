import {useState} from 'react';

import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import TextRecognitionManager, {
  TextData,
} from '../../../../native/textRecognition';

const simplifyScan = (data: TextData[]): string[] =>
  data.flatMap(({text}) => text.split('\n'));

export const useOcrImage = () => {
  const [scanData, setScanData] = useState<TextData[]>([]);
  const [simpleData, setSimpleData] = useState<string[]>([]);
  const scanImage = () => {
    ImagePicker.openCamera({
      freeStyleCropEnabled: true,
      cropping: true,
      useFrontCamera: true,
      showCropFrame: false,
    })
      .then(image => TextRecognitionManager.parseTextInImage(image.path))
      .then(textData => {
        setScanData(textData);
        return simplifyScan(textData);
      })
      .then(setSimpleData)
      .catch((e: unknown) => {
        if (
          e instanceof Error &&
          e?.message === 'User cancelled image selection'
        ) {
          // Expected error, do nothing
          return;
        }
        Alert.alert(JSON.stringify(e));
      });
  };

  return {scanImage, scanData, simpleData};
};
