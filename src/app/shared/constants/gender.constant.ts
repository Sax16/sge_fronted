import { SelectOption } from '../models/select-option.model';

/**
 * Single source of truth for gender.
 * Values MUST match the backend enum: app/core/enums.py → Gender
 */
export const GenderType = {
  MASCULINO: 'Masculino',
  FEMENINO: 'Femenino',
} as const;

/** Union type derived from GenderType values */
export type Gender = (typeof GenderType)[keyof typeof GenderType];

/** Gender options for select/dropdown components */
export const GENDER_OPTIONS: SelectOption[] = Object.values(GenderType).map(
  (value) => ({ value, label: value }),
);
