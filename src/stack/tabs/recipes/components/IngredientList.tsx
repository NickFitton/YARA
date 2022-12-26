import React, {useState} from 'react';
import {View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {v4} from 'uuid';
import {EditableItem} from '../../../../components/EditableItem/EditableItem';
import {
  IngredientModel,
  RawIngredientModel,
} from '../../../../db/models/Ingredient';

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

export const parseIngredient = (input: string): IngredientModel => ({
  id: v4(),
  type: 'raw',
  ingredient: input,
});

export function IngredientList({
  value,
  onChange,
}: {
  value: IngredientModel[];
  onChange: (newState: IngredientModel[]) => void;
}) {
  const [input, setInput] = useState<string>('');
  const submitText = () => {
    if (input.trim().length > 0) {
      const ingredient = parseIngredient(input.trim());
      onChange([...value, ingredient]);
    }
    setInput('');
  };

  return (
    <View>
      <Text variant="bodyLarge">Ingredients*</Text>
      {value.map(ingredient => (
        <View key={ingredient.id}>
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
      <TextInput
        mode="outlined"
        placeholder="1 Carrot"
        returnKeyType="next"
        value={input}
        onBlur={submitText}
        onChangeText={setInput}
        blurOnSubmit={false}
        onSubmitEditing={submitText}
      />
    </View>
  );
}
