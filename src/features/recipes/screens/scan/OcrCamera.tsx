import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  CameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {OCRFrame, scanOCR} from 'vision-camera-ocr';
import {Permission, Prompt, useCamera} from '../../../../utils/hooks/useCamera';
import {RecipeStackParamList} from '../../RecipesStack';

type TextBlock = OCRFrame['result']['blocks'][0];

export const OcrCamera = ({
  onSelect,
}: PropsWithChildren<{
  onSelect: (name: TextBlock[]) => void;
}>) => {
  const {navigate} = useNavigation<NavigationProp<RecipeStackParamList>>();
  const {hasPermission, requestPermission, device} = useCamera(Prompt.AUTO);
  switch (hasPermission) {
    case Permission.LOADING:
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    case Permission.DISABLED:
      return (
        <View>
          <Text>
            It looks like you have not enabled camera permissions, if you want
            to scan recipes you will have to enable this.
          </Text>
          <Button
            title="Enable Camera Permissions"
            onPress={requestPermission}
          />
          <Button title="Skip to Manual Creation" />
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
  }
};
const CameraComponent = ({
  device,
  onSelect,
}: {
  device: CameraDevice;
  onSelect: (name: TextBlock[]) => void;
}) => {
  const [blocks, setBlocks] = React.useState<TextBlock[]>([]);
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const scannedBlocks = scanOCR(frame).result.blocks;
    runOnJS(setBlocks)(scannedBlocks);
  }, []);

  return (
    <>
      <Camera
        device={device}
        isActive={true}
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
        onPress={() => onSelect(blocks)}></TouchableOpacity>
    </>
  );
};
