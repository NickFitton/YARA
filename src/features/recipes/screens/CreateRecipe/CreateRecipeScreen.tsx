import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {LabelledInput} from '../../../../components/LabelledInput/LabelledInput';
import {IngredientModel} from '../../../../db/models/Ingredient';
import {MethodModel} from '../../../../db/models/Method';
import {randomHex} from '../../../../utils/hex';
import {useCreateRecipe} from '../../recipeHooks';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {IngredientList, parseIngredient} from './IngredientList';
import {MethodList} from './MethodList';

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

  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    color: '#000',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 8,
  },

  hint: {
    color: '#e55',
    fontSize: 12,
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
            index: 0,
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
  const scrollViewRef = useRef<ScrollView>(null);
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="padding"
      keyboardVerticalOffset={100}>
      <ScrollView ref={scrollViewRef}>
        <View
          style={{
            padding: 16,
            paddingTop: 32,
          }}>
          <View style={{paddingBottom: 8}}>
            <LabelledInput
              label="Name"
              required
              value={formState.name}
              onChangeText={updateForm('name')}
              placeholder="Beef Stew"
            />
          </View>
          <View style={{paddingBottom: 8}}>
            <LabelledInput
              label="Description"
              multiline
              value={formState.description}
              onChangeText={updateForm('description')}
            />
          </View>
          <View style={{paddingBottom: 8}}>
            <LabelledInput
              label="Servings"
              required
              value={formState.servings}
              onChangeText={updateForm('servings')}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.rowItem]}>
              <LabelledInput
                label="Prep Time"
                keyboardType="number-pad"
                value={formState.prepTimeMinutes}
                onChangeText={updateForm('prepTimeMinutes')}
              />
            </View>
            <View style={[styles.rowItem, {paddingLeft: 8}]}>
              <LabelledInput
                label="Cook Time"
                keyboardType="number-pad"
                value={formState.cookTimeMinutes}
                onChangeText={updateForm('cookTimeMinutes')}
              />
            </View>
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
            <Button onPress={() => createRecipe(formState)} title="Create" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
