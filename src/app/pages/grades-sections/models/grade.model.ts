export interface Grade {
  id: number;
  name: string;
  tag: string;
  levelId: number;
}

export interface GradeCreate extends Omit<Grade, 'id'> {}

export interface GradeUpdate extends Partial<GradeCreate> {}
