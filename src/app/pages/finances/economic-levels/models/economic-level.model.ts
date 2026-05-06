export interface EconomicLevel {
  id: number;
  name: string;
  description: string | null;
}

export interface EconomicLevelCreate {
  name: string;
  description?: string | null;
}

export interface EconomicLevelUpdate {
  name?: string | null;
  description?: string | null;
}
