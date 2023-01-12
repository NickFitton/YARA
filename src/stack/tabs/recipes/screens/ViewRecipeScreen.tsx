import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Appbar, Chip, FAB, Text} from 'react-native-paper';

import {Row} from '../../../../components/Row/Row';
import {ScrollScreen} from '../../../../components/Screen/Screen';
import {useDeleteRecipe, useRecipe} from '../../../../db/hooks/recipeHooks';
import {IngredientModel} from '../../../../db/models/Ingredient';
import {MethodModel} from '../../../../db/models/Method';
import {toString} from '../../../../utils/measurement';
import {SuperStackParamList} from '../../../RootStackParam';
import {RecipeStackParamList} from '../RecipeStackParam';

type Props = {
  route: RouteProp<RecipeStackParamList, 'View Recipe'>;
  navigation: NavigationProp<SuperStackParamList>;
};

const minutesToHumanReadable = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours} hour${hours > 1 ? 's' : ''}, ${remainder} minute${
    minutes > 1 ? 's' : ''
  }`;
};

function IngredientCheckboxes({ingredients}: {ingredients: IngredientModel[]}) {
  return (
    <View>
      <Text variant="headlineSmall">Ingredients</Text>
      {ingredients.map(ingredient => {
        switch (ingredient.type) {
          case 'parsed':
            return (
              <Text variant="bodyMedium" key={ingredient.id}>
                {toString(ingredient)}
              </Text>
            );
          case 'raw':
          default:
            return (
              <Text variant="bodyMedium" key={ingredient.id}>
                {ingredient.ingredient}
              </Text>
            );
        }
      })}
    </View>
  );
}

function MethodCheckboxes({method}: {method: MethodModel[]}) {
  return (
    <View>
      <Text variant="headlineSmall">Method</Text>
      {method.map(({step}, i) => (
        <View style={{flexDirection: 'row', paddingBottom: 4}} key={step}>
          <Text variant="bodyMedium">{i + 1}.</Text>
          <Text variant="bodyMedium">{step}</Text>
        </View>
      ))}
    </View>
  );
}

function Fab({id}: {id: string}) {
  const navigation = useNavigation<NavigationProp<SuperStackParamList>>();
  const [fabOpen, setFabOpen] = useState(false);
  const {deleteRecipe} = useDeleteRecipe(id);
  return (
    <FAB.Group
      open={fabOpen}
      visible
      icon={fabOpen ? 'dots-vertical' : 'dots-horizontal'}
      actions={[
        {
          icon: 'camera',
          label: 'Add Photo',
          onPress: () => console.log('Pressed add'),
        },
        {
          icon: 'delete',
          label: 'Delete',
          onPress: () => {
            deleteRecipe();
            navigation.goBack();
          },
        },
        {
          icon: 'pencil',
          label: 'Edit',
          onPress: () => console.log('Pressed email'),
        },
      ]}
      onStateChange={({open}) => setFabOpen(open)}
      onPress={() => {
        if (fabOpen) {
          // do something if the speed dial is open
        }
      }}
    />
  );
}

export function ViewRecipeScreen({route, navigation}: Props) {
  const recipe = useRecipe(route.params.id);

  useEffect(() => {
    const goToMake = () =>
      navigation.navigate('Journeys', {
        screen: 'Make Recipe Journey',
        params: {
          screen: 'MiseEnPlace',
          params: {id: route.params.id},
        },
      });

    const goToRatings = () =>
      navigation.navigate('Tabs', {
        screen: 'Recipes',
        params: {screen: 'Recipe Ratings', params: {id: route.params.id}},
      });

    const goToBook = (bookId: string) =>
      navigation.navigate('Tabs', {
        screen: 'Books',
        params: {screen: 'View Book', params: {id: bookId}},
      });

    const connectToBook = () =>
      navigation.navigate('Tabs', {
        screen: 'Recipes',
        params: {screen: 'Add to Book', params: {id: route.params.id}},
      });

    const hasBook = !!recipe.data?.book;
    const header = () => (
      <Appbar.Header>
        {navigation.canGoBack() ? (
          <Appbar.BackAction onPress={navigation.goBack} />
        ) : null}
        <Appbar.Content />
        <Appbar.Action icon="star" onPress={goToRatings} />
        <Appbar.Action
          icon={`book${hasBook ? '' : '-plus'}`}
          onPress={
            hasBook ? () => goToBook(recipe.data!.book!.id) : connectToBook
          }
        />
        <Appbar.Action icon="chef-hat" onPress={goToMake} />
      </Appbar.Header>
    );
    navigation.setOptions({header});
  }, [navigation, recipe, route.params.id]);

  switch (recipe.status) {
    case 'loading':
      return (
        <ScrollScreen>
          <View
            style={{
              height: '100%',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <ActivityIndicator size="large" />
              <Text style={{color: '#111'}}>Loading your recipe</Text>
            </View>
          </View>
        </ScrollScreen>
      );
    case 'error':
      return (
        <ScrollScreen>
          <View
            style={{
              height: '100%',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Text style={{color: '#111'}}>Something went wrong</Text>
              <Text style={{color: '#111'}}>
                We couldn&apos;t retrieve your recipe, you can go back and try
                again.
              </Text>
              <Text style={{color: '#111'}}>
                {JSON.stringify(recipe.error)}
              </Text>
            </View>
          </View>
        </ScrollScreen>
      );
    case 'success': {
      const {
        name,
        description,
        servings,
        prepTimeMinutes,
        cookTimeMinutes,
        ingredients,
        method,
        book,
      } = recipe.data;
      return (
        <>
          <ScrollScreen>
            {book?.name ? (
              <Text variant="bodySmall">From {book.name}</Text>
            ) : null}
            <Text variant="headlineMedium">{name}</Text>
            <Text variant="bodyLarge">{description}</Text>
            <View style={{paddingVertical: 8}} />
            <Row space={8}>
              <Chip>Serves: {servings}</Chip>
              <Chip icon="knife">
                {minutesToHumanReadable(prepTimeMinutes)}
              </Chip>
              <Chip icon="chef-hat">
                {minutesToHumanReadable(cookTimeMinutes)}
              </Chip>
            </Row>
            <View style={{paddingVertical: 8}} />
            {ingredients ? (
              <IngredientCheckboxes ingredients={ingredients} />
            ) : null}
            <View style={{paddingVertical: 8}} />
            {method ? <MethodCheckboxes method={method} /> : null}
            <View style={{paddingVertical: 64}} />
          </ScrollScreen>
          <Fab id={route.params.id} />
        </>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(recipe)}</Text>;
  }
}
