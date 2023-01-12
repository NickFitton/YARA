import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {FlatList} from 'react-native';
import {IconButton, List, Text} from 'react-native-paper';
import {ErrorFiller} from '../../../../components/data/Error/Error';
import {LoadingFiller} from '../../../../components/data/Loading/Loading';
import {ScrollScreen} from '../../../../components/Screen/Screen';
import {useBook} from '../../../../db/bookHooks';
import {SuperStackParamList} from '../../../RootStackParam';
import {BookStackParamList} from '../BookStackParam';

type Props = {
  route: RouteProp<BookStackParamList, 'View Book'>;
  navigation: NavigationProp<SuperStackParamList>;
};

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
        <ScrollScreen>
          <LoadingFiller subject="book" />
        </ScrollScreen>
      );
    case 'error':
      return (
        <ScrollScreen>
          <ErrorFiller subject="book" error={data.error} />
        </ScrollScreen>
      );
    case 'success': {
      const {name, description, author, publisher, recipes} = data.data;
      return (
        <ScrollScreen>
          <Text variant="headlineMedium">{name}</Text>
          <Text variant="headlineSmall">{description}</Text>
          {author ? <Text variant="bodyLarge">by {author}</Text> : null}

          {publisher ? (
            <Text variant="bodyLarge">published by {publisher}</Text>
          ) : null}
          <FlatList
            data={recipes}
            renderItem={({item}) => (
              <List.Item
                onPress={() => goToRecipe(item.id)}
                title={item.name}
                description={item.description}
                right={() => <IconButton icon="chevron-right" size={32} />}
              />
            )}
          />
        </ScrollScreen>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(data)}</Text>;
  }
}
