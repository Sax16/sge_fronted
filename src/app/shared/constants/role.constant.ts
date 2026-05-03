import { SelectOption } from '../models/select-option.model';

/**
 * Single source of truth for user roles.
 * Values MUST match the backend enum: app/core/enums.py → UserRole
 */
export const UserRoleType = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
} as const;

/** Union type derived from UserRoleType values: 'Super Admin' | 'Admin' */
export type UserRole = (typeof UserRoleType)[keyof typeof UserRoleType];

/** Role options for select/dropdown components */
export const ROLE_OPTIONS: SelectOption[] = Object.values(UserRoleType).map(
  (role) => ({ value: role, label: role }),
);
