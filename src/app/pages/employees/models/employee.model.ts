/**
 * Employee Model with strict typing
 * Represents an employee entity with all required and optional fields
 */

// Type aliases for better readability and type safety
export type Gender = 'Masculino' | 'Femenino';
export type EmployeePosition = 'Docente' | 'Auxiliar' | 'Secretaria' | 'Director' | 'Subdirector' | 'Psicologo' | 'Promotor' | 'Administrativo' | 'Otro';

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

// View Model for table display
export interface EmployeeTableViewModel {
  id: number;
  fullName: string;
  dni: string;
  phoneNumber: string;
  email: string;
  position: string;
  status: boolean;
  createdAt: string;
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

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}