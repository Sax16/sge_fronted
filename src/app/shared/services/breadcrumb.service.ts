import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BreadcrumbItem } from '../models/breadcrumb.model';

/**
 * Breadcrumb Service
 * Implements Single Responsibility Principle (SRP) - Manages breadcrumb navigation only
 * Implements Dependency Inversion Principle (DIP) - Depends on Router abstraction
 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public readonly breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.initializeBreadcrumbTracking();
  }

  /**
   * Initialize breadcrumb tracking on route changes
   */
  private initializeBreadcrumbTracking(): void {
    // Update breadcrumbs immediately for the current route (handles page refresh)
    this.updateBreadcrumbs();
    
    // Subscribe to navigation events for future route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  /**
   * Update breadcrumbs based on current route
   */
  private updateBreadcrumbs(): void {
    const root = this.router.routerState.snapshot.root;
    const breadcrumbs = this.buildBreadcrumbs(root);
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * Extract breadcrumb label from route data
   * @param route - Activated route snapshot
   * @returns Breadcrumb label or null
   */
  private extractBreadcrumbLabel(route: ActivatedRouteSnapshot): string | null {
    return route.data?.['breadcrumb'] || null;
  }

  /**
   * Check if should skip empty child route to prevent duplication
   * @param route - Activated route snapshot
   * @param breadcrumbs - Current breadcrumbs
   * @param label - Current route label
   * @returns true if should skip, false otherwise
   */
  private shouldSkipEmptyChildRoute(
    route: ActivatedRouteSnapshot,
    breadcrumbs: BreadcrumbItem[],
    label: string
  ): boolean {
    // Early return if no breadcrumbs yet
    if (breadcrumbs.length === 0) {
      return false;
    }

    // Check if this route has empty path
    const hasEmptyPath = route.url.length === 0;
    
    // Check if last breadcrumb has same label
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const hasDuplicateLabel = lastBreadcrumb?.label === label;

    // Skip if empty path and duplicate label (child inheriting parent's breadcrumb)
    return hasEmptyPath && hasDuplicateLabel;
  }

  /**
   * Build URL path from route segments
   * @param route - Activated route snapshot
   * @returns URL path
   */
  private buildUrlPath(route: ActivatedRouteSnapshot): string {
    return route.url.map((segment) => segment.path).join('/');
  }

  /**
   * Concatenate URLs safely
   * @param baseUrl - Base URL
   * @param path - Path to append
   * @returns Concatenated URL
   */
  private concatenateUrl(baseUrl: string, path: string): string {
    if (!path) {
      return baseUrl;
    }

    return baseUrl ? `${baseUrl}/${path}` : path;
  }

  /**
   * Create breadcrumb item
   * @param label - Breadcrumb label
   * @param url - Breadcrumb URL
   * @param isActive - Whether item is active
   * @returns Breadcrumb item
   */
  private createBreadcrumbItem(
    label: string,
    url: string,
    isActive: boolean
  ): BreadcrumbItem {
    return { label, url, isActive };
  }

  /**
   * Process child routes recursively
   * @param route - Activated route snapshot
   * @param url - Current URL
   * @param breadcrumbs - Current breadcrumbs
   * @returns Array of breadcrumb items
   */
  private processChildRoutes(
    route: ActivatedRouteSnapshot,
    url: string,
    breadcrumbs: BreadcrumbItem[]
  ): BreadcrumbItem[] {
    const children = route.children;

    // Early return if no children
    if (!children || children.length === 0) {
      return this.finalizeBreadcrumbs(breadcrumbs);
    }

    // Process first child (primary outlet)
    const primaryChild = children[0];
    return this.buildBreadcrumbs(primaryChild, url, breadcrumbs);
  }

  /**
   * Build breadcrumb trail from route snapshot
   * @param route - Activated route snapshot
   * @param url - Accumulated URL
   * @param breadcrumbs - Accumulated breadcrumbs
   * @returns Array of breadcrumb items
   */
  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    // Early return if no route
    if (!route) {
      return this.finalizeBreadcrumbs(breadcrumbs);
    }

    // Get breadcrumb label from route data
    const label = this.extractBreadcrumbLabel(route);
    
    // Build URL path
    const path = this.buildUrlPath(route);
    const nextUrl = this.concatenateUrl(url, path);

    // Early return if no label found in this route
    if (!label) {
      return this.processChildRoutes(route, nextUrl, breadcrumbs);
    }

    // Check if this is an empty child route without its own breadcrumb
    // This prevents duplication when parent has breadcrumb and child path is ''
    if (this.shouldSkipEmptyChildRoute(route, breadcrumbs, label)) {
      return this.processChildRoutes(route, nextUrl, breadcrumbs);
    }

    // Create breadcrumb item
    const breadcrumb = this.createBreadcrumbItem(label, nextUrl, false);
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];

    // Process child routes
    return this.processChildRoutes(route, nextUrl, newBreadcrumbs);
  }

  /**
   * Get home breadcrumb item from root route configuration
   * @returns Home breadcrumb item or default
   */
  private getHomeItem(): BreadcrumbItem {
    const root = this.router.config.find(route => route.path === '');
    const homeLabel = root?.data?.['breadcrumb'] || 'Home';
    
    return {
      label: homeLabel,
      url: '/',
      isActive: false,
    };
  }

  /**
   * Check if breadcrumbs already contain home item
   * @param breadcrumbs - Breadcrumb items to check
   * @returns true if home exists, false otherwise
   */
  private hasHomeItem(breadcrumbs: BreadcrumbItem[]): boolean {
    if (breadcrumbs.length === 0) {
      return false;
    }
    
    const firstItem = breadcrumbs[0];
    // Considera home si la URL es '/' o está vacía
    return firstItem.url === '/' || firstItem.url === '';
  }

  /**
   * Finalize breadcrumbs by adding home and marking last as active
   * 
   * **Lógica de isActive:**
   * - Solo el ÚLTIMO breadcrumb de la lista se marca como isActive = true
   * - Todos los demás breadcrumbs tienen isActive = false
   * - Esto permite que todos sean clickeables EXCEPTO el último (ruta actual)
   * - El breadcrumb activo representa "dónde estás ahora" y no necesita ser clickeable
   * 
   * @param breadcrumbs - Breadcrumb items
   * @returns Finalized breadcrumb items with home prepended and last marked as active
   */
  private finalizeBreadcrumbs(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem[] {
    const homeItem = this.getHomeItem();
    
    // Early return if no breadcrumbs - solo home está activo
    if (breadcrumbs.length === 0) {
      return [{ ...homeItem, isActive: true }];
    }

    // Si ya existe un home item en los breadcrumbs, solo marcamos el último como activo
    // Esto evita duplicar "Inicio" cuando la ruta raíz tiene data: { breadcrumb: 'Inicio' }
    const hasSomeHomeAlready = this.hasHomeItem(breadcrumbs);
    
    // Mark last breadcrumb as active (representa la ruta actual)
    // Todos los demás permanecen con isActive = false (clickeables)
    const lastIndex = breadcrumbs.length - 1;
    const updatedBreadcrumbs = breadcrumbs.map((item, index) => {
      // Normalizar URL del primer item si es home
      const normalizedUrl = (index === 0 && hasSomeHomeAlready) ? '/' : item.url;
      
      return {
        ...item,
        url: normalizedUrl,
        isActive: index === lastIndex, // Solo el último es true
      };
    });

    // Solo agregar home al principio si NO existe ya
    if (hasSomeHomeAlready) {
      return updatedBreadcrumbs;
    }

    // Add home at the beginning (siempre clickeable cuando hay más rutas)
    return [homeItem, ...updatedBreadcrumbs];
  }

  /**
   * Get current breadcrumbs synchronously
   * @returns Current breadcrumb items
   */
  getCurrentBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbsSubject.value;
  }

  /**
   * Navigate to breadcrumb URL
   * @param item - Breadcrumb item to navigate to
   */
  navigateTo(item: BreadcrumbItem): void {
    if (item.isActive) {
      return; // Early return if already active
    }

    this.router.navigate([item.url]);
  }

  /**
   * Check if breadcrumb is clickable
   * @param item - Breadcrumb item
   * @returns true if clickable, false otherwise
   */
  isClickable(item: BreadcrumbItem): boolean {
    return !item.isActive;
  }

  /**
   * Get breadcrumb count
   * @returns Number of breadcrumbs
   */
  getBreadcrumbCount(): number {
    return this.breadcrumbsSubject.value.length;
  }

  /**
   * Check if should show breadcrumbs
   * @returns true if should show, false otherwise
   */
  shouldShowBreadcrumbs(): boolean {
    return this.getBreadcrumbCount() > 1;
  }
}
