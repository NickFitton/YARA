import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {PropsWithChildren, useLayoutEffect} from 'react';
import {ActivityIndicator, Button, ScrollView, Text, View} from 'react-native';
import {Row} from '../../../../components/Row/Row';
import {IngredientModel} from '../../../../db/models/Ingredient';
import {MethodModel} from '../../../../db/models/Method';
import {useRecipe} from '../../../../db/recipeHooks';
import {toString} from '../../../../utils/measurement';
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
      <Text style={{fontSize: 18, color: '#111'}}>Ingredients</Text>
      {ingredients.map(ingredient => {
        switch (ingredient.type) {
          case 'parsed':
            return (
              <Text key={ingredient.id} style={{color: '#111'}}>
                {toString(ingredient)}
              </Text>
            );
          case 'raw':
          default:
            return (
              <Text key={ingredient.id} style={{color: '#111'}}>
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
      <Text style={{fontSize: 18, color: '#111'}}>Method</Text>
      {method.map(({step}) => (
        <Text key={step} style={{color: '#111'}}>
          {step}
        </Text>
      ))}
    </View>
  );
}

export function ViewRecipeScreen({route, navigation}: Props) {
  const recipe = useRecipe(route.params.id);

  useLayoutEffect(() => {
    const openBottomModal = () => {
      navigation.navigate('View Recipe Options', {id: route.params.id});
    };
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => <Button onPress={openBottomModal} title="More" />,
    });
  }, [navigation, route.params.id]);

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
            <Text style={{color: '#111'}}>Loading your recipe</Text>
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
            <Text style={{color: '#111'}}>Something went wrong</Text>
            <Text style={{color: '#111'}}>
              We couldn&apos;t retrieve your recipe, you can go back and try
              again.
            </Text>
            <Text style={{color: '#111'}}>{JSON.stringify(recipe.error)}</Text>
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
        <View>
          <ScrollView>
            <View style={{padding: 16}}>
              <Text style={{fontSize: 24, color: '#111'}}>{name}</Text>
              <Text style={{paddingTop: 8, color: '#111'}}>{description}</Text>
              <ScrollView horizontal style={{marginHorizontal: -16}}>
                <View style={{padding: 16}}>
                  <Row space={8}>
                    <Cell>
                      <Text style={{color: '#111'}}>Serves: {servings}</Text>
                    </Cell>
                    <Cell>
                      <Text style={{color: '#111'}}>
                        Prep Time: {minutesToHumanReadable(prepTimeMinutes)}
                      </Text>
                    </Cell>
                    <Cell>
                      <Text style={{color: '#111'}}>
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
            </View>
          </ScrollView>
        </View>
      );
    }
    default:
      <Text>Unexpected status: {JSON.stringify(recipe)}</Text>;
  }
}
