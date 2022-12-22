import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MethodModel} from '../../../../db/models/Method';
import {useRecipe} from '../../../../db/recipeHooks';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {MakeRecipeProps} from '../types';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#111',
    fontSize: 32,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  landscapeText: {
    flexGrow: 1,
  },
});

export function MethodScreen({route, navigation}: MakeRecipeProps<'Method'>) {
  const recipeData = useRecipe(route.params.id);
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

  useEffect(() => {
    const headerRight = () => <Button title="Next" />;
    navigation.setOptions({headerRight});
  }, [navigation]);

  if (recipeData.status === 'loading') {
    return <LoadingSpinner message="Loading recipe ingredients" />;
  }

  const renderItem = ({item: method}: {item: MethodModel}) => {
    const isLandscape = width > height;
    return (
      <View style={[{width, height, maxWidth: width, maxHeight: height}]}>
        <View
          style={[
            styles.container,
            isLandscape ? styles.landscapeContainer : styles.portraitContainer,
          ]}>
          <Text style={[styles.text, isLandscape && styles.landscapeText]}>
            {method.step}
          </Text>
        </View>
      </View>
    );
  };

  const keyExtractor = ({id}: MethodModel): string => id!;

  return (
    <>
      <View style={StyleSheet.absoluteFill} ref={ref} collapsable={false} />
      <FlatList
        pagingEnabled
        renderItem={renderItem}
        data={recipeData.data?.method}
        keyExtractor={keyExtractor}
      />
    </>
  );
}
