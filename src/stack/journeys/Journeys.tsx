import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {JourneyStackParamList} from './types';
import {MakeRecipeStack} from './makeRecipe/makeRecipeStack';
import {CreateRecipeStack} from './createRecipe/createRecipeStack';

const Journey = createNativeStackNavigator<JourneyStackParamList>();

export function Journeys() {
  return (
    <Journey.Navigator screenOptions={{headerShown: false}}>
      <Journey.Screen
        name="Create Recipe Journey"
        component={CreateRecipeStack}
      />
      <Journey.Screen name="Make Recipe Journey" component={MakeRecipeStack} />
    </Journey.Navigator>
  );
}
