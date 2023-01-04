import React, {PropsWithChildren, useCallback, useRef, useEffect} from 'react';
import {View, StyleSheet, Pressable, Animated} from 'react-native';
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useTheme} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export function BottomSheetWrapper({
  children,
  ...sheetProps
}: PropsWithChildren<Pick<BottomSheetProps, 'snapPoints' | 'index'>>) {
  const modalRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const close = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    modalRef.current?.close();
  };

  useEffect(() => () => close());

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: '#111', opacity: fadeAnim},
        ]}>
        <Pressable onPress={close} style={[StyleSheet.absoluteFill]} />
      </Animated.View>
      <BottomSheet
        backgroundStyle={{backgroundColor: theme.colors.elevation.level1}}
        handleIndicatorStyle={{backgroundColor: theme.colors.onBackground}}
        ref={modalRef}
        enablePanDownToClose
        onChange={handleSheetChanges}
        {...sheetProps}>
        <BottomSheetView style={{padding: 16}}>{children}</BottomSheetView>
      </BottomSheet>
    </View>
  );
}
