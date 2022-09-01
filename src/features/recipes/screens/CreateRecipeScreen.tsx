import { NavigationProp } from '@react-navigation/native';
import React, { RefObject, useLayoutEffect, useRef, useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView, Text } from 'react-native';
import { Input, Validation } from '../../../components/Input/Input';
import {
  LabelledInput,
  requiredValidator,
} from '../../../components/LabelledInput/LabelledInput';

type FieldName =
  | 'name'
  | 'description'
  | 'servings'
  | 'prepTime'
  | 'cookTime'
  | 'ingredients'
  | 'method';
type FieldValidation = Record<FieldName, boolean>;

const useCreateForm = () => {
  const [validation, setValidation] = useState<FieldValidation>({
    name: true,
    description: true,
    servings: true,
    prepTime: true,
    cookTime: true,
    ingredients: true,
    method: true,
  });

  const checkValidation = (error: Validation | undefined, key: FieldName) => {
    setValidation(pValidation => ({ ...pValidation, [key]: !error }));
  };

  const createRecipe = () => {
    console.log('do nothing');
  };

  return { validFields: validation, check: checkValidation, createRecipe };
};

export const CreateRecipeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<{}>;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { validFields, check, createRecipe } = useCreateForm();
  const [formState, setFormState] = useState<Record<FieldName, any>>({
    name: '',
    description: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    ingredients: [],
    method: [],
  });
  const updateForm = (key: FieldName) => (value: any) =>
    setFormState(pState => ({ ...pState, [key]: value }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={createRecipe}
          title="Create"
          disabled={Object.values(validFields).some(valid => valid === false)}
        />
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={'padding'}
      keyboardVerticalOffset={100}
    >
      <ScrollView ref={scrollViewRef}>
        <View
          style={{
            padding: 16,
            paddingTop: 32,
          }}
        >
          <View style={{ paddingBottom: 8 }}>
            <LabelledInput
              label="Name"
              required
              value={formState.name}
              onChangeText={updateForm('name')}
              placeholder="Beef Stew"
              onIsValidChanged={error => check(error, 'name')}
            />
          </View>
          <View style={{ paddingBottom: 8 }}>
            <LabelledInput label="Description" multiline />
          </View>
          <View style={{ paddingBottom: 8 }}>
            <LabelledInput
              label="Servings"
              required
              value={'2'}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.rowItem]}>
              <LabelledInput label="Prep Time" keyboardType="number-pad" />
            </View>
            <View style={[styles.rowItem, { paddingLeft: 8 }]}>
              <LabelledInput label="Cook Time" keyboardType="number-pad" />
            </View>
          </View>
          <IngredientList
            scrollViewRef={scrollViewRef}
            onIsValidChanged={error => check(error, 'ingredients')}
          />
          <MethodList
            scrollViewRef={scrollViewRef}
            onIsValidChanged={error => check(error, 'method')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const IngredientList = ({
  scrollViewRef,
  onIsValidChanged,
}: {
  scrollViewRef: RefObject<ScrollView>;
  onIsValidChanged: (error: Validation | undefined) => void;
}) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [errorHint, setErrorHint] = useState<string | undefined>();
  const ref = useRef<TextInput>(null);
  const handleIsValidChanged = (error: Validation | undefined) => {
    setErrorHint(error?.errorHint);
    onIsValidChanged(error);
  };
  const submitText = () => {
    if (input.trim().length > 0) {
      setIngredients(ingredients => [...ingredients, input]);
      setTimeout(
        () =>
          ref.current?.measure((x, y) =>
            scrollViewRef.current?.scrollTo({ x, y }),
          ),
        0,
      );
    }
    setInput('');
  };

  return (
    <View>
      <Text style={{ paddingTop: 8, paddingBottom: 8 }}>Ingredients*</Text>
      {ingredients.map((ingredient, i) => {
        return (
          <View style={styles.input} key={ingredient}>
            <TouchableOpacity style={{ flexGrow: 1 }}>
              <Text>{ingredient}</Text>
            </TouchableOpacity>
            <Button
              title="X"
              onPress={() =>
                setIngredients(ingredients =>
                  ingredients.filter((_, j) => i != j),
                )
              }
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
        validation={ingredients.length === 0 ? [requiredValidator] : []}
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
}: {
  scrollViewRef: RefObject<ScrollView>;
  onIsValidChanged: (error: Validation | undefined) => void;
}) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [errorHint, setErrorHint] = useState<string | undefined>();
  const ref = useRef<TextInput>(null);
  const handleIsValidChanged = (error: Validation | undefined) => {
    setErrorHint(error?.errorHint);
    onIsValidChanged(error);
  };

  const submitText = () => {
    if (input.trim().length > 0) {
      setSteps(steps => [...steps, input]);
      setTimeout(
        () =>
          ref.current?.measure((x, y) =>
            scrollViewRef.current?.scrollTo({ x, y }),
          ),
        0,
      );
    }
    setInput('');
  };
  return (
    <View>
      <Text style={{ paddingTop: 8, paddingBottom: 8 }}>Method*</Text>
      {steps.map((ingredient, i) => {
        return (
          <View style={styles.input}>
            <TouchableOpacity style={{ flexGrow: 1 }}>
              <Text>{ingredient}</Text>
            </TouchableOpacity>
            <Button
              title="X"
              onPress={() =>
                setSteps(ingredients => ingredients.filter((_, j) => i != j))
              }
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
        validation={steps.length === 0 ? [requiredValidator] : []}
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
