import { Injectable, inject, signal } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/employee.model';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';

/**
 * Employees State Service
 * Implementa Patrón de "kState / Facade"
 * Maneja llamadas a APIs, lógica de negocio y mantiene el estado reactivo usando Signals.
 */
@Injectable()
export class EmployeesState {
  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  // --- Estado Público (Readonly Signals en vistas si fuese necesario, pero aquí usaremos acceso directo por simplicidad) ---
  readonly employees = signal<Employee[]>([]);
  readonly selectedEmployee = signal<Employee | null>(null);
  readonly isLoading = signal<boolean>(false);
  
  // Estado Local (UI - Modal)
  readonly isConfirmModalOpen = signal<boolean>(false);
  readonly employeeIdToDelete = signal<number | null>(null);

  // --- Operaciones (Commands) ---

  loadEmployees(silently = false) {
    if (!silently) this.isLoading.set(true);

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error', 'Error al cargar empleados. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        console.error('Error loading employees:', err);
      }
    });
  }

  loadEmployeeById(id: number) {
    this.isLoading.set(true);
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.selectedEmployee.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error', 'Error al cargar empleado. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        this.router.navigate(['/employees']);
      }
    });
  }

  createEmployee(dto: CreateEmployeeDto) {
    this.isLoading.set(true);
    this.employeeService.createEmployee(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showAlert('success', '¡Éxito!', 'Empleado creado correctamente.');
        this.router.navigate(['/employees'], { state: { reloadData: true } });
      },
      error: (err) => {
        const errorMsg = err?.error?.detail || 'Error al crear empleado. Por favor, intente nuevamente.';
        this.alertService.showAlert('error', 'Error al crear', errorMsg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      }
    });
  }

  updateEmployee(id: number, dto: UpdateEmployeeDto) {
    this.isLoading.set(true);
    this.employeeService.updateEmployee(id, dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showAlert('info', 'Actualizado', 'Empleado actualizado correctamente.');
        this.router.navigate(['/employees'], { state: { reloadData: true } });
      },
      error: (err) => {
        const errorMsg = err?.error?.errors?.[0]?.message || 'Error al actualizar empleado. Por favor, intente nuevamente.';
        const errorTitle = err?.error?.detail || 'Error de actualización';
        this.alertService.showAlert('error', errorTitle, errorMsg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      }
    });
  }

  openDeleteConfirmModal(id: number) {
    this.employeeIdToDelete.set(id);
    this.isConfirmModalOpen.set(true);
  }

  closeConfirmModal() {
    this.isConfirmModalOpen.set(false);
    this.employeeIdToDelete.set(null);
  }

  deleteEmployee() {
    const id = this.employeeIdToDelete();
    if (!id) return;
    
    this.isLoading.set(true);
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees.update(emps => emps.filter(e => e.id !== id));
        this.isLoading.set(false);
        this.alertService.showAlert('success', 'Eliminado', 'Empleado eliminado correctamente.');
        this.closeConfirmModal();
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error', 'Error al eliminar empleado. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        this.closeConfirmModal();
        console.error('Error deleting employee:', err);
      }
    });
  }

  clearSelection() {
    this.selectedEmployee.set(null);
  }
}
