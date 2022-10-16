import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {PropsWithChildren, useState} from 'react';
import {ActivityIndicator, Button, ScrollView, Text, View} from 'react-native';
import {Row} from '../../../components/Row/Row';
import {IngredientModel} from '../../../db/models/Ingredient';
import {MethodModel} from '../../../db/models/Method';
import {toString} from '../../../utils/measurement';
import {useDeleteRecipe, useRecipe} from '../recipeHooks';
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

function Cell({children}: PropsWithChildren<object>) {
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
}

function IngredientCheckboxes({ingredients}: {ingredients: IngredientModel[]}) {
  return (
    <View>
      <Text style={{fontSize: 18}}>Ingredients</Text>
      {ingredients.map(ingredient => {
        switch (ingredient.type) {
          case 'parsed':
            return <Text key={ingredient.id}>{toString(ingredient)}</Text>;
          case 'raw':
          default:
            return <Text key={ingredient.id}>{ingredient.ingredient}</Text>;
        }
      })}
    </View>
  );
}

function MethodCheckboxes({method}: {method: MethodModel[]}) {
  return (
    <View>
      <Text style={{fontSize: 18}}>Method</Text>
      {method.map(({step}) => (
        <Text>{step}</Text>
      ))}
    </View>
  );
}

export function ViewRecipeScreen({route, navigation}: Props) {
  const recipe = useRecipe(route.params.id);
  const {deleteRecipe} = useDeleteRecipe(route.params.id);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * This focus effect is used so that the page is unmounted before the recipe it's displaying is deleted.
   * If it's not done this way then the page re-renders the non-existent recipe.
   */
  useFocusEffect(
    React.useCallback(
      () => () => {
        if (isDeleting) {
          deleteRecipe();
        }
      },
      [isDeleting, deleteRecipe],
    ),
  );

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
              We couldn&apos;t retrieve your recipe, you can go back and try
              again.
            </Text>
            <Text>{JSON.stringify(recipe.error)}</Text>
          </View>
        </View>
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
              setIsDeleting(true);
              navigation.goBack();
            }}
          />
        </ScrollView>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(recipe)}</Text>;
  }
}
