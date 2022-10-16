import React, {Children} from 'react';
import {View, ViewProps} from 'react-native';

export function Row({children, space, ...rest}: ViewProps & {space: number}) {
  return (
    <View {...rest} style={{flex: 1, flexDirection: 'row'}}>
      {Children.map(children, (child, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={i > 0 && {marginLeft: space}}>
          {child}
        </View>
      ))}
    </View>
  );
}
