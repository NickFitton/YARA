import {Measurement, ParsedIngredientModel} from '../db/models/Ingredient';

type MeasurementData = {
  longName: string;
  shortName: string;
  plural: string;
  hasPrefixSpace: boolean;
};

const measurementMatrix: Record<Measurement, MeasurementData> = {
  tsp: {
    longName: 'teaspoon',
    shortName: 'tsp',
    plural: 'teaspoons',
    hasPrefixSpace: false,
  },
  tbsp: {
    longName: 'tablespoon',
    shortName: 'tbsp',
    plural: 'tablespoons',
    hasPrefixSpace: false,
  },
  cup: {
    longName: 'cup',
    shortName: 'cup',
    plural: 'cups',
    hasPrefixSpace: true,
  },
  l: {
    longName: 'litre',
    shortName: 'l',
    plural: 'litres',
    hasPrefixSpace: false,
  },
  ml: {
    longName: 'millilitre',
    shortName: 'ml',
    plural: 'millilitres',
    hasPrefixSpace: false,
  },
  g: {
    longName: 'gram',
    shortName: 'g',
    plural: 'grams',
    hasPrefixSpace: false,
  },
  mg: {
    longName: 'milligram',
    shortName: 'mg',
    plural: 'milligrams',
    hasPrefixSpace: false,
  },
  kg: {
    longName: 'kilo',
    shortName: 'kg',
    plural: 'kilos',
    hasPrefixSpace: false,
  },
};

export const toString = ({
  unit,
  quantity,
  name,
}: ParsedIngredientModel): string => {
  if (!unit) {
    return `${quantity} ${name}`;
  }
  const measureData = measurementMatrix[unit];
  if (!measureData) {
    return `${quantity} ${name}`;
  }
  return `${quantity}${measureData.hasPrefixSpace ? ' ' : ''}${
    measureData.shortName
  } of ${name}`;
};
