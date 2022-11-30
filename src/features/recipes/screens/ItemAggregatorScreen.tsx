import React from 'react';
import {ItemAggregator} from '../../../components/ItemAggregator/ItemAggregator';

const dataset = [
  '500g strong white bread flour',
  '1 tsp salt',
  '1% tsp caster sugar',
  '7g fast action dried yeast\n1 tbsp olive oil, plus extra for\ngreasing',
  '30oml tepid water',
  '5 tbsp tomato puree or sieved\ntomato pasta sauce',
  '1 ball of mozzarella, torn into small',
  'pieces',
  '6 slices of wafer thin ham, torn into',
  'small pieces',
  '5 thin slices of chorizo, chopped\ninto small pieces',
  'Handful of basil leaves, torn',
  'Salt and pepper',
  '2 handfuls of grated cheddar',
];

export function ItemAggregatorScreen() {
  return <ItemAggregator itemType="ingredient" data={dataset} />;
}
