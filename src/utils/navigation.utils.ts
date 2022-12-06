import {CommonActions, ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const resetNavigationTo = <
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
>(
  navigation: NativeStackNavigationProp<ParamList, keyof ParamList>,
  destination: RouteName,
  params?: ParamList[RouteName],
) => {
  const state = navigation.getState();
  const existingRoute = state?.routes?.find(
    ({name}) => (name as string) === destination,
  );

  if (existingRoute) {
    navigation.dispatch(
      CommonActions.reset({
        ...state,
        routes: [{...existingRoute, params}],
        index: 0,
      }),
    );
  }
};
