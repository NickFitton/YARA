import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Input} from '../Input/Input';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
});

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
    <View style={styles.row}>
      {index !== undefined ? (
        <Text style={{color: '#111', paddingRight: 8}}>{index}</Text>
      ) : null}
      <View style={{flexGrow: 1}}>
        <Input
          placeholder="1 Carrot"
          returnKeyType="next"
          value={input}
          onBlur={onSubmit}
          onChangeText={setInput}
          blurOnSubmit={false}
          onSubmitEditing={onSubmit}
          // style={{width: '100%'}}
        />
      </View>
      <Button title="X" onPress={onDelete} />
    </View>
  );
}
