import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  List,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';

import {useQueryClient} from '@tanstack/react-query';
import {RecipeStackParamList} from '../../RecipeStackParam';
import {RecipeModel} from '../../../../../db/models/Recipe';
import {BottomSheetWrapper} from '../../../../../components/BottomSheet/BottomSheet';
import {SuperStackParamList} from '../../../../RootStackParam';
import {SearchBook} from '../../../../../db/models/Book';
import {useAddToBook, useBookSearch} from '../../../../../db/hooks/bookHooks';
import {useDebounce} from '../../../../../utils/hooks/useDebounce';

function NoRatings({onCreateBook: onAddRating}: {onCreateBook: () => void}) {
  return (
    <View style={{flexDirection: 'column', alignItems: 'center'}}>
      <Text variant="headlineSmall">No books found</Text>
      <Text variant="bodyMedium" style={{textAlign: 'center'}}>
        You haven&apos;t created a book yet, you can by tapping the button
        below.
      </Text>
      <View>
        <Button mode="contained" onPress={onAddRating}>
          Create book
        </Button>
      </View>
    </View>
  );
}

type Props = {
  route: RouteProp<RecipeStackParamList, 'Add to Book'>;
};

function BooksDisplay({
  books,
  onAddRating: onPlusPressed,
  onCreateBook,
  search,
  onSearchChange,
}: {
  books: SearchBook[];
  onAddRating: (book: SearchBook) => void;
  onCreateBook: () => void;
  search: string;
  onSearchChange: (newSearch: string) => void;
}) {
  const renderItem = ({item}: {item: SearchBook}) => {
    const rightIcon = () => (
      <IconButton
        mode="contained"
        icon="plus"
        onPress={() => onPlusPressed(item)}
      />
    );
    return <List.Item title={item.name} right={rightIcon} />;
  };

  return (
    <>
      <Searchbar value={search} onChangeText={onSearchChange} />
      <FlatList
        data={books}
        ListEmptyComponent={<NoRatings onCreateBook={onCreateBook} />}
        renderItem={renderItem}
      />
    </>
  );
}
function BooksError(props: {reason: string} | {error: unknown}) {
  const theme = useTheme();
  useEffect(() => {
    console.log(JSON.stringify(props));
  }, [props]);

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <IconButton icon="alert" iconColor={theme.colors.error} size={50} />
      <Text variant="headlineSmall">Something went wrong</Text>
      <Text variant="bodyMedium" style={{textAlign: 'center'}}>
        We will look into why this happened, in the meantime, please close the
        modal and try again later.
      </Text>
    </View>
  );
}

function BooksLoading() {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium">Loading recipe ratings</Text>
    </View>
  );
}

function AddingToBook() {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium">Adding recipe to book</Text>
    </View>
  );
}

function BookRatings({id}: Pick<RecipeModel, 'id'>) {
  const navigation = useNavigation<NavigationProp<SuperStackParamList>>();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);
  const query = useDebounce(search, 750);
  const data = useBookSearch(query);
  const {addToBook} = useAddToBook(id);

  const onAddToBook = (book: SearchBook) => {
    setUpdating(true);
    addToBook({bookId: book.id})
      .then(() => {
        navigation.dispatch(state =>
          CommonActions.reset({
            ...state,
            index: state.routes.length - 2,
            routes: state.routes.slice(0, -1),
          }),
        );
        return queryClient.invalidateQueries(['recipes', id]);
      })
      .catch(console.error)
      .finally(() => setUpdating(false));
  };

  const onCreateBook = () => {
    navigation.dispatch(state =>
      CommonActions.reset({
        ...state,
        index: state.routes.length - 2,
        routes: state.routes.slice(0, -1),
      }),
    );
    navigation.navigate('Tabs', {
      screen: 'Books',
      params: {screen: 'Create Book'},
    });
  };

  if (updating) {
    return <AddingToBook />;
  }
  switch (data.status) {
    case 'loading':
      return <BooksLoading />;
    case 'success':
      if (!data.data) {
        return <BooksError reason="undefined" />;
      }
      return (
        <BooksDisplay
          search={search}
          onSearchChange={setSearch}
          books={data.data}
          onAddRating={onAddToBook}
          onCreateBook={onCreateBook}
        />
      );

    // eslint-disable-next-line default-case-last
    default:
    case 'error':
      return <BooksError error={data.error} />;
  }
}

export function AddToBookBottomSheet({route}: Props) {
  return (
    <BottomSheetWrapper index={0} snapPoints={['40%', '90%']}>
      <BookRatings id={route.params.id} />
    </BottomSheetWrapper>
  );
}
