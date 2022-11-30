import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren, useLayoutEffect} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Column} from '../../../components/Column/Column';
import {useRecipe, useRecipes} from '../recipeHooks';
import {RecipeStackParamList} from '../RecipeStackParam';

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

export function RecipesScreen({
  navigation,
}: {
  navigation: NavigationProp<RecipeStackParamList, 'RecipesRoot'>;
}) {
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
