import { UserRole } from '../../../shared/constants/role.constant';

export type { UserRole };

export interface User {
  readonly id: number;
  username: string;
  isActive: boolean;
  role: UserRole;
  readonly createdAt: Date;
  employeeId: number;
}

// Data Transfer Object for creating users (without id and createdAt)
export interface CreateUserDto {
  username: string;
  password: string;
  isActive: boolean;
  employeeId: number;
  role: UserRole;
}

// Data Transfer Object for updating users (all fields optional except id)
export interface UpdateUserDto {
  username?: string;
  password?: string;
  isActive?: boolean;
  role?: UserRole;
}

// View Model for table display
export interface UserTableViewModel {
  username: string;
  employeeName: string;
  status: boolean;
  createdAt: string;
  role: UserRole;
}

// Form Model for user forms
export interface UserFormModel {
  username: string;
  password: string;
  isActive: boolean;
  employeeId: string | number;
  role: UserRole;
}

