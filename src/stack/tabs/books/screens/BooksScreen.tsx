import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {ErrorFiller} from '../../../../components/data/Error/Error';
import {LoadingFiller} from '../../../../components/data/Loading/Loading';
import {FAB} from '../../../../components/FAB/FAB';
import {Screen} from '../../../../components/Screen/Screen';
import {useBooks} from '../../../../db/bookHooks';
import {PartialBook} from '../../../../db/models/Book';
import {BookStackParamList} from '../BookStackParam';

type Props = {
  navigation: NavigationProp<BookStackParamList, 'BooksRoot'>;
};
type RenderData = {
  item: PartialBook;
  index: number;
};

function Book({item: {id, name, description}, index}: RenderData) {
  const navigation = useNavigation<NavigationProp<BookStackParamList>>();
  const paddingLeft = index % 2 ? 8 : 16;
  const paddingRight = index % 2 ? 16 : 8;
  return (
    <View style={{flex: 1, paddingLeft, paddingRight}}>
      <Card onPress={() => navigation.navigate('View Book', {id})}>
        <Card.Title title={name} />
        <Card.Content>
          <Text variant="bodyMedium">{description}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const idKeyExtractor = ({id}: {id: string}) => id;

function ItemSeparatorComponent() {
  return <View style={{height: 16}} />;
}

function BookFlatList() {
  const books = useBooks();

  switch (books.status) {
    case 'loading':
      return <LoadingFiller subject="books" />;
    case 'error':
      return <ErrorFiller subject="books" error={books.error} />;
    case 'success': {
      const renderItem = (props: RenderData) => <Book {...props} />;
      return (
        <FlatList
          style={{margin: -16}}
          data={books.data}
          numColumns={2}
          keyExtractor={idKeyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      );
    }
  }
}

export function BooksScreen({navigation}: Props) {
  return (
    <>
      <Screen>
        <BookFlatList />
      </Screen>
      <FAB icon="plus" onPress={() => navigation.navigate('Create Book')} />
    </>
  );
}
