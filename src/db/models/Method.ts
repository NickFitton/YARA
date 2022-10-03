import {DBRecord} from './shared';

interface RawMethodModel extends Partial<DBRecord> {
  step: string;
}

export type MethodModel = {type: 'raw'} & RawMethodModel;
