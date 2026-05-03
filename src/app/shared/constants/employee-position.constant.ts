import { SelectOption } from '../models/select-option.model';

/**
 * Single source of truth for employee positions.
 * Values MUST match the backend enum: app/core/enums.py → EmployeePosition
 */
export const EmployeePositionType = {
  DOCENTE: 'Docente',
  AUXILIAR: 'Auxiliar',
  SECRETARIA: 'Secretaria',
  DIRECTOR: 'Director',
  SUBDIRECTOR: 'Subdirector',
  PSICOLOGO: 'Psicologo',
  PROMOTOR: 'Promotor',
  ADMINISTRATIVO: 'Administrativo',
  OTRO: 'Otro',
} as const;

/** Union type derived from EmployeePositionType values */
export type EmployeePosition =
  (typeof EmployeePositionType)[keyof typeof EmployeePositionType];

/** Position options for select/dropdown components */
export const POSITION_OPTIONS: SelectOption[] = Object.values(
  EmployeePositionType,
).map((value) => ({ value, label: value }));
