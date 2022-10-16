import {RouteProp} from '@react-navigation/native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {Validation} from '../../../../components/Input/Input';
import {LabelledInput} from '../../../../components/LabelledInput/LabelledInput';
import {IngredientModel} from '../../../../db/models/Ingredient';
import {MethodModel} from '../../../../db/models/Method';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {IngredientList} from './IngredientList';
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
type FieldValidation = Record<FieldName, boolean>;

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
  const [validation, setValidation] = useState<FieldValidation>({
    name: false,
    description: true,
    servings: true,
    prepTimeMinutes: true,
    cookTimeMinutes: true,
    ingredients: false,
    method: false,
  });

  const checkValidation = (error: Validation | undefined, key: FieldName) => {
    setValidation(pValidation => ({...pValidation, [key]: !error}));
  };

  const createRecipe = (recipe: RecipeForm) => {
    const {
      servings: servingsString,
      prepTimeMinutes: prepTimeMinutesString,
      cookTimeMinutes: cookTimeMinutesString,
    } = recipe;

    const servings = parseInt(servingsString, 10);
    const prepTimeMinutes = parseInt(prepTimeMinutesString, 10);
    const cookTimeMinutes = parseInt(cookTimeMinutesString, 10);

    if (
      Number.isNaN(servings) ||
      Number.isNaN(prepTimeMinutes) ||
      Number.isNaN(cookTimeMinutes)
    ) {
      Alert.alert(
        "There was an error, we'll probably want to handle this better.",
      );
    }

    // create({
    //   ...recipe,
    //   servings,
    //   prepTimeMinutes,
    //   cookTimeMinutes,
    // }).then(recipeId => {
    //   navigate('RecipesRoot');
    // });
  };

  return {validFields: validation, check: checkValidation, createRecipe};
};

export function CreateRecipeScreen({
  route,
}: {
  route: RouteProp<RecipeStackParamList, 'Create Recipe'>;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const {validFields, check, createRecipe} = useCreateForm();
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
    setFormState(pFormState => ({
      ...pFormState,
      name: name || pFormState.name,
      description: description || pFormState.description,
      ingredients: ingredients || pFormState.ingredients,
      method: method || pFormState.method,
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
              onIsValidChanged={error => check(error, 'name')}
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
            scrollViewRef={scrollViewRef}
            value={formState.ingredients}
            onChange={updateForm('ingredients')}
            onIsValidChanged={error => check(error, 'ingredients')}
          />
          <MethodList
            scrollViewRef={scrollViewRef}
            value={formState.method}
            onChange={updateForm('method')}
            onIsValidChanged={error => check(error, 'method')}
          />

          <View style={{paddingTop: 8}}>
            <Button
              onPress={() => createRecipe(formState)}
              title="Create"
              disabled={Object.values(validFields).some(
                valid => valid === false,
              )}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
