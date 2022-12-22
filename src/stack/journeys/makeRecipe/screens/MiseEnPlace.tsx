import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useRecipe} from '../../../../db/recipeHooks';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {MakeRecipeProps} from '../types';

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#111',
    fontSize: 32,
  },
});

export function MiseEnPlaceScreen({route}: MakeRecipeProps<'MiseEnPlace'>) {
  const {width} = Dimensions.get('window');
  const recipeData = useRecipe(route.params.id);

  if (recipeData.status === 'loading') {
    return <LoadingSpinner message="Loading recipe ingredients" />;
  }

  return (
    <ScrollView
      horizontal
      pagingEnabled
      style={{
        flex: 1,
        flexDirection: 'row',
      }}>
      {recipeData.data?.ingredients.map(ingredient => (
        <View style={[styles.textContainer, {width}]}>
          <Image
            source={{uri: 'http://placekitten.com/300/300'}}
            style={{width: 300, height: 300}}
          />
          <Text style={styles.text}>
            {ingredient.type === 'raw'
              ? ingredient.ingredient
              : ingredient.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
