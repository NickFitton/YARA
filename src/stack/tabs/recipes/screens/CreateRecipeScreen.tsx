import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React, {useLayoutEffect, useState} from 'react';
import {KeyboardAvoidingView, View, Alert, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {v4} from 'uuid';

import {IngredientModel} from '../../../../db/models/Ingredient';
import {MethodModel} from '../../../../db/models/Method';
import {randomHex} from '../../../../utils/hex';
import {useCreateRecipe} from '../../../../db/hooks/recipeHooks';

import {RecipeStackParamList} from '../RecipeStackParam';
import {IngredientList, parseIngredient} from '../components/IngredientList';
import {MethodList} from '../components/MethodList';
import {ScrollScreen} from '../../../../components/Screen/Screen';
import {Column} from '../../../../components/Column/Column';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 1,
    flexGrow: 1,
  },
});

interface RecipeFields {
  name: string;
  description: string;
  servings: string;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  ingredients: IngredientModel[];
  method: MethodModel[];
}

type FieldName = keyof RecipeFields;

interface RecipeForm
  extends Omit<
    RecipeFields,
    'servings' | 'prepTimeMinutes' | 'cookTimeMinutes'
  > {
  servings: string;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
}

const useCreateForm = () => {
  const {createRecipe: create} = useCreateRecipe();
  const navigation = useNavigation<NavigationProp<RecipeStackParamList>>();
  const createRecipe = (recipe: RecipeForm) => {
    const {
      servings: servingsString,
      prepTimeMinutes: prepTimeMinutesString,
      cookTimeMinutes: cookTimeMinutesString,
    } = recipe;

    const servings = parseInt(servingsString, 10) || 0;
    const prepTimeMinutes = parseInt(prepTimeMinutesString, 10) || 0;
    const cookTimeMinutes = parseInt(cookTimeMinutesString, 10) || 0;

    if (
      Number.isNaN(servings) ||
      Number.isNaN(prepTimeMinutes) ||
      Number.isNaN(cookTimeMinutes)
    ) {
      Alert.alert(
        "There was an error, we'll probably want to handle this better.",
      );
    }

    create({
      ...recipe,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
    })
      .then(recipeId => {
        navigation.dispatch(state =>
          CommonActions.reset({
            ...state,
            routes: [
              state.routes[0],
              {
                key: `View Recipe-${randomHex(8)}`,
                name: 'View Recipe',
                params: {id: recipeId},
              },
            ],
            index: 1,
          }),
        );
      })
      .catch(e => {
        Alert.alert(JSON.stringify(e));
      });
  };

  return {createRecipe};
};

export function CreateRecipeScreen({
  route,
}: {
  route: RouteProp<RecipeStackParamList, 'Create Recipe'>;
}) {
  const {createRecipe} = useCreateForm();
  const [formState, setFormState] = useState<RecipeForm>({
    name: '',
    description: '',
    servings: '2',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    ingredients: [],
    method: [],
  });
  const updateForm = (key: FieldName) => (value: RecipeFields[FieldName]) =>
    setFormState(pState => ({...pState, [key]: value}));

  useLayoutEffect(() => {
    const {name, description, ingredients, method} = route.params || {};
    const parsedIngredients = (ingredients || []).map(ingredient =>
      parseIngredient(ingredient.trim()),
    );
    const parsedMethod = (method || []).map(
      step =>
        ({
          id: v4(),
          type: 'raw',
          step: step.trim(),
        } as MethodModel),
    );

    setFormState(pFormState => ({
      ...pFormState,
      name: name || pFormState.name,
      description: description || pFormState.description,
      ingredients: parsedIngredients,
      method: parsedMethod,
    }));
  }, [route]);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScrollScreen>
        <Column space={8} style={{marginBottom: 64}}>
          <TextInput
            mode="outlined"
            label="Name"
            value={formState.name}
            onChangeText={updateForm('name')}
            placeholder="Beef Stew"
          />
          <TextInput
            mode="outlined"
            label="Description"
            multiline
            value={formState.description}
            onChangeText={updateForm('description')}
          />
          <TextInput
            mode="outlined"
            label="Servings"
            value={formState.servings}
            onChangeText={updateForm('servings')}
            keyboardType="number-pad"
          />
          <View style={styles.row}>
            <TextInput
              style={styles.rowItem}
              mode="outlined"
              label="Prep Time"
              keyboardType="number-pad"
              value={formState.prepTimeMinutes}
              onChangeText={updateForm('prepTimeMinutes')}
            />
            <TextInput
              style={styles.rowItem}
              mode="outlined"
              label="Cook Time"
              keyboardType="number-pad"
              value={formState.cookTimeMinutes}
              onChangeText={updateForm('cookTimeMinutes')}
            />
          </View>
          <IngredientList
            value={formState.ingredients}
            onChange={updateForm('ingredients')}
          />
          <MethodList
            value={formState.method}
            onChange={updateForm('method')}
          />

          <View style={{paddingTop: 8}}>
            <Button onPress={() => createRecipe(formState)} mode="contained">
              Create
            </Button>
          </View>
        </Column>
      </ScrollScreen>
    </KeyboardAvoidingView>
  );
}
