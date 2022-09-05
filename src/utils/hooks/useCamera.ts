import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
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

  useEffect(() => {
    checkStatus();

    async function checkStatus() {
      const status = await Camera.getCameraPermissionStatus();
      switch (status) {
        case 'authorized':
          setPermission(Permission.ENABLED);
          return;
        case 'denied':
        case 'restricted':
          setPermission(Permission.DISABLED);
          return;
      }

      switch (prompt) {
        case Prompt.FIRST:
          const previouslyAsked = !!(await AsyncStorage.getItem(
            CAMERA_PERMISSION_PREVIOUSLY_ASKED,
          ));
          if (previouslyAsked) {
            return;
          }
        case Prompt.AUTO:
          requestPermission();
      }
    }
  }, [setPermission]);

  const requestPermission = async () => {
    const result = await Camera.requestCameraPermission();
    AsyncStorage.setItem(CAMERA_PERMISSION_PREVIOUSLY_ASKED, 'true');
    setPermission(
      result === 'authorized' ? Permission.ENABLED : Permission.DISABLED,
    );
    return result;
  };

  return {
    hasPermission,
    requestPermission,
    device:
      devices.back || devices.unspecified || devices.external || devices.front,
  };
};

//'front' | 'back' | 'unspecified' | 'external'
