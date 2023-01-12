import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {Card, Paragraph, ActivityIndicator, Text} from 'react-native-paper';
import {FAB} from '../../../../components/FAB/FAB';

import {Screen} from '../../../../components/Screen/Screen';
import {useRecipe, useRecipes} from '../../../../db/hooks/recipeHooks';
import {useCreateRecipeJourney} from '../../../journeys/createRecipe/utils';
import {RecipeStackParamList} from '../RecipeStackParam';

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
  return <Text variant="bodyLarge">You don&apos;t have any recipes yet</Text>;
}

export function RecipesScreen() {
  const startCreateRecipeJourney = useCreateRecipeJourney();
  const data = useRecipes();

  switch (data.status) {
    case 'error':
      return (
        <Screen
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text variant="bodyLarge">Something went wrong</Text>
        </Screen>
      );
    case 'success':
      return (
        <>
          <Screen>
            <FlatList
              refreshing={data.isRefetching}
              onRefresh={() => {
                data.refetch().catch(console.error);
              }}
              ItemSeparatorComponent={Seperator}
              ListEmptyComponent={ListEmpty}
              data={data.data}
              renderItem={({item: {id}}) => <RecipePreview id={id} />}
            />
          </Screen>
          <FAB icon="plus" onPress={startCreateRecipeJourney} />
        </>
      );
    case 'loading':
    default:
      return (
        <Screen
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge">Loading your recipes</Text>
        </Screen>
      );
  }
}
