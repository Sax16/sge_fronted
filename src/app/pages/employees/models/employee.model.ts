import { Gender } from '../../../shared/models/person.model';

// Type aliases for better readability and type safety
export type EmployeePosition = 'Docente' | 'Auxiliar' | 'Secretaria' | 'Director' | 'Subdirector' | 'Psicologo' | 'Promotor' | 'Administrativo' | 'Otro';
/**
 * All valid employee positions as a runtime constant.
 * Derive positionOptions from this to ensure TypeScript exhaustiveness.
 */
export const EMPLOYEE_POSITIONS: {value:EmployeePosition, label:EmployeePosition}[] = [
  { value: 'Docente', label: 'Docente' },
  { value: 'Auxiliar', label: 'Auxiliar' },
  { value: 'Secretaria', label: 'Secretaria' },
  { value: 'Director', label: 'Director' },
  { value: 'Subdirector', label: 'Subdirector' },
  { value: 'Psicologo', label: 'Psicologo' },
  { value: 'Promotor', label: 'Promotor' },
  { value: 'Administrativo', label: 'Administrativo' },
  { value: 'Otro', label: 'Otro' },
];

// Main Employee interface with strict types
export interface Employee {
  readonly id: number;
  firstName: string;
  lastName: string;
  dni: string;
  ruc?: string | null;
  gender: Gender;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  isActive: boolean;
  position: EmployeePosition;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Data Transfer Object for creating employees (without id and createdAt)
export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  dni: string;
  ruc?: string | null;
  gender: Gender;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  isActive: boolean;
  position: EmployeePosition;
}

// Data Transfer Object for updating employees (all fields optional except id)
export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  dni: string;
  ruc?: string | null;
  gender: Gender;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  isActive: boolean;
  position: EmployeePosition;
}

// Form data interface
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  dni: string;
  ruc?: string | null;
  gender: Gender;
  birthDate?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  position: EmployeePosition;
  isActive: boolean;
}

// TODO: Delete this interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}