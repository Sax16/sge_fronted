
export type Role = 'SUPER_ADMIN' | 'ADMIN';

/** User model interface */

// Main User interface with strict types
export interface User {
  readonly id: number;
  userName: string;
  isActive: boolean;
  role: Role;
  readonly createdAt: Date;
  employeeId: number;
}

// Data Transfer Object for creating users (without id and createdAt)
export interface CreateUserDto {
  userName: string;
  password: string;
  isActive: boolean;
  employeeId: number;
  role: Role;
}

// Data Transfer Object for updating users (all fields optional except id)
export interface UpdateUserDto {
  userName?: string;
  password?: string;
  isActive?: boolean;
  employeeId?: number;
  role?: Role;
}

// View Model for table display
export interface UserTableViewModel {
  userName: string;
  employeeName: string;
  status: boolean;
  createdAt: string;
  role: Role;
}

// Form Model for user forms
export interface UserFormModel {
  userName: string;
  password: string;
  isActive: boolean;
  employeeId: string | number;
  role: Role;
}

