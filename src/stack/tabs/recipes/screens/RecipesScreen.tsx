import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {List, Searchbar} from 'react-native-paper';
import {ErrorFiller} from '../../../../components/data/Error/Error';
import {LoadingFiller} from '../../../../components/data/Loading/Loading';
import {FAB} from '../../../../components/FAB/FAB';

import {Screen} from '../../../../components/Screen/Screen';
import {useRecipes} from '../../../../db/hooks/recipeHooks';
import {RecipePreview} from '../../../../db/models/Recipe';
import {useDebounce} from '../../../../utils/hooks/useDebounce';
import {useCreateRecipeJourney} from '../../../journeys/createRecipe/utils';
import {RecipeStackParamList} from '../RecipeStackParam';

const listItemRightArrow = () => <List.Icon icon="chevron-right" />;

function RecipeListItem({
  recipe: {id, name, description},
}: {
  recipe: RecipePreview;
}) {
  const navigation =
    useNavigation<NavigationProp<RecipeStackParamList, 'RecipesRoot'>>();
  return (
    <List.Item
      title={name}
      description={description}
      onPress={() => navigation.navigate({name: 'View Recipe', params: {id}})}
      right={listItemRightArrow}
    />
  );
}

function RecipeFlatList() {
  const [search, setSearch] = useState('');
  const debouncedQuery = useDebounce(search, 750);
  const data = useRecipes(debouncedQuery);

  switch (data.status) {
    case 'loading':
      return <LoadingFiller subject="books" />;
    case 'error':
      return <ErrorFiller subject="books" error={data.error} />;
    case 'success':
      return (
        <>
          <View style={{padding: 8}}>
            <Searchbar value={search} onChangeText={setSearch} />
          </View>
          <FlatList
            refreshing={data.isRefetching}
            onRefresh={() => {
              data.refetch().catch(console.error);
            }}
            data={data.data}
            renderItem={({item}) => <RecipeListItem recipe={item} />}
          />
        </>
      );
  }
}

export function RecipesScreen() {
  const startCreateRecipeJourney = useCreateRecipeJourney();
  return (
    <>
      <Screen style={{padding: 0, flex: 1, flexDirection: 'column'}}>
        <RecipeFlatList />
      </Screen>
      <FAB icon="plus" onPress={startCreateRecipeJourney} />
    </>
  );
}
