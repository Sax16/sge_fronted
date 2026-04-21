export enum LevelAcademicType {
  REGULAR = 'Regular',
  EXTRAORDINARIO = 'Extraordinario',
}

export interface Level {
  id: number;
  name: string;
  modularCode?: string | null;
  tag: string;
  type: LevelAcademicType;
}

export interface LevelCreate extends Omit<Level, 'id'> {}

export interface LevelUpdate extends Partial<LevelCreate> {}
