import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Dimensions} from 'react-native';

export const useHeightDependentHeader = (minHeight: number) => {
  const navigation = useNavigation();
  const enoughSpaceForHeader = (height: number): boolean => height > minHeight;
  useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({window}) => {
      navigation.setOptions({headerShown: enoughSpaceForHeader(window.height)});
    });

    return () => {
      listener.remove();
    };
  });
};
