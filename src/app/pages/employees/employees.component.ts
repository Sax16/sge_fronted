import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ModalService } from '../../shared/services/modal.service';
import { EmployeeService } from './services/employee.service';
import { Employee, CreateEmployeeDto } from './models/employee.model';

/**
 * Employees Component
 * Main container for employee management
 * Implements Single Responsibility Principle (SRP) - Orchestrates employee management UI
 */
@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    EmployeeTableComponent,
    ModalComponent,
    EmployeeFormComponent,
  ],
  templateUrl: './employees.component.html',
  styles: ``
})
export class EmployeesComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  employees: Employee[] = [];
  isModalOpen = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    public modalService: ModalService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
   * Open modal for creating new employee
   */
  openCreateModal(): void {
    this.isModalOpen = true;
  }

  /**
   * Close employee modal
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Handle employee form submission
   * @param employeeData - Employee data from form
   */
  handleEmployeeSubmit(employeeData: CreateEmployeeDto): void {
    this.createEmployee(employeeData);
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
   * Handle successful employee creation
   * @param employee - Created employee
   */
  private handleEmployeeCreated(employee: Employee): void {
    this.employees = [...this.employees, employee];
    this.isLoading = false;
    this.closeModal();
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
   * Handle employee deletion request
   * @param employeeId - ID of employee to delete
   */
  handleEmployeeDelete(employeeId: string): void {
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
  private deleteEmployee(employeeId: string): void {
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
  private handleEmployeeDeleted(employeeId: string): void {
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
}
