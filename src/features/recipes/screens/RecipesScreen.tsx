import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {PropsWithChildren, useLayoutEffect} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {v4} from 'uuid';
import {Column} from '../../../components/Column/Column';
import {useRecipe, useRecipes} from '../recipeHooks';
import {RecipeStackParamList} from '../RecipeStackParam';
import {IdTextBlock} from '../types';

type Props = NativeStackScreenProps<RecipeStackParamList, 'RecipesRoot'>;

function RecipePreviewWrapper({id, children}: PropsWithChildren<{id: string}>) {
  const navigation =
    useNavigation<NavigationProp<RecipeStackParamList, 'RecipesRoot'>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate({name: 'View Recipe', params: {id}})}
      style={{
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        padding: 8,
        marginBottom: 16,
      }}>
      {children}
    </TouchableOpacity>
  );
}

function RecipePreview({id}: {id: string}) {
  const data = useRecipe(id);

  switch (data.status) {
    case 'error':
      return (
        <RecipePreviewWrapper id={id}>
          <Text>!!!</Text>
        </RecipePreviewWrapper>
      );
    case 'success':
      return (
        <RecipePreviewWrapper id={id}>
          <>
            <Text style={{color: '#000'}}>{data.data.name}</Text>
            <Text style={{color: '#000'}}>{data.data.description}</Text>
          </>
        </RecipePreviewWrapper>
      );
    case 'loading':
    default:
      return (
        <RecipePreviewWrapper id={id}>
          <ActivityIndicator size="large" />
        </RecipePreviewWrapper>
      );
  }
}

function ListEmpty() {
  const navigation =
    useNavigation<NavigationProp<RecipeStackParamList, 'RecipesRoot'>>();
  return (
    <Column
      style={{
        height: '100%',
        padding: 24,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      space={8}>
      <Text style={{color: '#000', textAlign: 'center'}}>
        You don&apos;t have any recipes yet
      </Text>
      <Button
        title="Create a Recipe"
        onPress={() => navigation.navigate('Scan Name')}
      />
    </Column>
  );
}

export function RecipesScreen({navigation}: Props) {
  const data = useRecipes();

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button onPress={() => navigation.navigate('Scan Name')} title="New" />
      ),
    });
  }, [navigation]);

  switch (data.status) {
    case 'error':
      return (
        <View style={{height: '100%'}}>
          <View>
            <Text>Something went wrong</Text>
          </View>
        </View>
      );
    case 'success':
      return (
        <View style={{height: '100%'}}>
          <View style={{flex: 1}}>
            <Button
              title="To build Method"
              onPress={() =>
                navigation.navigate('Build Ingredients', {
                  recipe: {
                    name: 'Nivia Hand Cream',
                    description: 'Concentrated care provitamin b5',
                  },
                  data: {
                    frame: {width: 1, height: 1},
                    text: [
                      {text: 'NIVEA', id: v4()} as IdTextBlock,
                      {text: 'HAND CREAM', id: v4()} as IdTextBlock,
                      {text: 'repair', id: v4()} as IdTextBlock,
                      {text: 'Concentrated Care', id: v4()} as IdTextBlock,
                      {text: 'Provitamin B5', id: v4()} as IdTextBlock,
                      {text: '100ml', id: v4()} as IdTextBlock,
                    ],
                  },
                })
              }
            />
            <FlatList
              style={{padding: 16}}
              ListEmptyComponent={<ListEmpty />}
              data={data.data}
              renderItem={({item: {id}}) => <RecipePreview id={id} />}
            />
          </View>
        </View>
      );
    case 'loading':
    default:
      return (
        <View style={{height: '100%'}}>
          <View>
            <Text>Loading your recipes</Text>
          </View>
        </View>
      );
  }
}
