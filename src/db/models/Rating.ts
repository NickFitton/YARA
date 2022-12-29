import {DBRecord} from './shared';

export interface RatingModel extends DBRecord {
  recipeId: string;
  rater: string;
  value: number;
  scaleFrom: number;
  scaleTo: number;
}
