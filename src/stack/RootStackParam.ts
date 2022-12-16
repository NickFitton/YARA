import {NavigatorScreenParams} from '@react-navigation/native';
import {JourneyStackParamList} from './journeys/types';
import {TabStackParamList} from './tabs/types';

export type SuperStackParamList = {
  Tabs: NavigatorScreenParams<TabStackParamList>;
  Journeys: NavigatorScreenParams<JourneyStackParamList>;
};
