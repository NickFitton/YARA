import React, {useRef, useState} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

import {EditableItem} from '../../../../components/EditableItem/EditableItem';
import {Input, Validation} from '../../../../components/Input/Input';
import {requiredValidator} from '../../../../components/LabelledInput/LabelledInput';
import {MethodModel} from '../../../../db/models/Method';

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

export function MethodList({
  value,
  onChange,
}: {
  value: MethodModel[];
  onChange: (newState: MethodModel[]) => void;
}) {
  const [input, setInput] = useState<string>('');
  const [errorHint, setErrorHint] = useState<string | undefined>();
  const ref = useRef<TextInput>(null);
  const handleIsValidChanged = (error: Validation | undefined) => {
    setErrorHint(error?.errorHint);
  };

  const submitText = () => {
    if (input.trim().length > 0) {
      onChange([...value, {type: 'raw', step: input}]);
    }
    setInput('');
  };

  return (
    <View>
      <Text style={{paddingTop: 8, paddingBottom: 8, color: '#000'}}>
        Method*
      </Text>
      {value.map((step, index) => (
        <View style={{paddingBottom: 8}}>
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
}
