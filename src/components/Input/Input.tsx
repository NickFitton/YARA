import {forwardRef, useEffect, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import React from 'react';

export interface Validation {
  errorName: string;
  // Returns true if input is valid
  validator: (input: string) => boolean;
  errorHint: string;
}

export interface InputProps extends TextInputProps {
  validation?: Validation[];
  onIsValidChanged?: (error: Validation | undefined) => void;
}

export const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const [isErroneous, setIsErroneus] = useState<boolean>(false);

  const validate = (text: string, propogate = true) => {
    const error = props.validation?.find(({validator}) => !validator(text));
    props.onIsValidChanged?.(error);
    setIsErroneus(!!error);
    if (propogate) {
      props.onChangeText?.(text);
    }
  };

  useEffect(() => {
    validate(props.value || '', false);
  }, []);

  return (
    <TextInput
      style={[styles.input, isErroneous && styles.error]}
      {...props}
      ref={ref}
      placeholderTextColor={'#aaa'}
      onChangeText={validate}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    color: '#000',
    elevation: 5,
  },
  error: {
    borderColor: '#e55',
  },
});
