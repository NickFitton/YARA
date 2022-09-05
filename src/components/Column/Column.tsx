import React, {Children, PropsWithChildren} from 'react';
import {View, ViewProps} from 'react-native';

export const Column = ({
  children,
  space,
  ...rest
}: ViewProps & {space: number}) => (
  <View {...rest}>
    {Children.map(children, (child, i) => (
      <View style={i > 0 && {marginTop: space}}>{child}</View>
    ))}
  </View>
);
