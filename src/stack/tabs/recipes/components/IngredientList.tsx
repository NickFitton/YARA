import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {v4} from 'uuid';
import {EditableItem} from '../../../../components/EditableItem/EditableItem';
import {Input, Validation} from '../../../../components/Input/Input';
import {requiredValidator} from '../../../../components/LabelledInput/LabelledInput';
import {
  IngredientModel,
  Measurement,
  RawIngredientModel,
} from '../../../../db/models/Ingredient';

const quantityUnitIngredientRegex = /([0-9.]+) ([\w]+)(?: of)? (\w+( \w+)*)/;
const quantityIngredientRegex = /([0-9.]+) (\w+( \w+)*)/;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    color: '#111',
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

const displayIngredient = (ingredient: IngredientModel): string => {
  switch (ingredient.type) {
    case 'parsed': {
      const {quantity, unit, name} = ingredient;
      if (unit) {
        return `${quantity}${unit} of ${name}`;
      }
      return `${quantity} ${name}`;
    }
    case 'raw':
    default:
      return ingredient.ingredient;
  }
};

export const parseIngredient = (input: string): IngredientModel => {
  let match = input.match(quantityUnitIngredientRegex);
  const id = v4();
  if (match) {
    const [, quantity, unit, name] = match;
    return {
      id,
      type: 'parsed',
      quantity: parseFloat(quantity),
      unit: unit as Measurement,
      name,
    };
  }
  match = input.match(quantityIngredientRegex);
  if (match) {
    const [, quantity, name] = match;
    return {
      id,
      type: 'parsed',
      quantity: parseFloat(quantity),
      name,
    };
  }
  return {
    id,
    type: 'raw',
    ingredient: input,
  };
};

export function IngredientList({
  value,
  onChange,
}: {
  value: IngredientModel[];
  onChange: (newState: IngredientModel[]) => void;
}) {
  const [input, setInput] = useState<string>('');
  const [errorHint, setErrorHint] = useState<string | undefined>();
  const handleIsValidChanged = (error: Validation | undefined) => {
    setErrorHint(error?.errorHint);
  };
  const submitText = () => {
    if (input.trim().length > 0) {
      const ingredient = parseIngredient(input.trim());
      onChange([...value, ingredient]);
    }
    setInput('');
  };

  return (
    <View>
      <Text style={{paddingTop: 8, paddingBottom: 8, color: '#111'}}>
        Ingredients*
      </Text>
      {value.map(ingredient => (
        <View style={{paddingBottom: 8}} key={ingredient.id}>
          <EditableItem
            onDelete={() => {
              onChange(
                value.filter(
                  filterIngredient => filterIngredient.id !== ingredient.id,
                ),
              );
            }}
            onValueChange={newIngredient => {
              const newIngredients = value.map(mapIngredient => {
                if (mapIngredient.id === ingredient.id) {
                  return {
                    type: 'raw',
                    ingredient: newIngredient,
                  } as {type: 'raw'} & RawIngredientModel;
                }
                return mapIngredient;
              });
              onChange(newIngredients);
            }}
            value={displayIngredient(ingredient)}
            key={ingredient.id}
          />
        </View>
      ))}
      <Input
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
}
