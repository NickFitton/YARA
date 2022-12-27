import React, {useEffect} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import {Screen} from '../../../../components/Screen/Screen';
import {IngredientModel} from '../../../../db/models/Ingredient';
import {useRecipe} from '../../../../db/recipeHooks';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useMeasuredView} from '../hooks';
import {MakeRecipeProps} from '../types';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  landscapeText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  image: {width: 300, height: 300},
});

export function MiseEnPlaceScreen({
  route,
  navigation,
}: MakeRecipeProps<'MiseEnPlace'>) {
  const recipeData = useRecipe(route.params.id);
  const {width, height, ref} = useMeasuredView();

  useEffect(() => {
    const headerRight = () => (
      <Appbar.Action
        icon="arrow-right"
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
      <View
        style={{
          width,
          height,
          maxWidth: width,
          maxHeight: height,
        }}>
        <View
          style={[
            styles.container,
            isLandscape ? styles.landscapeContainer : styles.portraitContainer,
          ]}>
          <Image
            source={{uri: 'http://placekitten.com/300/300'}}
            style={styles.image}
          />
          <Text
            variant="displaySmall"
            style={[styles.text, isLandscape && styles.landscapeText]}>
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
      <View
        style={[StyleSheet.absoluteFillObject]}
        ref={ref}
        collapsable={false}
      />
      <Screen
        style={{
          padding: 0,
          height,
          minHeight: height,
          maxHeight: height,
        }}>
        <FlatList
          pagingEnabled
          renderItem={renderItem}
          data={recipeData.data?.ingredients}
          keyExtractor={keyExtractor}
        />
      </Screen>
    </>
  );
}
