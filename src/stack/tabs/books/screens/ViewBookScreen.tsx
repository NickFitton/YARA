import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {FlatList} from 'react-native';
import {List, Text} from 'react-native-paper';
import {ErrorFiller} from '../../../../components/data/Error/Error';
import {LoadingFiller} from '../../../../components/data/Loading/Loading';
import {Screen} from '../../../../components/Screen/Screen';
import {useBook} from '../../../../db/bookHooks';
import {SuperStackParamList} from '../../../RootStackParam';
import {BookStackParamList} from '../BookStackParam';

type Props = {
  route: RouteProp<BookStackParamList, 'View Book'>;
  navigation: NavigationProp<SuperStackParamList>;
};

const listItemRightArrow = () => <List.Icon icon="chevron-right" />;

export function ViewBookScreen({route, navigation}: Props) {
  const data = useBook(route.params.id);

  const goToRecipe = (recipeId: string) => {
    navigation.navigate('Tabs', {
      screen: 'Recipes',
      params: {screen: 'View Recipe', params: {id: recipeId}},
    });
  };

  switch (data.status) {
    case 'loading':
      return (
        <Screen>
          <LoadingFiller subject="book" />
        </Screen>
      );
    case 'error':
      return (
        <Screen>
          <ErrorFiller subject="book" error={data.error} />
        </Screen>
      );
    case 'success': {
      const {name, description, author, publisher, recipes} = data.data;
      return (
        <Screen>
          <Text variant="headlineMedium">{name}</Text>
          <Text variant="headlineSmall">{description}</Text>
          {author ? <Text variant="bodyLarge">by {author}</Text> : null}

          {publisher ? (
            <Text variant="bodyLarge">published by {publisher}</Text>
          ) : null}
          <FlatList
            style={{marginHorizontal: -16}}
            data={recipes}
            renderItem={({item}) => (
              <List.Item
                onPress={() => goToRecipe(item.id)}
                title={item.name}
                description={item.description}
                right={listItemRightArrow}
              />
            )}
          />
        </Screen>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(data)}</Text>;
  }
}
