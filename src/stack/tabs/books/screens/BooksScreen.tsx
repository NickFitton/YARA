import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {List, Searchbar} from 'react-native-paper';
import {ErrorFiller} from '../../../../components/data/Error/Error';
import {LoadingFiller} from '../../../../components/data/Loading/Loading';
import {FAB} from '../../../../components/FAB/FAB';
import {Screen} from '../../../../components/Screen/Screen';
import {useBooks} from '../../../../db/hooks/bookHooks';
import {PartialBook} from '../../../../db/models/Book';
import {useDebounce} from '../../../../utils/hooks/useDebounce';
import {BookStackParamList} from '../BookStackParam';

type Props = {
  navigation: NavigationProp<BookStackParamList, 'BooksRoot'>;
};
type RenderData = {
  item: PartialBook;
};

function Book({item: {id, name, description}}: RenderData) {
  const navigation = useNavigation<NavigationProp<BookStackParamList>>();
  return (
    <List.Item
      onPress={() => navigation.navigate('View Book', {id})}
      title={name}
      description={description}
    />
  );
}

const idKeyExtractor = ({id}: {id: string}) => id;

function ItemSeparatorComponent() {
  return <View style={{height: 16}} />;
}

function BookFlatList() {
  const [search, setSearch] = useState('');
  const debouncedQuery = useDebounce(search, 750);
  const books = useBooks(debouncedQuery);

  switch (books.status) {
    case 'loading':
      return <LoadingFiller subject="books" />;
    case 'error':
      return <ErrorFiller subject="books" error={books.error} />;
    case 'success': {
      const renderItem = (props: RenderData) => <Book {...props} />;
      return (
        <>
          <View style={{padding: 8}}>
            <Searchbar value={search} onChangeText={setSearch} />
          </View>
          <FlatList
            data={books.data}
            keyExtractor={idKeyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        </>
      );
    }
  }
}

export function BooksScreen({navigation}: Props) {
  return (
    <>
      <Screen style={{padding: 0}}>
        <BookFlatList />
      </Screen>
      <FAB icon="plus" onPress={() => navigation.navigate('Create Book')} />
    </>
  );
}
