/**
 * Breadcrumb Models and Types
 * Strict TypeScript types for breadcrumb navigation
 */

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

/**
 * Breadcrumb configuration for routes
 */
export interface BreadcrumbConfig {
  label: string;
  parent?: string;
}

/**
 * Route data interface extended with breadcrumb
 */
export interface RouteDataWithBreadcrumb {
  breadcrumb?: string;
  breadcrumbConfig?: BreadcrumbConfig;
}
