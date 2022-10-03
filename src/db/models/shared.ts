export interface DBRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ModelForm<T extends DBRecord> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>;
