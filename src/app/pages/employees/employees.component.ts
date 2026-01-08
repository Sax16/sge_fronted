import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeService } from './services/employee.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from './models/employee.model';

/**
 * Employee View Mode
 * Determines what to display in the component
 */
type EmployeeViewMode = 'list' | 'create' | 'edit' | 'view';

/**
 * Employees Component
 * Main container for employee management with routing
 * Implements Single Responsibility Principle (SRP) - Orchestrates employee management UI
 */
@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    RouterModule,
    PageBreadcrumbComponent,
    EmployeeTableComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent
  ],
  templateUrl: './employees.component.html',
  styles: ``
})
export class EmployeesComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  currentViewMode: EmployeeViewMode = 'list';
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribe to route changes to determine view mode
   */
  private subscribeToRouteChanges(): void {
    this.route.url
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handleRouteChange());
  }

  /**
   * Handle route change and update view mode
   */
  private handleRouteChange(): void {
    const url = this.router.url;
    
    if (this.isCreateRoute(url)) {
      this.setViewMode('create');
      return;
    }
    
    if (this.isEditRoute(url)) {
      this.handleEditRoute();
      this.setViewMode('edit');
      return;
    }

    if (this.isViewRoute(url)) {
      this.handleViewRoute();
      this.setViewMode('view');
      return;
    }
    
    this.setViewMode('list');
  }

  /**
   * Check if current route is create route
   * @param url - Current URL
   * @returns true if create route, false otherwise
   */
  private isCreateRoute(url: string): boolean {
    return url.includes('/employees/create');
  }

  /**
   * Check if current route is edit route
   * @param url - Current URL
   * @returns true if edit route, false otherwise
   */
  private isEditRoute(url: string): boolean {
    return url.includes('/employees/edit/');
  }

  /**
   * Check if current route is view route
   * @param url - Current URL
   * @returns true if view route, false otherwise
   */
  private isViewRoute(url: string): boolean {
    return url.includes('/employees/view/');
  }

  /**
   * Handle edit route by loading employee data
   */
  private handleEditRoute(): void {
    const employeeId = this.getEmployeeIdFromRoute();
    
    // Early return if no ID found
    if (!employeeId) {
      this.handleInvalidEmployeeId();
      return;
    }

    this.loadEmployeeForEdit(employeeId);
  }

  /**
   * Handle view route by loading employee data
   */
  private handleViewRoute(): void {
    const employeeId = this.getEmployeeIdFromRoute();
    
    // Early return if no ID found
    if (!employeeId) {
      this.handleInvalidEmployeeId();
      return;
    }

    this.loadEmployeeForView(employeeId);
  }

  /**
   * Get employee ID from route parameters
   * @returns Employee ID or null
   */
  private getEmployeeIdFromRoute(): number | null {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return null;
    
    const id = Number(idParam);
    return isNaN(id) ? null : id;
  }

  /**
   * Handle invalid employee ID
   */
  private handleInvalidEmployeeId(): void {
    this.errorMessage = 'ID de empleado inválido';
    this.navigateToList();
  }

  /**
   * Load employee for editing
   * @param employeeId - Employee ID to load
   */
  private loadEmployeeForEdit(employeeId: number): void {
    this.isLoading = true;

    this.employeeService
      .getEmployeeById(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee) => this.handleEmployeeLoaded(employee),
        error: (error) => this.handleEmployeeLoadError(error),
      });
  }

  /**
   * Handle employee loaded for editing
   * @param employee - Loaded employee
   */
  private handleEmployeeLoaded(employee: Employee): void {
    this.selectedEmployee = employee;
    this.isLoading = false;
  }
  
  /**
   * Load employee for viewing
   * @param employeeId - Employee ID to load
  */
 private loadEmployeeForView(employeeId: number): void {
   this.isLoading = true;
   
   this.employeeService
   .getEmployeeById(employeeId)
   .pipe(takeUntil(this.destroy$))
   .subscribe({
     next: (employee) => this.handleEmployeeLoadedForView(employee),
     error: (error) => this.handleEmployeeLoadError(error),
    });
  }
  
  /**
   * Handle employee loaded for viewing
   * @param employee - Loaded employee
  */
 private handleEmployeeLoadedForView(employee: Employee): void {
   this.selectedEmployee = employee;
   this.isLoading = false;
  }
  
  /**
   * Handle error loading employee
   * @param error - Error object
   */
  private handleEmployeeLoadError(error: Error): void {
    this.errorMessage = 'Error al cargar empleado. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error loading employee:', error);
    this.navigateToList();
  }
  
  /**
   * Set current view mode
   * @param mode - View mode to set
  */
  private setViewMode(mode: EmployeeViewMode): void {
    this.currentViewMode = mode;
    this.clearErrorMessage();
  }

  /**
   * Clear error message
   */
  private clearErrorMessage(): void {
    this.errorMessage = null;
  }

  /**
   * Load all employees from service
   */
  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.employeeService
      .getAllEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => this.handleEmployeesLoaded(employees),
        error: (error) => this.handleLoadError(error),
      });
  }

  /**
   * Handle successful employees load
   * @param employees - Loaded employees
   */
  private handleEmployeesLoaded(employees: Employee[]): void {
    this.employees = employees;
    console.log('Employees loaded:', employees);
    this.isLoading = false;
  }

  /**
   * Handle error during employees load
   * @param error - Error object
   */
  private handleLoadError(error: Error): void {
    this.errorMessage = 'Error al cargar empleados. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error loading employees:', error);
  }

  /**
   * Navigate to create employee page
   */
  navigateToCreate(): void {
    this.router.navigate(['employees', 'create']);
  }

  /**
   * Navigate to edit employee page
   * @param employeeId - ID of employee to edit
   */
  navigateToEdit(employeeId: number): void {
    this.router.navigate(['employees', 'edit', employeeId]);
  }

  /**
   * Navigate to view employee page
   * @param employeeId - ID of employee to view
   */
  navigateToView(employeeId: number): void {
    this.router.navigate(['employees', 'view', employeeId]);
  }

  /**
   * Navigate to employee list
   */
  navigateToList(): void {
    this.router.navigate(['employees']);
  }

  /**
   * Handle new employee button click
   */
  handleNewEmployeeClick(): void {
    this.navigateToCreate();
  }

  /**
   * Handle edit employee button click
   * @param employeeId - ID of employee to edit
   */
  handleEditEmployeeClick(employeeId: number): void {
    this.navigateToEdit(employeeId);
  }

  /**
   * Handle view employee button click
   * @param employeeId - ID of employee to view
   */
  handleViewEmployeeClick(employeeId: number): void {
    this.navigateToView(employeeId);
  }

  /**
   * Handle employee form submission (create)
   * @param employeeData - Employee data from form
   */
  handleEmployeeCreate(employeeData: CreateEmployeeDto): void {
    this.createEmployee(employeeData);
  }

  /**
   * Handle employee form submission (update)
   * @param employeeData - Employee data from form
   */
  handleEmployeeUpdate(employeeData: UpdateEmployeeDto): void {
    // Early return if no selected employee
    if (!this.selectedEmployee) {
      this.errorMessage = 'No hay empleado seleccionado para actualizar';
      return;
    }

    this.updateEmployee(this.selectedEmployee.id, employeeData);
  }

  /**
   * Create new employee
   * @param employeeData - Employee data to create
   */
  private createEmployee(employeeData: CreateEmployeeDto): void {
    this.isLoading = true;

    this.employeeService
      .createEmployee(employeeData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee) => this.handleEmployeeCreated(employee),
        error: (error) => this.handleCreateError(error),
      });
  }

  /**
   * Update existing employee
   * @param employeeId - Employee ID
   * @param employeeData - Employee data to update
   */
  private updateEmployee(employeeId: number, employeeData: UpdateEmployeeDto): void {
    this.isLoading = true;

    this.employeeService
      .updateEmployee(employeeId, employeeData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee) => this.handleEmployeeUpdated(employee),
        error: (error) => this.handleUpdateError(error),
      });
  }

  /**
   * Handle successful employee creation
   * @param employee - Created employee
   */
  private handleEmployeeCreated(employee: Employee): void {
    this.employees = [...this.employees, employee];
    this.isLoading = false;
    this.navigateToList();
  }

  /**
   * Handle successful employee update
   * @param employee - Updated employee
   */
  private handleEmployeeUpdated(employee: Employee): void {
    const index = this.employees.findIndex((emp) => emp.id === employee.id);
    
    if (index !== -1) {
      this.employees = [
        ...this.employees.slice(0, index),
        employee,
        ...this.employees.slice(index + 1),
      ];
    }
    
    this.isLoading = false;
    this.navigateToList();
  }

  /**
   * Handle error during employee creation
   * @param error - Error object
   */
  private handleCreateError(error: Error): void {
    this.errorMessage = 'Error al crear empleado. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error creating employee:', error);
  }

  /**
   * Handle error during employee update
   * @param error - Error object
   */
  private handleUpdateError(error: Error): void {
    this.errorMessage = 'Error al actualizar empleado. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error updating employee:', error);
  }

  /**
   * Handle employee deletion request
   * @param employeeId - ID of employee to delete
   */
  handleEmployeeDelete(employeeId: number): void {
    if (!this.confirmDelete()) {
      return;
    }

    this.deleteEmployee(employeeId);
  }

  /**
   * Confirm employee deletion
   * @returns true if confirmed, false otherwise
   */
  private confirmDelete(): boolean {
    return confirm('¿Está seguro de que desea eliminar este empleado?');
  }

  /**
   * Delete employee
   * @param employeeId - ID of employee to delete
   */
  private deleteEmployee(employeeId: number): void {
    this.isLoading = true;

    this.employeeService
      .deleteEmployee(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleEmployeeDeleted(employeeId),
        error: (error) => this.handleDeleteError(error),
      });
  }

  /**
   * Handle successful employee deletion
   * @param employeeId - ID of deleted employee
   */
  private handleEmployeeDeleted(employeeId: number): void {
    this.employees = this.employees.filter((emp) => emp.id !== employeeId);
    this.isLoading = false;
  }

  /**
   * Handle error during employee deletion
   * @param error - Error object
   */
  private handleDeleteError(error: Error): void {
    this.errorMessage = 'Error al eliminar empleado. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error deleting employee:', error);
  }

  /**
   * Handle form cancellation
   */
  handleFormCancel(): void {
    this.navigateToList();
  }

  /**
   * Check if should show list view
   * @returns true if list view, false otherwise
   */
  isListView(): boolean {
    return this.currentViewMode === 'list';
  }

  /**
   * Check if should show create view
   * @returns true if create view, false otherwise
   */
  isCreateView(): boolean {
    return this.currentViewMode === 'create';
  }

  /**
   * Check if should show edit view
   * @returns true if edit view, false otherwise
   */
  isEditView(): boolean {
    return this.currentViewMode === 'edit';
  }

  /**
   * Check if should show view view
   * @returns true if view view, false otherwise
   */
  isViewView(): boolean {
    return this.currentViewMode === 'view';
  }
}
