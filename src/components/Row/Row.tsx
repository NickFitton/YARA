import React, {Children} from 'react';
import {View, ViewProps} from 'react-native';

export const Row = ({
  children,
  space,
  ...rest
}: ViewProps & {space: number}) => (
  <View {...rest} style={{flex: 1, flexDirection: 'row'}}>
    {Children.map(children, (child, i) => (
      <View key={i} style={i > 0 && {marginLeft: space}}>
        {child}
      </View>
    ))}
  </View>
);
