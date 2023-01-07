import React from 'react';
import {FAB as PaperFAB, FABProps} from 'react-native-paper';

export function FAB(props: Pick<FABProps, 'icon' | 'onPress'>) {
  return (
    <PaperFAB
      accessibilityLabelledBy={undefined}
      accessibilityLanguage={undefined}
      onPointerEnter={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeave={undefined}
      onPointerLeaveCapture={undefined}
      onPointerMove={undefined}
      onPointerMoveCapture={undefined}
      onPointerCancel={undefined}
      onPointerCancelCapture={undefined}
      onPointerDown={undefined}
      onPointerDownCapture={undefined}
      onPointerUp={undefined}
      onPointerUpCapture={undefined}
      style={{position: 'absolute', right: 16, bottom: 16}}
      {...props}
    />
  );
}
