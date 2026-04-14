import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { ConfirmModalComponent } from '../../shared/components/ui/confirm-modal/confirm-modal.component';
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
    EmployeeDetailComponent,
    AlertComponent,
    ConfirmModalComponent,
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
  
  // Alert state
  errorMessage: string | null = null;
  errorTitle: string = 'Error';
  
  // Confirm Modal state
  isConfirmModalOpen = false;
  employeeIdToDelete: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
    // Listen to data changes for view mode
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const mode = (data['mode'] as EmployeeViewMode) || 'list';
        this.handleModeChange(mode);
      });

    // Listen to param changes for ID updates (e.g. navigating from edit/1 to edit/2)
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (this.currentViewMode === 'edit' || this.currentViewMode === 'view') {
          const idStr = params.get('id');
          if (!idStr) {
            this.handleInvalidEmployeeId();
            return;
          }
          
          const id = Number(idStr);
          if (isNaN(id)) {
            this.handleInvalidEmployeeId();
            return;
          }
          
          if (!this.selectedEmployee || this.selectedEmployee.id !== id) {
            this.loadEmployee(id);
          }
        }
      });
  }

  /**
   * Handle mode change logic
   */
  private handleModeChange(mode: EmployeeViewMode): void {
    this.currentViewMode = mode;
    this.clearErrorMessage();

    if (mode === 'edit' || mode === 'view') {
      // Data loading and validation is handled by route.paramMap subscription
    } else if (mode === 'create') {
      this.selectedEmployee = null; // Clear selection for create
    } else {
      // List mode
      this.selectedEmployee = null;
      if (this.employees.length === 0) {
        this.loadEmployees();
      }
    }
  }



  /**
   * Handle invalid employee ID
   */
  private handleInvalidEmployeeId(): void {
    this.errorMessage = 'ID de empleado inválido';
    this.navigateToList();
  }

  /**
   * Load employee for editing/viewing
   * @param employeeId - Employee ID to load
   */
  private loadEmployee(employeeId: number): void {
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
   * Handle employee loaded
   * @param employee - Loaded employee
   */
  private handleEmployeeLoaded(employee: Employee): void {
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
   * Clear error message
   */
  private clearErrorMessage(): void {
    this.errorTitle = 'Error';
    this.errorMessage = null;
  }

  /**
   * Load all employees from service
   */
  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.errorTitle = 'Error';

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
        next: () => this.handleEmployeeCreated(),
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
        next: () => this.handleEmployeeUpdated(),
        error: (error) => this.handleUpdateError(error),
      });
  }

  /**
   * Handle successful employee creation
   */
  private handleEmployeeCreated(): void {
    this.isLoading = false;
    this.navigateToList();
  }

  /**
   * Handle successful employee update
   */
  private handleEmployeeUpdated(): void {
    this.isLoading = false;
    this.navigateToList();
  }

  /**
   * Handle error during employee creation
   * @param error - Error object
   */
  private handleCreateError(error: any): void {
    this.errorMessage = error?.error?.detail || 'Error al crear empleado. Por favor, intente nuevamente.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isLoading = false;
    console.error(error);
  }

  /**
   * Handle error during employee update
   * @param error - Error object
   */
  private handleUpdateError(error: any): void {
    this.errorMessage = error?.error?.errors[0]?.message || 'Error al actualizar empleado. Por favor, intente nuevamente.';
    this.errorTitle = error?.error?.detail || 'Error de actualización'; 
    this.isLoading = false;
    console.error('Error updating employee:', error);
  }

  /**
   * Handle employee deletion request - OPENS MODAL
   * @param employeeId - ID of employee to delete
   */
  handleEmployeeDelete(employeeId: number): void {
    this.employeeIdToDelete = employeeId;
    this.isConfirmModalOpen = true;
  }

  /**
   * Confirm employee deletion (called from modal)
   */
  onConfirmDelete(): void {
    if (this.employeeIdToDelete) {
      this.deleteEmployee(this.employeeIdToDelete);
    }
    this.closeConfirmModal();
  }

  /**
   * Cancel employee deletion (called from modal)
   */
  onCancelDelete(): void {
    this.closeConfirmModal();
  }

  /**
   * Close confirm modal
   */
  private closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.employeeIdToDelete = null;
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
    this.employees = this.employees.filter(emp => emp.id !== employeeId);
    this.isLoading = false;
    this.navigateToList();
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

  // View helpers
  isListView(): boolean { return this.currentViewMode === 'list'; }
  isCreateView(): boolean { return this.currentViewMode === 'create'; }
  isEditView(): boolean { return this.currentViewMode === 'edit'; }
  isViewView(): boolean { return this.currentViewMode === 'view'; }
}
