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
import {MethodModel} from '../../types/Recipe';

export const MethodList = ({
  scrollViewRef,
  onIsValidChanged,
  value,
  onChange,
}: {
  scrollViewRef: RefObject<ScrollView>;
  onIsValidChanged: (error: Validation | undefined) => void;
  value: MethodModel[];
  onChange: (newState: MethodModel[]) => void;
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
      onChange([...value, {type: 'raw', step: input}]);
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
        Method*
      </Text>
      {value.map((step, i) => {
        return (
          <View style={styles.input} key={step.id}>
            <TouchableOpacity style={{flexGrow: 1}}>
              <Text style={{color: '#000'}}>{step.step}</Text>
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
