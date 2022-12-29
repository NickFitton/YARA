import {NavigationProp, RouteProp} from '@react-navigation/native';

export type MakeRecipeStackParamList = {
  MiseEnPlace: {id: string};
  Method: {id: string};
  Rate: {id: string};
};

export type MakeRecipeProps<T extends keyof MakeRecipeStackParamList> = {
  route: RouteProp<MakeRecipeStackParamList, T>;
  navigation: NavigationProp<MakeRecipeStackParamList, T>;
};
