import React, {useState} from 'react';
import {View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';

import {EditableItem} from '../../../../components/EditableItem/EditableItem';
import {MethodModel} from '../../../../db/models/Method';

export function MethodList({
  value,
  onChange,
}: {
  value: MethodModel[];
  onChange: (newState: MethodModel[]) => void;
}) {
  const [input, setInput] = useState<string>('');

  const submitText = () => {
    if (input.trim().length > 0) {
      onChange([...value, {type: 'raw', step: input}]);
    }
    setInput('');
  };

  return (
    <View>
      <Text variant="bodyLarge">Method*</Text>
      {value.map((step, index) => (
        <View key={step.id}>
          <EditableItem
            index={index + 1}
            onDelete={() => {
              onChange(value.filter(filterStep => filterStep.id !== step.id));
            }}
            onValueChange={newStep => {
              const newMethod = value.map(mapIngredient => {
                if (mapIngredient.id === step.id) {
                  return {
                    type: 'raw',
                    step: newStep,
                  } as MethodModel;
                }
                return mapIngredient;
              });
              onChange(newMethod);
            }}
            value={step.step}
            key={step.id}
          />
        </View>
      ))}
      <TextInput
        mode="outlined"
        placeholder="Put the lime in the coconut"
        returnKeyType="next"
        value={input}
        onChangeText={setInput}
        blurOnSubmit={false}
        onBlur={submitText}
        onSubmitEditing={submitText}
      />
    </View>
  );
}
