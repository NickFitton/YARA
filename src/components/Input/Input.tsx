import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

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
  const {validation, onIsValidChanged, onChangeText, value} = props;
  const [isErroneous, setIsErroneus] = useState<boolean>(false);

  const validate = useCallback(
    (text: string, propogate = true) => {
      const error = validation?.find(({validator}) => !validator(text));
      onIsValidChanged?.(error);
      setIsErroneus(!!error);
      if (propogate) {
        onChangeText?.(text);
      }
    },
    [validation, onIsValidChanged, onChangeText],
  );

  useEffect(() => {
    validate(value || '', false);
  }, [validate, value]);

  return (
    <TextInput
      style={[styles.input, isErroneous && styles.error]}
      {...props}
      ref={ref}
      placeholderTextColor="#aaa"
      onChangeText={validate}
    />
  );
});

Input.defaultProps = {
  validation: [],
  onIsValidChanged: () => {
    /* NO-OP */
  },
};
