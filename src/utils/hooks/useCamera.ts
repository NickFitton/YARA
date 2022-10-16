import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  Camera,
  CameraDevice,
  CameraPermissionRequestResult,
  useCameraDevices,
} from 'react-native-vision-camera';

export enum Prompt {
  AUTO, // If not enabled when hook called
  FIRST, // If not enabled and not asked before when hook called
  TRIGGER, // Only prompt on "requestPermission"  called
}

export enum Permission {
  LOADING,
  DISABLED,
  ENABLED,
}

export interface CameraHook {
  hasPermission: Permission;
  requestPermission: () => Promise<CameraPermissionRequestResult>;
  device: CameraDevice | undefined;
}

const CAMERA_PERMISSION_PREVIOUSLY_ASKED =
  'CAMERA_PERMICAMERA_PERMISSION_PREVIOUSLY_ASKEDSSION';

export const useCamera = (prompt: Prompt): CameraHook => {
  const [hasPermission, setPermission] = useState<Permission>(
    Permission.LOADING,
  );
  const devices = useCameraDevices();

  const requestPermission = async () => {
    const result = await Camera.requestCameraPermission();
    await AsyncStorage.setItem(CAMERA_PERMISSION_PREVIOUSLY_ASKED, 'true');
    setPermission(
      result === 'authorized' ? Permission.ENABLED : Permission.DISABLED,
    );
    return result;
  };

  useEffect(() => {
    async function checkStatus() {
      const status = await Camera.getCameraPermissionStatus();
      switch (status) {
        case 'authorized':
          setPermission(Permission.ENABLED);
          break;
        case 'denied':
        case 'restricted':
        default:
          setPermission(Permission.DISABLED);
          break;
      }

      switch (prompt) {
        case Prompt.FIRST: {
          const previouslyAsked = !!(await AsyncStorage.getItem(
            CAMERA_PERMISSION_PREVIOUSLY_ASKED,
          ));
          if (previouslyAsked) {
            return;
          }
          await requestPermission();
          break;
        }
        case Prompt.AUTO:
        default:
          await requestPermission();
      }
    }

    checkStatus().catch(Alert.alert);
  }, [setPermission, prompt]);

  return {
    hasPermission,
    requestPermission,
    device:
      devices.back || devices.unspecified || devices.external || devices.front,
  };
};

// 'front' | 'back' | 'unspecified' | 'external'
