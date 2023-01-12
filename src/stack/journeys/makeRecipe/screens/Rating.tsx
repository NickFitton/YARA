import Slider from '@react-native-community/slider';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  FAB,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {v4} from 'uuid';
import {Screen} from '../../../../components/Screen/Screen';
import {Rating, useRateRecipe} from '../../../../db/hooks/recipeHooks';
import {SuperStackParamList} from '../../../RootStackParam';
import {MakeRecipeStackParamList} from '../types';

type Params = {
  route: RouteProp<MakeRecipeStackParamList, 'Rate'>;
  navigation: NavigationProp<SuperStackParamList>;
};

type IdRating = Rating & {id: string};

function ItemSeparatorComponent() {
  return <View style={{paddingVertical: 4}} />;
}

const names = ['Neil', 'Ali', 'Abby', 'Jaide', 'Joe'];
const randomName = () => names[Math.floor(Math.random() * names.length)];
const starByRating = (rating: number, halfStarPoint: number) => {
  if (rating < halfStarPoint) {
    return 'star-outline';
  }
  if (rating > halfStarPoint) {
    return 'star';
  }
  return 'star-half-full';
};

export function RatingScreen({route, navigation}: Params) {
  const [ratings, setRatings] = useState<IdRating[]>([
    {id: v4(), rater: 'Nick', value: 5, scaleFrom: 0, scaleTo: 10},
    {id: v4(), rater: 'Heather', value: 5, scaleFrom: 0, scaleTo: 10},
  ]);

  const {rateRecipe} = useRateRecipe(route.params.id);
  const theme = useTheme();
  useEffect(() => {
    const onPress = async () => {
      await rateRecipe(ratings);
      navigation.navigate('Tabs', {
        screen: 'Recipes',
        params: {screen: 'View Recipe', params: {id: route.params.id}},
      });
    };
    const headerRight = () => (
      <Appbar.Action
        icon="check"
        onPress={() => {
          onPress().catch(console.error);
        }}
      />
    );
    navigation.setOptions({headerRight});
  }, [navigation, rateRecipe, ratings, route.params.id]);
  const addRating = () =>
    setRatings(pRatings => [
      ...pRatings,
      {id: v4(), rater: randomName(), value: 5, scaleFrom: 0, scaleTo: 10},
    ]);
  const {primary, surfaceVariant} = useTheme().colors;

  const renderItem = ({
    item: {rater, value, id: itemId},
    index,
  }: {
    item: IdRating;
    index: number;
  }) => {
    const onChangeText = (text: string): void =>
      setRatings(pRatings =>
        pRatings.map((rating, j) =>
          index === j ? {...rating, rater: text} : rating,
        ),
      );

    const onValueChange = (newValue: number): void =>
      setRatings(pRatings =>
        pRatings.map((rating, j) =>
          index === j ? {...rating, value: newValue} : rating,
        ),
      );
    const onRemove = () =>
      setRatings(pRatings => pRatings.filter(({id}) => id !== itemId));
    return (
      <Card>
        <Card.Content>
          <TextInput
            value={rater}
            onChangeText={onChangeText}
            mode="outlined"
            right={<TextInput.Affix text={`${value}`} />}
          />
          <View style={{paddingVertical: 8}} />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              justifyContent: 'space-around',
            }}>
            <Icon
              name={starByRating(value, 1)}
              size={30}
              color={theme.colors.primary}
            />
            <Icon
              name={starByRating(value, 3)}
              size={30}
              color={theme.colors.primary}
            />
            <Icon
              name={starByRating(value, 5)}
              size={30}
              color={theme.colors.primary}
            />
            <Icon
              name={starByRating(value, 7)}
              size={30}
              color={theme.colors.primary}
            />
            <Icon
              name={starByRating(value, 9)}
              size={30}
              color={theme.colors.primary}
            />
          </View>
          <View style={{paddingVertical: 8}} />
          <Slider
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor={primary}
            maximumTrackTintColor={surfaceVariant}
            thumbTintColor={primary}
            value={5}
            onValueChange={onValueChange}
            step={1}
          />
        </Card.Content>
        <View style={{paddingVertical: 8}} />
        <Card.Actions>
          <Button onPress={onRemove}>Remove Rater</Button>
        </Card.Actions>
      </Card>
    );
  };

  const keyExtractor = ({id}: IdRating): string => id;
  return (
    <>
      <Screen>
        <Text variant="labelLarge">Who ate and how was it?</Text>
        <FlatList
          data={ratings}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </Screen>
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        label="Add rater"
        icon="account-plus"
        onPress={addRating}
      />
    </>
  );
}
