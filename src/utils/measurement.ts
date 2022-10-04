import {ParsedIngredientModel} from '../db/models/Ingredient';

export type Measurement =
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'l'
  | 'ml'
  | 'g'
  | 'mg'
  | 'kg';

type MeasurementData = {
  longName: string;
  shortName: string;
  plural: string;
  hasPrefixSpace: boolean;
};

// TODO Adopt this type
type MeasurementDataCategorized = {
  short: {
    singular: string;
    plural: string;
    hasPrefixSpace: boolean;
  };
  long: {
    singular: string;
    plural: string;
    hasPrefixSpace: boolean;
  };
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
  const measureData = measurementMatrix[unit];
  if (!measureData) {
    return `${quantity} ${name}`;
  }
  return `${quantity}${measureData.hasPrefixSpace && ' '}${
    measureData.shortName
  } of ${name}`;
};
