import React, {Children} from 'react';
import {View, ViewProps} from 'react-native';

export const Column = ({
  children,
  space,
  ...rest
}: ViewProps & {space: number}) => (
  <View {...rest}>
    {Children.map(children, (child, i) => (
      <View key={i} style={i > 0 && {marginTop: space}}>
        {child}
      </View>
    ))}
  </View>
);
