import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { EmployeeService } from '../../employees/services/employee.service';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import { Employee } from '../../employees/models/employee.model';
import { AlertService } from '../../../shared/services/alert.service';
import { getFullName } from '../../../shared/utils/employee.util';

/**
 * Users State Service
 * Implementa Patrón de "State / Facade"
 * Maneja llamadas a APIs, lógica de negocio y mantiene el estado reactivo usando Signals.
 */
@Injectable()
export class UsersState {
  private userService = inject(UserService);
  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  // --- Estado Público (Signals) ---
  readonly users = signal<User[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly selectedEmployee = computed<Employee | null>(() => {
    const user = this.selectedUser();
    if (!user) return null;
    return this.employees().find(e => e.id === user.employeeId) ?? null;
  });

  readonly selectedEmployeeFullName = computed<string>(() => {
    const employee = this.selectedEmployee();
    if (!employee) return '';
    return getFullName(employee);
  });

  readonly isLoading = signal<boolean>(false);

  // Estado Local (UI - Modal)
  readonly isConfirmModalOpen = signal<boolean>(false);
  readonly userIdToDelete = signal<number | null>(null);

  // --- Operaciones (Commands) ---

  loadUsers(silently = false): void {
    if (!silently) this.isLoading.set(true);

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error', 'Error al cargar usuarios. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        console.error('Error loading users:', err);
      }
    });
  }

  loadUserById(id: number): void {
    this.isLoading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.selectedUser.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error', 'Error al cargar usuario. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        console.error('Error loading user:', err);
        this.router.navigate(['/users']);
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  createUser(dto: CreateUserDto): void {
    this.isLoading.set(true);
    this.userService.createUser(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showAlert('success', '¡Éxito!', 'Usuario creado correctamente.');
        this.router.navigate(['/users'], { state: { reloadData: true } });
      },
      error: (err) => {
        const errorMsg = err?.error?.detail || 'Error al crear usuario. Por favor, intente nuevamente.';
        this.alertService.showAlert('error', 'Error al crear', errorMsg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      }
    });
  }

  updateUser(id: number, dto: UpdateUserDto): void {
    this.isLoading.set(true);
    this.userService.updateUser(id, dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showAlert('info', 'Actualizado', 'Usuario actualizado correctamente.');
        this.router.navigate(['/users'], { state: { reloadData: true } });
      },
      error: (err) => {
        const errorMsg = err?.error?.errors?.[0]?.message || 'Error al actualizar usuario. Por favor, intente nuevamente.';
        const errorTitle = err?.error?.detail || 'Error de actualización';
        this.alertService.showAlert('error', errorTitle, errorMsg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      }
    });
  }

  openDeleteConfirmModal(id: number): void {
    this.userIdToDelete.set(id);
    this.isConfirmModalOpen.set(true);
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen.set(false);
    this.userIdToDelete.set(null);
  }

  deleteUser(): void {
    const id = this.userIdToDelete();
    if (!id) return;

    this.isLoading.set(true);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== id));
        this.isLoading.set(false);
        this.alertService.showAlert('success', 'Eliminado', 'Usuario eliminado correctamente.');
        this.closeConfirmModal();
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Error', 'Error al eliminar usuario. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        this.closeConfirmModal();
        console.error('Error deleting user:', err);
      }
    });
  }

  clearSelection(): void {
    this.selectedUser.set(null);
  }
}
