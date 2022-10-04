import {DBRecord} from './shared';

export interface RawMethodModel extends Partial<DBRecord> {
  step: string;
}

export type MethodModel = {type: 'raw'} & RawMethodModel;
