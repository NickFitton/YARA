import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MethodScreen} from './screens/Method';
import {MiseEnPlaceScreen} from './screens/MiseEnPlace';
import {MakeRecipeStackParamList} from './types';

const MakeRecipe = createNativeStackNavigator<MakeRecipeStackParamList>();

export function MakeRecipeStack() {
  return (
    <MakeRecipe.Navigator>
      <MakeRecipe.Screen name="MiseEnPlace" component={MiseEnPlaceScreen} />
      <MakeRecipe.Screen name="Method" component={MethodScreen} />
      {/* TODO: Enjoyment ratings */}
    </MakeRecipe.Navigator>
  );
}
