# Sistema de Breadcrumb Dinámico - Documentación

## Resumen

Se ha implementado un sistema de navegación breadcrumb completamente dinámico que soporta rutas anidadas y navegación clickeable, aplicando principios SOLID y mejores prácticas de TypeScript.

## Arquitectura

### Componentes del Sistema

#### 1. **BreadcrumbService** ([breadcrumb.service.ts](src/app/shared/services/breadcrumb.service.ts))

Servicio central que gestiona la lógica de breadcrumbs.

**Principios SOLID aplicados:**
- **SRP**: Responsable únicamente de la gestión de breadcrumbs
- **DIP**: Depende de abstracciones (Router de Angular)
- **OCP**: Extensible sin modificar código existente

**Funcionalidades:**
- Construcción automática de breadcrumbs desde rutas
- Tracking de cambios de navegación
- Gestión de estado con BehaviorSubject
- Navegación programática
- Validación de breadcrumbs clickeables

**Métodos principales:**
```typescript
// Observar cambios en breadcrumbs
breadcrumbs$: Observable<BreadcrumbItem[]>

// Obtener breadcrumbs actuales
getCurrentBreadcrumbs(): BreadcrumbItem[]

// Navegar a un breadcrumb
navigateTo(item: BreadcrumbItem): void

// Verificar si es clickeable
isClickable(item: BreadcrumbItem): boolean
```

#### 2. **PageBreadcrumbComponent** ([page-breadcrumb.component.ts](src/app/shared/components/common/page-breadcrumb/page-breadcrumb.component.ts))

Componente de presentación que muestra los breadcrumbs.

**Características:**
- Actualización automática con cambios de ruta
- Breadcrumbs clickeables (excepto el activo)
- Separadores visuales entre items
- Accesibilidad con aria labels
- Responsive design

**Early Returns aplicados:**
```typescript
onBreadcrumbClick(item: BreadcrumbItem): void {
  if (!this.isClickable(item)) {
    return; // Early return si no es clickeable
  }
  this.breadcrumbService.navigateTo(item);
}
```

#### 3. **Modelos de Datos** ([breadcrumb.model.ts](src/app/shared/models/breadcrumb.model.ts))

Interfaces con tipos estrictos de TypeScript.

```typescript
// Item individual de breadcrumb
interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

// Configuración en rutas
interface BreadcrumbConfig {
  label: string;
  parent?: string;
}
```

## Configuración de Rutas

### Estructura de Rutas Anidadas

```typescript
// app.routes.ts
{
  path: 'employees',
  data: { breadcrumb: 'Gestión de Empleados' }, // Breadcrumb padre
  children: [
    {
      path: '',
      component: EmployeesComponent,
      title: 'Gestión de Empleados | ELOHIM SGE',
    },
    {
      path: 'create',
      component: EmployeesComponent,
      title: 'Crear Empleado | ELOHIM SGE',
      data: { breadcrumb: 'Crear Empleado' }, // Breadcrumb hijo
    },
    {
      path: 'edit/:id',
      component: EmployeesComponent,
      title: 'Editar Empleado | ELOHIM SGE',
      data: { breadcrumb: 'Editar Empleado' }, // Breadcrumb hijo
    },
  ],
}
```

### Resultado Visual

- `/employees` → **Home > Gestión de Empleados**
- `/employees/create` → **Home > Gestión de Empleados > Crear Empleado**
- `/employees/edit/123` → **Home > Gestión de Empleados > Editar Empleado**

## Integración en Componentes

### Uso del Breadcrumb Component

```html
<!-- Simple - Sin props necesarias -->
<app-page-breadcrumb />
```

El componente automáticamente:
1. Se suscribe a cambios de ruta
2. Construye los breadcrumbs desde la ruta actual
3. Actualiza el título de la página
4. Maneja clicks en breadcrumbs

### Navegación desde Componentes

```typescript
// Navegar a sub-ruta
navigateToCreate(): void {
  this.router.navigate(['employees', 'create']);
}

// Navegar con parámetros
navigateToEdit(id: string): void {
  this.router.navigate(['employees', 'edit', id]);
}

// Retornar a lista
navigateToList(): void {
  this.router.navigate(['employees']);
}
```

## Refactorización del Módulo Employees

### Cambios Principales

#### Antes (Modal)
- Formulario en modal
- Un solo componente para todo
- Sin breadcrumbs anidados

#### Después (Rutas)
- Formulario en páginas dedicadas
- Rutas separadas para crear/editar
- Breadcrumbs clickeables multinivel
- Navegación nativa del navegador

### Gestión de Vistas

```typescript
type EmployeeViewMode = 'list' | 'create' | 'edit';

// Determinar vista desde URL
private handleRouteChange(): void {
  const url = this.router.url;
  
  if (this.isCreateRoute(url)) {
    this.setViewMode('create');
    return; // Early return
  }
  
  if (this.isEditRoute(url)) {
    this.handleEditRoute();
    return; // Early return
  }
  
  this.setViewMode('list');
}
```

### Renderizado Condicional

```html
<!-- Vista de Lista -->
@if (isListView()) {
  <app-employee-table ... />
}

<!-- Vista de Creación -->
@if (isCreateView()) {
  <app-employee-form ... />
}

<!-- Vista de Edición -->
@if (isEditView() && selectedEmployee) {
  <app-employee-form [employee]="selectedEmployee" [isEditMode]="true" ... />
}
```

## Funciones Pequeñas y Reutilizables

### En BreadcrumbService

```typescript
// Extracción de métodos pequeños
private extractBreadcrumbLabel(route: ActivatedRouteSnapshot): string | null
private buildUrlPath(route: ActivatedRouteSnapshot): string
private concatenateUrl(baseUrl: string, path: string): string
private createBreadcrumbItem(label: string, url: string, isActive: boolean): BreadcrumbItem
private processChildRoutes(route, url, breadcrumbs): BreadcrumbItem[]
private finalizeBreadcrumbs(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem[]
```

### En EmployeesComponent

```typescript
// Navegación
private isCreateRoute(url: string): boolean
private isEditRoute(url: string): boolean
private getEmployeeIdFromRoute(): string | null

// Manejo de datos
private loadEmployeeForEdit(employeeId: string): void
private handleEmployeeLoaded(employee: Employee): void
private handleEmployeeLoadError(error: Error): void

// Vistas
isListView(): boolean
isCreateView(): boolean
isEditView(): boolean
```

## Nombres Descriptivos

### Variables
- `currentViewMode` en lugar de `mode`
- `selectedEmployee` en lugar de `emp`
- `isClickable()` en lugar de `canClick()`
- `breadcrumbsSubject` en lugar de `subject`

### Métodos
- `handleRouteChange()` en lugar de `onChange()`
- `navigateToCreate()` en lugar de `goToCreate()`
- `buildBreadcrumbs()` en lugar de `build()`
- `finalizeBreadcrumbs()` en lugar de `finish()`

### Constantes
- `readonly homeItem` para el item de inicio
- `readonly destroy$` para cleanup de observables

## Manejo de Errores

### Early Returns para Validación

```typescript
// En navegación
private handleEditRoute(): void {
  const employeeId = this.getEmployeeIdFromRoute();
  
  if (!employeeId) {
    this.handleInvalidEmployeeId(); // Early return
    return;
  }
  
  this.loadEmployeeForEdit(employeeId);
}

// En clicks de breadcrumb
onBreadcrumbClick(item: BreadcrumbItem): void {
  if (!this.isClickable(item)) {
    return; // Early return
  }
  
  this.breadcrumbService.navigateTo(item);
}
```

### Manejo de Errores en Observables

```typescript
this.employeeService.getEmployeeById(employeeId)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (employee) => this.handleEmployeeLoaded(employee),
    error: (error) => this.handleEmployeeLoadError(error),
  });
```

## Gestión de Memoria

### Cleanup con OnDestroy

```typescript
private readonly destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// En subscripciones
.pipe(takeUntil(this.destroy$))
```

## Accesibilidad

### Atributos ARIA

```html
<nav aria-label="Breadcrumb">
  <button
    [attr.aria-label]="'Navegar a ' + item.label"
    (click)="onBreadcrumbClick(item)"
  >
    {{ item.label }}
  </button>
  
  <li aria-current="page">
    {{ activeBreadcrumb.label }}
  </li>
</nav>
```

## Optimizaciones

1. **BehaviorSubject** para estado reactivo
2. **Early returns** para reducir complejidad
3. **Funciones puras** sin side effects
4. **Inmutabilidad** en operaciones de array
5. **takeUntil** para prevenir memory leaks
6. **trackBy** en loops (componentes hijos)

## Uso en Otros Módulos

### Para añadir breadcrumbs a cualquier módulo:

1. **Configurar rutas con data:**
```typescript
{
  path: 'mi-modulo',
  data: { breadcrumb: 'Mi Módulo' },
  children: [
    {
      path: 'detalle/:id',
      data: { breadcrumb: 'Detalle' },
      component: DetalleComponent
    }
  ]
}
```

2. **Usar el componente:**
```html
<app-page-breadcrumb />
```

3. **Listo!** El servicio automáticamente construye los breadcrumbs.

## Próximos Pasos Sugeridos

1. **Breadcrumbs Personalizados**
   - Resolver labels desde servicios (ej: nombre de empleado)
   - Templates personalizados por módulo
   - Iconos en breadcrumbs

2. **Persistencia**
   - Guardar historial de navegación
   - Restaurar breadcrumbs en refresh

3. **Analytics**
   - Tracking de navegación
   - Métricas de uso de breadcrumbs

4. **Testing**
   - Unit tests del servicio
   - Integration tests de navegación
   - E2E tests de flujos completos

## Ejemplos de Uso

### Ejemplo 1: Módulo Simple
```typescript
// Un nivel
{ path: 'dashboard', data: { breadcrumb: 'Dashboard' } }
// Resultado: Home > Dashboard
```

### Ejemplo 2: Módulo con Subrutas
```typescript
{
  path: 'products',
  data: { breadcrumb: 'Productos' },
  children: [
    { path: 'new', data: { breadcrumb: 'Nuevo Producto' } }
  ]
}
// Resultado: Home > Productos > Nuevo Producto
```

### Ejemplo 3: Múltiples Niveles
```typescript
{
  path: 'admin',
  data: { breadcrumb: 'Administración' },
  children: [
    {
      path: 'users',
      data: { breadcrumb: 'Usuarios' },
      children: [
        { path: ':id/edit', data: { breadcrumb: 'Editar' } }
      ]
    }
  ]
}
// Resultado: Home > Administración > Usuarios > Editar
```

## Características Clave

✅ **Dinámico** - Se actualiza automáticamente con la ruta  
✅ **Clickeable** - Navegación hacia atrás intuitiva  
✅ **Type-Safe** - TypeScript strict mode  
✅ **SOLID** - Principios aplicados correctamente  
✅ **Reutilizable** - Funciona en cualquier módulo  
✅ **Accesible** - ARIA labels y semántica correcta  
✅ **Performante** - Observables optimizados  
✅ **Mantenible** - Código limpio y documentado  

## Conclusión

El sistema de breadcrumbs implementado proporciona una navegación robusta, mantenible y escalable que mejora significativamente la UX del dashboard.
