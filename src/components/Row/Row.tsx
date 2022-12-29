import React, {Children} from 'react';
import {View, ViewProps} from 'react-native';

export function Row({children, space, ...rest}: ViewProps & {space: number}) {
  return (
    <View {...rest} style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
      {Children.map(children, (child, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={{marginTop: space, marginRight: space}}>
          {child}
        </View>
      ))}
    </View>
  );
}
