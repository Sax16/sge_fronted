export enum LevelAcademicType {
  REGULAR = 'Regular',
  EXTRAORDINARIA = 'Extraordinaria',
}

export interface Level {
  id: number;
  name: string;
  modularCode?: string | null;
  tag: string;
  type: LevelAcademicType;
}

export interface LevelCreate {
  name: string;
  modularCode?: string | null;
  tag: string;
  type: LevelAcademicType;
}

export interface LevelUpdate {
  name?: string;
  modularCode?: string | null;
  tag?: string;
}
