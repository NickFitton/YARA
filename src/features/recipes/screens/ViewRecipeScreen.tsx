import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {PropsWithChildren, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Row} from '../../../components/Row/Row';
import {MethodModel} from '../../../db/models/Method';
import {useDeleteRecipe, useRecipe} from '../recipeHooks';
import {RecipeStackParamList} from '../RecipesStack';
import {IngredientModel} from '../types/Recipe';

type Props = NativeStackScreenProps<RecipeStackParamList, 'View Recipe'>;

export const ViewRecipeScreen = ({route, navigation}: Props) => {
  const recipe = useRecipe(route.params.id);
  const {deleteRecipe} = useDeleteRecipe(route.params.id);

  switch (recipe.status) {
    case 'loading':
      return (
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
            <Text>Loading your recipe</Text>
          </View>
        </View>
      );
    case 'error':
      return (
        <View
          style={{
            height: '100%',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <Text>Something went wrong</Text>
            <Text>
              We couldn't retrieve your recipe, you can go back and try again.
            </Text>
            <Text>{JSON.stringify(recipe.error)}</Text>
          </View>
        </View>
      );
    case 'success':
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
        <ScrollView style={{padding: 16}}>
          <Text style={{fontSize: 24}}>{name}</Text>
          <Text style={{paddingTop: 8}}>{description}</Text>
          <ScrollView horizontal style={{marginHorizontal: -16}}>
            <View style={{padding: 16}}>
              <Row space={8}>
                <Cell>
                  <Text>Serves: {servings}</Text>
                </Cell>
                <Cell>
                  <Text>
                    Prep Time: {minutesToHumanReadable(prepTimeMinutes)}
                  </Text>
                </Cell>
                <Cell>
                  <Text>
                    Cook Time: {minutesToHumanReadable(cookTimeMinutes)}
                  </Text>
                </Cell>
              </Row>
            </View>
          </ScrollView>
          {ingredients ? (
            <IngredientCheckboxes ingredients={ingredients} />
          ) : null}
          {method ? <MethodCheckboxes method={method} /> : null}
          <Button
            title="Delete"
            color="#ff3823"
            onPress={() => {
              navigation.popToTop();
              deleteRecipe();
            }}
          />
        </ScrollView>
      );
  }
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

const Cell = ({children}: PropsWithChildren<{}>) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}>
      {children}
    </View>
  );
};

const IngredientCheckboxes = ({
  ingredients,
}: {
  ingredients: IngredientModel[];
}) => (
  <View>
    <Text style={{fontSize: 18}}>Ingredients</Text>
    {ingredients.map(ingredient => (
      <Text>{displayIngredient(ingredient)}</Text>
    ))}
  </View>
);

const MethodCheckboxes = ({method}: {method: MethodModel[]}) => (
  <View>
    <Text style={{fontSize: 18}}>Method</Text>
    {method.map(({step}) => (
      <Text>{step}</Text>
    ))}
  </View>
);

const displayIngredient = (ingredient: IngredientModel): string => {
  switch (ingredient.type) {
    case 'raw':
      return ingredient.ingredient;
    case 'parsed':
      const {quantity, unit, name} = ingredient;
      if (unit) {
        return `${quantity}${unit} of ${name}`;
      } else {
        return `${quantity} ${name}`;
      }
  }
};
