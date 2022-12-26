import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';

export function EditableItem({
  value,
  onValueChange,
  onDelete,
  index,
}: {
  value: string;
  onValueChange: (newValue: string) => void;
  onDelete: () => void;
  // eslint-disable-next-line react/require-default-props
  index?: number;
}) {
  const [input, setInput] = useState<string>(value);
  const onSubmit = () => {
    onValueChange(input);
  };

  return (
    <TextInput
      mode="outlined"
      placeholder="1 Carrot"
      returnKeyType="next"
      value={input}
      onBlur={onSubmit}
      onChangeText={setInput}
      blurOnSubmit={false}
      onSubmitEditing={onSubmit}
      left={index !== undefined ? <TextInput.Affix text={`${index}`} /> : null}
      right={<TextInput.Icon icon="delete" onPress={onDelete} />}
    />
  );
}
