import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IngredientModel} from '../../../../db/models/Ingredient';
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

export function MiseEnPlaceScreen({
  route,
  navigation,
}: MakeRecipeProps<'MiseEnPlace'>) {
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
    const headerRight = () => (
      <Button
        title="Next"
        onPress={() => navigation.navigate('Method', {id: route.params.id})}
      />
    );
    navigation.setOptions({headerRight});
  }, [navigation, route.params.id]);

  if (recipeData.status === 'loading') {
    return <LoadingSpinner message="Loading recipe ingredients" />;
  }

  const renderItem = ({item: ingredient}: {item: IngredientModel}) => {
    const isLandscape = width > height;
    return (
      <View style={[{width, height, maxWidth: width, maxHeight: height}]}>
        <View
          style={[
            styles.container,
            isLandscape ? styles.landscapeContainer : styles.portraitContainer,
          ]}>
          <Image
            source={{uri: 'http://placekitten.com/300/300'}}
            style={{width: 300, height: 300}}
          />
          <Text style={[styles.text, isLandscape && styles.landscapeText]}>
            {ingredient.type === 'raw'
              ? ingredient.ingredient
              : ingredient.name}
          </Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (ingredient: IngredientModel): string => ingredient.id!;

  return (
    <>
      <View style={StyleSheet.absoluteFill} ref={ref} collapsable={false} />
      <FlatList
        pagingEnabled
        renderItem={renderItem}
        data={recipeData.data?.ingredients}
        keyExtractor={keyExtractor}
      />
    </>
  );
}
