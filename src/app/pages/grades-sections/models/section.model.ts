export interface Section {
  id: string; // e.g., '1A', '2B'
  name: string;
  tag: string;
  gradeId: number;
  updatedAt: string;
}

export interface SectionCreate extends Omit<Section, 'updatedAt'> {}

export interface SectionUpdate extends Partial<SectionCreate> {}
