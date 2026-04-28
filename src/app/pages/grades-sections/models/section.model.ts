export interface Section {
  id: string; // e.g., '1A', '2B'
  name: string;
  tag: string;
  gradeId: number;
}

/** Backend generates the id — only name, tag, gradeId are sent on creation */
export interface SectionCreate extends Omit<Section, 'id'> {}

/** Only name and tag can be updated — id and gradeId are immutable */
export interface SectionUpdate extends Partial<Omit<Section, 'id' | 'gradeId'>> {}
