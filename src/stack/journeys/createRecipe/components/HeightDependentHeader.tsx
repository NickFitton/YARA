import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';

export function HeightDependentHeader({
  minHeight,
  children,
}: React.PropsWithChildren<{minHeight: number}>) {
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

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
