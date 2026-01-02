/**
 * Employee Model with strict typing
 * Represents an employee entity with all required and optional fields
 */

// Type aliases for better readability and type safety
export type Gender = 'MALE' | 'FEMALE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';
export type EmployeePosition = 'ADMIN' | 'CASHIER' | 'WAREHOUSE' | 'SELLER';

// Main Employee interface with strict types
export interface Employee {
  readonly id: string;
  firstName: string;
  lastName: string;
  dni: string;
  ruc?: string;
  gender: Gender;
  birthDate: Date | null;
  address: string;
  phoneNumber: string;
  email: string;
  isActive: EmployeeStatus;
  position: EmployeePosition;
  readonly createdAt: Date;
}

// Data Transfer Object for creating employees (without id and createdAt)
export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  dni: string;
  ruc?: string;
  gender: Gender;
  birthDate: Date | null;
  address: string;
  phoneNumber: string;
  email: string;
  isActive: EmployeeStatus;
  position: EmployeePosition;
}

// Data Transfer Object for viewing employees (all fields readonly)
export interface ViewEmployeeDto {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly dni: string;
  readonly ruc?: string;
  readonly gender: Gender;
  readonly birthDate: Date | null;
  readonly address: string;
  readonly phoneNumber: string;
  readonly email: string;
  readonly isActive: EmployeeStatus;
  readonly position: EmployeePosition;
  readonly createdAt: Date;
}

// Data Transfer Object for updating employees (all fields optional except id)
export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  dni?: string;
  ruc?: string;
  gender?: Gender;
  birthDate?: Date | null;
  address?: string;
  phoneNumber?: string;
  email?: string;
  isActive?: EmployeeStatus;
  position?: EmployeePosition;
}

// View Model for table display
export interface EmployeeTableViewModel {
  id: string;
  fullName: string;
  dni: string;
  phoneNumber: string;
  email: string;
  position: string;
  status: EmployeeStatus;
  createdAt: string;
}

// Form data interface
export interface EmployeeFormData {
  name: string;
  lastName: string;
  dni: string;
  ruc: string;
  gender: Gender | '';
  birthDate: string;
  phoneNumber: string;
  email: string;
  address: string;
  position: EmployeePosition | '';
  isActive: EmployeeStatus | '';
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