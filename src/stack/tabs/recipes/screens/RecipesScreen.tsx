import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, {PropsWithChildren, useLayoutEffect} from 'react';
import {Button, View, Text, TouchableOpacity, FlatList} from 'react-native';
import {
  Card,
  Paragraph,
  ActivityIndicator,
  useTheme,
  Appbar,
} from 'react-native-paper';

import {Column} from '../../../../components/Column/Column';
import {useRecipe, useRecipes} from '../../../../db/recipeHooks';
import {useCreateRecipeJourney} from '../../../journeys/createRecipe/utils';
import {RecipeStackParamList} from '../RecipeStackParam';

type Props = NativeStackScreenProps<RecipeStackParamList, 'RecipesRoot'>;

function RecipePreviewWrapper({id, children}: PropsWithChildren<{id: string}>) {
  const navigation =
    useNavigation<NavigationProp<RecipeStackParamList, 'RecipesRoot'>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate({name: 'View Recipe', params: {id}})}>
      <Card>{children}</Card>
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
          <Card.Title title={data.data.name} />
          {data.data.description ? (
            <Card.Content>
              <Paragraph>{data.data.description}</Paragraph>
            </Card.Content>
          ) : null}
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

function Seperator() {
  return <View style={{height: 8}} />;
}

function ListEmpty() {
  const startCreateRecipeJourney = useCreateRecipeJourney();
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
      <Button title="Create a Recipe" onPress={startCreateRecipeJourney} />
    </Column>
  );
}

function Screen({children}: PropsWithChildren<unknown>) {
  const theme = useTheme();
  return (
    <View style={{backgroundColor: theme.colors.background, height: '100%'}}>
      {children}
    </View>
  );
}

export function RecipesScreen({navigation}: Props) {
  const startCreateRecipeJourney = useCreateRecipeJourney();
  const data = useRecipes();

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      // header: () => <Header />,
    });
  }, [navigation, startCreateRecipeJourney]);

  switch (data.status) {
    case 'error':
      return (
        <Screen>
          <View>
            <Text>Something went wrong</Text>
          </View>
        </Screen>
      );
    case 'success':
      return (
        <Screen>
          <View style={{flex: 1}}>
            <FlatList
              style={{padding: 16}}
              ItemSeparatorComponent={Seperator}
              ListEmptyComponent={<ListEmpty />}
              data={data.data}
              renderItem={({item: {id}}) => <RecipePreview id={id} />}
            />
          </View>
        </Screen>
      );
    case 'loading':
    default:
      return (
        <Screen>
          <View>
            <Text>Loading your recipes</Text>
          </View>
        </Screen>
      );
  }
}
