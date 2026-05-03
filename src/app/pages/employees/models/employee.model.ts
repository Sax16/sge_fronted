import { Gender } from '../../../shared/models/person.model';
import { EmployeePosition } from '../../../shared/constants/employee-position.constant';

export type { EmployeePosition };



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