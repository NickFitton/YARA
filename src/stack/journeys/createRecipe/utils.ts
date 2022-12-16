import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SuperStackParamList} from '../../RootStackParam';

export const useCreateRecipeJourney = () => {
  const navigation = useNavigation<NavigationProp<SuperStackParamList>>();

  return () => {
    navigation.navigate('Journeys', {
      screen: 'Create Recipe Journey',
      params: {screen: 'Scan Name'},
    });
  };
};
