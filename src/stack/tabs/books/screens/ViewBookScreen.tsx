import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {Text} from 'react-native-paper';
import {ErrorFiller} from '../../../../components/data/Error/Error';
import {LoadingFiller} from '../../../../components/data/Loading/Loading';
import {ScrollScreen} from '../../../../components/Screen/Screen';
import {useBook} from '../../../../db/bookHooks';
import {BookStackParamList} from '../BookStackParam';

type Props = {
  route: RouteProp<BookStackParamList, 'View Book'>;
};

export function ViewBookScreen({route}: Props) {
  const data = useBook(route.params.id);

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
      const {name, description, author, publisher} = data.data;
      return (
        <ScrollScreen>
          <Text variant="headlineMedium">{name}</Text>
          {author ? <Text variant="headlineSmall">by {author}</Text> : null}
          {publisher ? (
            <Text variant="headlineSmall">published by {publisher}</Text>
          ) : null}

          <Text variant="bodyLarge">{description}</Text>
        </ScrollScreen>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(data)}</Text>;
  }
}
