import {useEffect, useRef, useState} from 'react';
import {Dimensions, View} from 'react-native';

export const useMeasuredView = () => {
  const [{width, height}, setDimensions] = useState<{
    width: number;
    height: number;
  }>({width: -1, height: -1});
  const ref = useRef<View>(null);

  useEffect(() => {
    const refreshSlideSize = () =>
      setTimeout(
        () =>
          ref.current?.measureInWindow((_x, _y, refWidth, refHeight) =>
            setDimensions({width: refWidth, height: refHeight}),
          ),
        100,
      );
    refreshSlideSize();
    const subscription = Dimensions.addEventListener(
      'change',
      refreshSlideSize,
    );
    return () => subscription?.remove();
  }, []);

  return {ref, width, height};
};
