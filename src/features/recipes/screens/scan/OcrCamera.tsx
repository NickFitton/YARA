import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import {Alert, Button, Text, TouchableOpacity, View} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  CameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {v4} from 'uuid';
import {scanOCR} from 'vision-camera-ocr';
import {Permission, Prompt, useCamera} from '../../../../utils/hooks/useCamera';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {ScanData, TextBlock} from '../../types';

const loadFrameData = (
  width: number,
  height: number,
  scannedBlocks: TextBlock[],
  setFrame: React.Dispatch<React.SetStateAction<ScanData | undefined>>,
) => {
  setFrame({
    frame: {width, height},
    text: scannedBlocks.map(block => ({...block, id: v4()})),
  });
};

function CameraComponent({
  device,
  onSelect,
}: {
  device: CameraDevice;
  onSelect: (data?: ScanData) => void;
}) {
  const [storedFrame, setFrame] = React.useState<ScanData>();
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const {width, height} = frame;
    const scannedBlocks = scanOCR(frame).result.blocks;
    runOnJS(loadFrameData)(width, height, scannedBlocks, setFrame);
  }, []);

  const selectFrame = () => {
    onSelect(storedFrame);
  };

  return (
    <>
      <Camera
        device={device}
        isActive
        style={{
          flex: 1,
          flexShrink: 1,
          height: '100%',
        }}
        frameProcessor={frameProcessor}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: 32,
          height: 64,
          aspectRatio: 1,
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 32,
          backgroundColor: '#0000',
        }}
        onPress={selectFrame}
      />
    </>
  );
}

export function OcrCamera({
  onSelect,
}: PropsWithChildren<{
  onSelect: (data?: ScanData) => void;
}>) {
  const {navigate} = useNavigation<NavigationProp<RecipeStackParamList>>();
  const {hasPermission, requestPermission, device} = useCamera(Prompt.AUTO);

  const onEnable = () => {
    requestPermission().then(Alert.alert).catch(Alert.alert);
  };

  const goToManual = () => {
    navigate('Create Recipe');
  };

  switch (hasPermission) {
    case Permission.DISABLED:
      return (
        <View>
          <Text>
            It looks like you have not enabled camera permissions, if you want
            to scan recipes you will have to enable this.
          </Text>
          <Button title="Enable Camera Permissions" onPress={onEnable} />
          <Button title="Skip to Manual Creation" onPress={goToManual} />
        </View>
      );
    case Permission.ENABLED:
      if (device) {
        return <CameraComponent device={device} onSelect={onSelect} />;
      }
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>No cameras found</Text>
          <Button
            title="Enter manually instead"
            onPress={() => navigate('Create Recipe')}
          />
        </View>
      );
    case Permission.LOADING:
    default:
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
  }
}
