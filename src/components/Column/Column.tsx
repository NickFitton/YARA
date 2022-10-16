import React, {Children} from 'react';
import {View, ViewProps} from 'react-native';

export function Column({
  children,
  space,
  ...rest
}: ViewProps & {space: number}) {
  return (
    <View {...rest}>
      {Children.map(children, (child, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={i > 0 && {marginTop: space}}>
          {child}
        </View>
      ))}
    </View>
  );
}
