import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, Pressable, Animated} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Text, useTheme} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from 'victory-native';

import {RecipeStackParamList} from '../RecipeStackParam';
import {useRecipeRatings} from '../../../../db/recipeHooks';
import {chartTheme} from '../../../../components/charts/theme';
import {RatingModel} from '../../../../db/models/Rating';

type Props = {
  route: RouteProp<RecipeStackParamList, 'Recipe Ratings'>;
  navigation: NavigationProp<RecipeStackParamList, 'Recipe Ratings'>;
};
const initialRatings: Record<number, number> = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};

const scoreOfRatings = (ratings: RatingModel[], fixedPresision = 2) => {
  const [totalRating, maxRating] = ratings.reduce(
    ([total, max], {value, scaleTo, scaleFrom}) => [
      total + (value - scaleFrom),
      max + (scaleTo - scaleFrom),
    ],
    [0, 0],
  );
  return ((totalRating / maxRating) * 5).toFixed(fixedPresision);
};

function PrettyRating({rating}: {rating: string}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
      }}>
      <Text variant="headlineLarge">{rating}</Text>
      <Text variant="bodyMedium">/5.0</Text>
    </View>
  );
}

function RatingGraph({data}: {data: {x: string; y: number}[]}) {
  const theme = useTheme();
  const paddedData = data.map(bar => ({...bar, y0: -2}));
  return (
    <VictoryChart theme={chartTheme(theme.colors)} height={200} width={200}>
      <VictoryAxis
        dependentAxis={false}
        tickFormat={(datum: number) => `${datum}★`}
        tickLabelComponent={<VictoryLabel dx={-10} />}
      />
      <VictoryBar
        horizontal
        barRatio={1}
        labels={({datum}: {datum: {y: number}}) => datum.y}
        labelComponent={<VictoryLabel dx={5} />}
        style={{}}
        data={paddedData}
      />
    </VictoryChart>
  );
}

function RecipeRatingsBottomSheet({navigation, route}: Props) {
  const theme = useTheme();
  const data = useRecipeRatings(route.params.id);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useFocusEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  const close = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    bottomSheetRef.current!.close();
  };

  if (data.status === 'success') {
    const raterAggregate = data.data.reduce(
      (agg, next) => ({
        ...agg,
        [next.rater]: [...(agg[next.rater] ?? []), next],
      }),
      {} as Record<string, RatingModel[]>,
    );
    const averageRating = scoreOfRatings(data.data);
    const chartData = Object.entries(
      data.data.reduce((agg, next) => {
        const stars = Math.ceil(next.value / 2);
        return {...agg, [stars]: agg[stars] + 1};
      }, initialRatings),
    ).map(([rating, count]) => ({x: rating, y: count}));
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: '#111', opacity: fadeAnim},
          ]}>
          <Pressable onPress={close} style={[StyleSheet.absoluteFill]} />
        </Animated.View>
        <BottomSheet
          backgroundStyle={{backgroundColor: theme.colors.elevation.level1}}
          handleIndicatorStyle={{backgroundColor: theme.colors.onBackground}}
          ref={bottomSheetRef}
          index={0}
          snapPoints={['40%', '100%']}
          onChange={handleSheetChanges}
          enablePanDownToClose>
          <BottomSheetView style={{padding: 16}}>
            <Text variant="headlineLarge">Ratings</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flexGrow: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <PrettyRating rating={averageRating} />
                <Text>{data.data.length} ratings</Text>
              </View>
              <RatingGraph data={chartData} />
            </View>
            <View>
              <Text variant="headlineMedium">Raters</Text>
              {Object.entries(raterAggregate).map(([rater, ratings]) => (
                <View style={{paddingTop: 4}} key={rater}>
                  <Text variant="headlineSmall">{rater}</Text>
                  <Text variant="bodyMedium">
                    Has reviewed this recipe {ratings.length} times, with an
                    average rating of {scoreOfRatings(ratings)}/5.
                  </Text>
                </View>
              ))}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    );
  }
}

export default RecipeRatingsBottomSheet;
