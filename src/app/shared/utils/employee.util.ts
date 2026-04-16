import { Employee } from '../../pages/employees/models/employee.model';

/**
 * Returns the full name of an employee.
 * Shared utility to avoid duplication across components.
 */
export function getFullName(employee: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${employee.firstName} ${employee.lastName}`;
}
