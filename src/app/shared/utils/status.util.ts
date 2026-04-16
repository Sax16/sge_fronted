/**
 * Status Utilities
 * Generic helpers for displaying active/inactive status across the application.
 */

/**
 * Returns the badge color variant based on active status.
 */
export function getBadgeColor(isActive: boolean): 'success' | 'light' {
  return isActive ? 'success' : 'light';
}

/**
 * Returns the status label in Spanish.
 */
export function getStatusLabel(isActive: boolean): 'Activo' | 'Inactivo' {
  return isActive ? 'Activo' : 'Inactivo';
}

/**
 * Formats a date to locale string (DD/MM/YYYY) in Peruvian format.
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
