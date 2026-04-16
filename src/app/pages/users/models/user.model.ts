
export type Role = 'SUPER_ADMIN' | 'ADMIN';

export const ROLES: {value: Role, label: string}[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
];

/** User model interface */

// Main User interface with strict types
export interface User {
  readonly id: number;
  username: string;
  isActive: boolean;
  role: Role;
  readonly createdAt: Date;
  employeeId: number;
}

// Data Transfer Object for creating users (without id and createdAt)
export interface CreateUserDto {
  username: string;
  password: string;
  isActive: boolean;
  employeeId: number;
  role: Role;
}

// Data Transfer Object for updating users (all fields optional except id)
export interface UpdateUserDto {
  username?: string;
  password?: string;
  isActive?: boolean;
  employeeId?: number;
  role?: Role;
}

// View Model for table display
export interface UserTableViewModel {
  username: string;
  employeeName: string;
  status: boolean;
  createdAt: string;
  role: Role;
}

// Form Model for user forms
export interface UserFormModel {
  username: string;
  password: string;
  isActive: boolean;
  employeeId: string | number;
  role: Role;
}

