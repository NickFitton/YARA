import {useNavigation, NavigationProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useLayoutEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {Card, FAB, Text, useTheme} from 'react-native-paper';

import {Row} from '../../../../components/Row/Row';
import {Screen} from '../../../../components/Screen/Screen';
import {IngredientModel} from '../../../../db/models/Ingredient';
import {MethodModel} from '../../../../db/models/Method';
import {useDeleteRecipe, useRecipe} from '../../../../db/recipeHooks';
import {toString} from '../../../../utils/measurement';
import {SuperStackParamList} from '../../../RootStackParam';
import {RecipeStackParamList} from '../RecipeStackParam';

type Props = NativeStackScreenProps<RecipeStackParamList, 'View Recipe'>;

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
      <Text variant="titleMedium">Ingredients</Text>
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
      <Text variant="titleMedium">Method</Text>
      {method.map(({step}) => (
        <Text variant="bodyMedium" key={step}>
          {step}
        </Text>
      ))}
    </View>
  );
}

function Fab({id}: {id: string}) {
  const navigation = useNavigation<NavigationProp<SuperStackParamList>>();
  const goToMake = () =>
    navigation.navigate('Journeys', {
      screen: 'Make Recipe Journey',
      params: {
        screen: 'MiseEnPlace',
        params: {id},
      },
    });

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
          icon: 'star',
          label: 'Favourite',
          onPress: () => console.log('Pressed star'),
        },
        {
          icon: 'pencil',
          label: 'Edit',
          onPress: () => console.log('Pressed email'),
        },
        {
          icon: 'chef-hat',
          label: 'Cook',
          onPress: goToMake,
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

  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  });

  switch (recipe.status) {
    case 'loading':
      return (
        <Screen>
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
        </Screen>
      );
    case 'error':
      return (
        <Screen>
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
        </Screen>
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
      } = recipe.data;
      return (
        <>
          <Screen>
            <Text variant="titleLarge">{name}</Text>
            <Text variant="bodyLarge">{description}</Text>
            <ScrollView horizontal style={{marginHorizontal: -16}}>
              <View style={{padding: 16}}>
                <Row space={8}>
                  <Card style={{padding: 8}}>
                    <Text variant="bodyMedium">Serves: {servings}</Text>
                  </Card>
                  <Card style={{padding: 8}}>
                    <Text variant="bodyMedium">
                      Prep Time: {minutesToHumanReadable(prepTimeMinutes)}
                    </Text>
                  </Card>
                  <Card style={{padding: 8}}>
                    <Text variant="bodyMedium">
                      Cook Time: {minutesToHumanReadable(cookTimeMinutes)}
                    </Text>
                  </Card>
                </Row>
              </View>
            </ScrollView>
            {ingredients ? (
              <IngredientCheckboxes ingredients={ingredients} />
            ) : null}
            {method ? <MethodCheckboxes method={method} /> : null}
          </Screen>
          <Fab id={route.params.id} />
        </>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(recipe)}</Text>;
  }
}
