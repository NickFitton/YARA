import React, {useEffect} from 'react';
import {View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from 'victory-native';

import {RecipeStackParamList} from '../../RecipeStackParam';
import {chartTheme} from '../../../../../components/charts/theme';
import {useRecipeRatings} from '../../../../../db/hooks/recipeHooks';
import {RatingModel} from '../../../../../db/models/Rating';
import {RecipeModel} from '../../../../../db/models/Recipe';
import {BottomSheetWrapper} from '../../../../../components/BottomSheet/BottomSheet';
import {SuperStackParamList} from '../../../../RootStackParam';

type Props = {
  route: RouteProp<RecipeStackParamList, 'Recipe Ratings'>;
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
  const {max, min} = data.reduce(
    (agg, point) => ({
      min: Math.min(agg.min, point.y),
      max: Math.max(agg.max, point.y),
    }),
    {min: Infinity, max: -Infinity},
  );
  const range = max - min;
  const paddedData = data.map(bar => ({...bar, y0: min - range / 10}));
  return (
    <VictoryChart theme={chartTheme(theme.colors)} height={200} width={200}>
      <VictoryAxis
        style={{
          axis: {stroke: 'transparent'},
        }}
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

function RatingsDisplay({
  ratings,
  onAddRating,
}: {
  ratings: RatingModel[];
  onAddRating: () => void;
}) {
  const raterAggregate = ratings.reduce(
    (agg, next) => ({
      ...agg,
      [next.rater]: [...(agg[next.rater] ?? []), next],
    }),
    {} as Record<string, RatingModel[]>,
  );
  const averageRating = scoreOfRatings(ratings);
  const chartData = Object.entries(
    ratings.reduce((agg, next) => {
      const stars = Math.ceil(next.value / 2);
      return {...agg, [stars]: agg[stars] + 1};
    }, initialRatings),
  ).map(([rating, count]) => ({x: rating, y: count}));

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text variant="headlineLarge">Ratings</Text>
        <IconButton icon="plus" onPress={onAddRating} />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <PrettyRating rating={averageRating} />
          <Text>{ratings.length} ratings</Text>
        </View>
        <RatingGraph data={chartData} />
      </View>
      <View>
        <Text variant="headlineMedium">Raters</Text>
        {Object.entries(raterAggregate).map(([rater, aggRatings]) => (
          <View style={{paddingTop: 4}} key={rater}>
            <Text variant="headlineSmall">{rater}</Text>
            <Text variant="bodyMedium">
              Has reviewed this recipe {aggRatings.length} times, with an
              average rating of {scoreOfRatings(aggRatings)}/5.
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}
function RatingsError(props: {reason: string} | {error: unknown}) {
  const theme = useTheme();
  useEffect(() => {
    console.log(JSON.stringify(props));
  }, [props]);

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <IconButton icon="alert" iconColor={theme.colors.error} size={50} />
      <Text variant="headlineSmall">Something went wrong</Text>
      <Text variant="bodyMedium" style={{textAlign: 'center'}}>
        We will look into why this happened, in the meantime, please close the
        modal and try again later.
      </Text>
    </View>
  );
}

function RatingsLoading() {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium">Loading recipe ratings</Text>
    </View>
  );
}
function NoRatings({onAddRating}: {onAddRating: () => void}) {
  return (
    <View style={{flexDirection: 'column', alignItems: 'center'}}>
      <Text variant="headlineSmall">No ratings</Text>
      <Text variant="bodyMedium" style={{textAlign: 'center'}}>
        You haven&apos;t rated this recipe yet, you can by tapping the button
        below.
      </Text>
      <View>
        <Button mode="contained" onPress={onAddRating}>
          Add rating
        </Button>
      </View>
    </View>
  );
}

function RecipeRatings({id}: Pick<RecipeModel, 'id'>) {
  const data = useRecipeRatings(id);
  const navigation = useNavigation<NavigationProp<SuperStackParamList>>();

  const onAddRating = () => {
    navigation.dispatch(state =>
      CommonActions.reset({
        ...state,
        index: state.routes.length - 2,
        routes: state.routes.slice(0, -1),
      }),
    );
    navigation.navigate('Journeys', {
      screen: 'Make Recipe Journey',
      params: {
        screen: 'Rate',
        params: {id},
      },
    });
  };

  switch (data.status) {
    case 'loading':
      return <RatingsLoading />;
    case 'success':
      if (!data.data) {
        return <RatingsError reason="undefined" />;
      }
      if (data.data.length === 0) {
        return <NoRatings onAddRating={onAddRating} />;
      }
      return <RatingsDisplay ratings={data.data} onAddRating={onAddRating} />;

    case 'error':
      return <RatingsError error={data.error} />;
  }
}

export function RecipeRatingsBottomSheet({route}: Props) {
  return (
    <BottomSheetWrapper index={0} snapPoints={['40%', '90%']}>
      <RecipeRatings id={route.params.id} />
    </BottomSheetWrapper>
  );
}
