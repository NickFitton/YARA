import {useFocusEffect} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {TextInput, View, Button, Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import TextRecognitionManager, {
  TextData,
} from '../../../../native/textRecognition';
import {NewSingleItemAggregator} from '../components/NewSingleItemAggregator';

import {CreateRecipeProps} from '../types';

const simplifyScan = (data: TextData[]): string[] => data.map(({text}) => text);

export function NameScreen({navigation}: CreateRecipeProps<'Name'>) {
  // const [dataset, setDataset] = useState<string[]>([]);
  // useEffect(() => {
  //   const newLocal = route.params.data.text.map(value => value.text);
  //   setDataset(newLocal);
  // }, [setDataset, route]);

  const ref = useRef<TextInput>(null);
  const [scanData, setScanData] = useState<string[]>([]);

  const navigateToScanDescription = () => {
    navigation.navigate('Description', {
      recipe: {name: ref.current?.props.value},
    });
  };

  useFocusEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button title="Next" onPress={() => navigateToScanDescription()} />
      ),
    });
  });

  const scanNewImage = () => {
    ImagePicker.openCamera({
      cropping: true,
    })
      .then(image => {
        console.log(image);
        return TextRecognitionManager.parseTextInImage(image.path);
      })
      .then(simplifyScan)
      .then(setScanData)
      .catch(Alert.alert);
  };

  // return (
  //   <View>
  //     <TextInput placeholder="Recipe name here" ref={ref} />
  //     <Button
  //       title={`Scan${scanData.length !== 0 ? ' Again' : ''}`}
  //       onPress={() => {
  //         ImagePicker.openCamera({
  //           cropping: true,
  //         })
  //           .then(image => {
  //             console.log(image);
  //             return TextRecognitionManager.parseTextInImage(image.path);
  //           })
  //           .then(setScanData)
  //           .catch(Alert.alert);
  //       }}
  //     />
  //     <FlatList
  //       data={scanData}
  //       renderItem={renderItem}
  //       keyExtractor={extractKey}
  //     />
  //   </View>
  // );
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
