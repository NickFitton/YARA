import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import {Screen} from '../../../../components/Screen/Screen';
import {MethodModel} from '../../../../db/models/Method';
import {useRecipe} from '../../../../db/hooks/recipeHooks';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useMeasuredView} from '../hooks';
import {MakeRecipeStackParamList} from '../types';

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

export type FinalMakeRecipeProps = {
  route: RouteProp<MakeRecipeStackParamList, 'Method'>;
  navigation: NavigationProp<MakeRecipeStackParamList, 'Method'>;
};

export function MethodScreen({route, navigation}: FinalMakeRecipeProps) {
  const recipeData = useRecipe(route.params.id);
  const {width, height, ref} = useMeasuredView();

  useEffect(() => {
    const headerRight = () => (
      <Appbar.Action
        icon="arrow-right"
        onPress={() => navigation.navigate('Rate', {id: route.params.id})}
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
          <Text
            variant="displaySmall"
            style={[styles.text, isLandscape && styles.landscapeText]}>
            {method.step}
          </Text>
        </View>
      </View>
    );
  };

  const keyExtractor = ({id}: MethodModel): string => id!;

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
          data={recipeData.data?.method}
          keyExtractor={keyExtractor}
        />
      </Screen>
    </>
  );
}
