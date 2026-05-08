import { SelectOption } from '../models/select-option.model';

/**
 * Single source of truth for student statuses.
 * Values MUST match the backend enum: app/core/enums.py → StudentStatus
 */
export const StudentStatusType = {
  MATRICULADO: 'Matriculado',
  PENDIENTE: 'Pendiente',
  INACTIVO: 'Inactivo',
  RETIRADO: 'Retirado',
  EGRESADO: 'Egresado',
} as const;

/** Union type derived from StudentStatusType values */
export type StudentStatus = (typeof StudentStatusType)[keyof typeof StudentStatusType];

/** Status options for select/dropdown components */
export const STUDENT_STATUS_OPTIONS: SelectOption[] = Object.values(StudentStatusType).map(
  (status) => ({ value: status, label: status }),
);
