import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, Pressable, Button, Animated} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';

import {RecipeStackParamList} from '../RecipeStackParam';
import {useDeleteRecipe} from '../../../../db/recipeHooks';

type Props = NativeStackScreenProps<
  RecipeStackParamList,
  'View Recipe Options'
>;

function MyBottomSheet({navigation, route}: Props) {
  const {deleteRecipe} = useDeleteRecipe(route.params.id);
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

  const bottomSheetRef = useRef<BottomSheet>(null);

  const close = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-type-assertion
    bottomSheetRef.current!.close();
  };

  const onDelete = () => {
    close();
    deleteRecipe();
    navigation.popToTop();
  };

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
        ref={bottomSheetRef}
        index={0}
        snapPoints={['25%']}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <BottomSheetView>
          <Button title="Add Photo" disabled />
          <Button title="Edit" />
          <Button title="Delete" color="#ff3823" onPress={onDelete} />
          <Button title="Cancel" onPress={close} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

export default MyBottomSheet;
