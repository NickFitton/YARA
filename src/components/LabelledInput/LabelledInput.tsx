import React, {forwardRef, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Input, InputProps, Validation} from '../Input/Input';

const styles = StyleSheet.create({
  label: {
    paddingBottom: 4,
    color: '#000',
  },
  hint: {
    color: '#e55',
    fontSize: 12,
  },
});

export interface LabelledInputProps extends InputProps {
  required?: boolean;
  label: string;
}

export const requiredValidator: Validation = {
  errorName: 'Required',
  errorHint: 'This field is required',
  validator: input => input.trim().length > 0,
};

export const LabelledInput = forwardRef<TextInput, LabelledInputProps>(
  (
    {
      label,
      required,
      validation,
      onIsValidChanged: onError,
      ...rest
    }: LabelledInputProps,
    ref,
  ) => {
    const [errorHint, setErrorHint] = useState<string | undefined>();
    const handleError = (error: Validation | undefined) => {
      onError?.(error);
      setErrorHint(error?.errorHint);
    };
    return (
      <View>
        <Text style={[styles.label]}>
          {label}
          {required ? <Text>*</Text> : null}
        </Text>
        <Input
          {...rest}
          ref={ref}
          validation={[
            ...(validation || []),
            ...(required ? [requiredValidator] : []),
          ]}
          onIsValidChanged={handleError}
        />
        {errorHint ? <Text style={styles.hint}>{errorHint}</Text> : null}
      </View>
    );
  },
);
LabelledInput.defaultProps = {
  required: false,
};
