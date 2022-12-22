import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {MethodModel} from '../../../../db/models/Method';
import {useRecipe} from '../../../../db/recipeHooks';
import {SuperStackParamList} from '../../../RootStackParam';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useMeasuredView} from '../hooks';
import {MakeRecipeStackParamList} from '../types';

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

export type FinalMakeRecipeProps = {
  route: RouteProp<MakeRecipeStackParamList, 'Method'>;
  navigation: NavigationProp<SuperStackParamList>;
};

export function MethodScreen({route, navigation}: FinalMakeRecipeProps) {
  const recipeData = useRecipe(route.params.id);
  const {width, height, ref} = useMeasuredView();

  useEffect(() => {
    const headerRight = () => (
      <Button
        title="Next"
        onPress={() =>
          navigation.navigate('Tabs', {
            screen: 'Recipes',
            params: {screen: 'View Recipe', params: {id: route.params.id}},
          })
        }
      />
    );
    navigation.setOptions({headerRight});
  }, [navigation, route.params.id]);

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
