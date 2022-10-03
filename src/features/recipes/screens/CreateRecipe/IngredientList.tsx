import React, {RefObject, useRef, useState} from 'react';
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView, Text} from 'react-native';
import {v4} from 'uuid';
import {Input, Validation} from '../../../../components/Input/Input';
import {requiredValidator} from '../../../../components/LabelledInput/LabelledInput';
import {IngredientModel} from '../../types/Recipe';

const quantityUnitIngredientRegex = /([0-9.]+) ([\w]+)(?: of)? (\w+( \w+)*)/;
const quantityIngredientRegex = /([0-9.]+) (\w+( \w+)*)/;

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

const parseIngredient = (input: string): IngredientModel => {
  let match = input.match(quantityUnitIngredientRegex);
  if (match) {
    const [_, quantity, unit, name] = match;
    return {
      type: 'parsed',
      quantity: parseFloat(quantity),
      unit,
      name,
    };
  }
  match = input.match(quantityIngredientRegex);
  if (match) {
    const [_, quantity, name] = match;
    return {
      type: 'parsed',
      quantity: parseFloat(quantity),
      unit: '',
      name,
    };
  } else {
    return {type: 'raw', ingredient: input};
  }
};

export const IngredientList = ({
  scrollViewRef,
  onIsValidChanged,
  value,
  onChange,
}: {
  scrollViewRef: RefObject<ScrollView>;
  onIsValidChanged: (error: Validation | undefined) => void;
  value: IngredientModel[];
  onChange: (newState: IngredientModel[]) => void;
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
      const ingredient = parseIngredient(input.trim());
      onChange([...value, ingredient]);
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
      <Text style={{paddingTop: 8, paddingBottom: 8, color: '#000'}}>
        Ingredients*
      </Text>
      {value.map((ingredient, i) => {
        return (
          <View style={styles.input} key={ingredient.id}>
            <TouchableOpacity style={{flexGrow: 1}}>
              <Text
                style={{
                  color: '#000',
                }}>
                {displayIngredient(ingredient)}
              </Text>
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

const styles = StyleSheet.create({
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
