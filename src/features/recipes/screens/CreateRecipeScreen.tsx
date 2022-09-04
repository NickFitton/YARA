import {NavigationProp} from '@react-navigation/native';
import React, {RefObject, useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView, Text} from 'react-native';
import {Input, Validation} from '../../../components/Input/Input';
import {
  LabelledInput,
  requiredValidator,
} from '../../../components/LabelledInput/LabelledInput';
import {useRecipeStorage} from '../recipeHooks';
import {Recipe} from '../types/Recipe';

type FieldName = keyof Recipe;
type FieldValidation = Record<FieldName, boolean>;

interface RecipeForm
  extends Omit<Recipe, 'servings' | 'prepTimeMinutes' | 'cookTimeMinutes'> {
  servings: string;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
}

const useCreateForm = () => {
  const {createRecipe: create} = useRecipeStorage();
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

    const servings = parseInt(servingsString);
    const prepTimeMinutes = parseInt(prepTimeMinutesString);
    const cookTimeMinutes = parseInt(cookTimeMinutesString);

    if (
      servings === NaN ||
      prepTimeMinutes === NaN ||
      cookTimeMinutes === NaN
    ) {
      console.error(
        "There was an error, we'll probably want to handle this better.",
      );
      return;
    }

    create({
      ...recipe,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
    }).then(recipeId => {});
  };

  return {validFields: validation, check: checkValidation, createRecipe};
};

export const CreateRecipeScreen = () => {
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
  const updateForm = (key: FieldName) => (value: any) =>
    setFormState(pState => ({...pState, [key]: value}));

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={'padding'}
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
};

const IngredientList = ({
  scrollViewRef,
  onIsValidChanged,
  value,
  onChange,
}: {
  scrollViewRef: RefObject<ScrollView>;
  onIsValidChanged: (error: Validation | undefined) => void;
  value: string[];
  onChange: (newState: string[]) => void;
}) => {
  const [input, setInput] = useState<string>('');
  const [errorHint, setErrorHint] = useState<string | undefined>();
  const ref = useRef<TextInput>(null);
  const handleIsValidChanged = (error: Validation | undefined) => {
    setErrorHint(error?.errorHint);
    onIsValidChanged(error);
  };
  const submitText = () => {
    if (input.trim().length > 0) {
      onChange([...value, input]);
      setTimeout(
        () =>
          ref.current?.measure((x, y) =>
            scrollViewRef.current?.scrollTo({x, y}),
          ),
        0,
      );
    }
    setInput('');
  };

  return (
    <View>
      <Text style={{paddingTop: 8, paddingBottom: 8}}>Ingredients*</Text>
      {value.map((ingredient, i) => {
        return (
          <View style={styles.input} key={ingredient}>
            <TouchableOpacity style={{flexGrow: 1}}>
              <Text>{ingredient}</Text>
            </TouchableOpacity>
            <Button
              title="X"
              onPress={() => onChange(value.filter((_, j) => i != j))}
            />
          </View>
        );
      })}
      <Input
        ref={ref}
        placeholder="1 Carrot"
        returnKeyType="next"
        value={input}
        onBlur={submitText}
        onChangeText={setInput}
        blurOnSubmit={false}
        validation={value.length === 0 ? [requiredValidator] : []}
        onIsValidChanged={handleIsValidChanged}
        onSubmitEditing={submitText}
      />
      {errorHint ? <Text style={styles.hint}>{errorHint}</Text> : null}
    </View>
  );
};

const MethodList = ({
  scrollViewRef,
  onIsValidChanged,
  value,
  onChange,
}: {
  scrollViewRef: RefObject<ScrollView>;
  onIsValidChanged: (error: Validation | undefined) => void;
  value: string[];
  onChange: (newState: string[]) => void;
}) => {
  const [input, setInput] = useState<string>('');
  const [errorHint, setErrorHint] = useState<string | undefined>();
  const ref = useRef<TextInput>(null);
  const handleIsValidChanged = (error: Validation | undefined) => {
    setErrorHint(error?.errorHint);
    onIsValidChanged(error);
  };

  const submitText = () => {
    if (input.trim().length > 0) {
      onChange([...value, input]);
      setTimeout(
        () =>
          ref.current?.measure((x, y) =>
            scrollViewRef.current?.scrollTo({x, y}),
          ),
        0,
      );
    }
    setInput('');
  };
  return (
    <View>
      <Text style={{paddingTop: 8, paddingBottom: 8}}>Method*</Text>
      {value.map((step, i) => {
        return (
          <View style={styles.input} key={step}>
            <TouchableOpacity style={{flexGrow: 1}}>
              <Text>{step}</Text>
            </TouchableOpacity>
            <Button
              title="X"
              onPress={() => onChange(value.filter((_, j) => i != j))}
            />
          </View>
        );
      })}
      <Input
        ref={ref}
        placeholder="Put the lime in the coconut"
        returnKeyType="next"
        value={input}
        onChangeText={setInput}
        blurOnSubmit={false}
        onBlur={submitText}
        validation={value.length === 0 ? [requiredValidator] : []}
        onIsValidChanged={handleIsValidChanged}
        onSubmitEditing={submitText}
      />
      {errorHint ? <Text style={styles.hint}>{errorHint}</Text> : null}
    </View>
  );
};

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
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
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
    marginBottom: 8,
  },

  hint: {
    color: '#e55',
    fontSize: 12,
  },
});
