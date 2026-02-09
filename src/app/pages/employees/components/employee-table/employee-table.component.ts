import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Employee } from '../../models/employee.model';

/**
 * Employee Table Component
 * Implements Single Responsibility Principle (SRP) - Handles only employee table display
 * Implements Open/Closed Principle (OCP) - Extensible through inputs/outputs
 */
@Component({
  selector: 'app-employee-table',
  imports: [
    CommonModule,
    BadgeComponent,
    AvatarTextComponent,
    ButtonComponent,
  ],
  templateUrl: './employee-table.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Output() newEmployee = new EventEmitter<void>();
  @Output() editEmployee = new EventEmitter<number>();
  @Output() deleteEmployee = new EventEmitter<number>();
  @Output() viewEmployee = new EventEmitter<number>();

  /**
   * Handle new employee button click
   */
  handleNewEmployeeClick(): void {
    this.newEmployee.emit();
  }

  /**
   * Handle edit employee button click
   * @param employeeId - ID of employee to edit
   */
  handleEditClick(employeeId: number): void {
    this.editEmployee.emit(employeeId);
  }

  /**
   * Handle delete employee button click
   * @param employeeId - ID of employee to delete
   */
  handleDeleteClick(employeeId: number): void {
    this.deleteEmployee.emit(employeeId);
  }

  /**
   * Handle view employee button click
   * @param employeeId - ID of employee to view
   */
  handleViewClick(employeeId: number): void {
    this.viewEmployee.emit(employeeId);
  }

  /**
   * Get full name of employee
   * @param employee - Employee object
   * @returns Full name
   */
  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  /**
   * Get position label in Spanish
   * @param position - Employee position
   * @returns Position label
   */
  getPositionLabel(position: string): string {
    const positionLabels: Record<string, string> = {
      'ADMIN': 'Administrador',
      'CASHIER': 'Cajero',
      'WAREHOUSE': 'Almacenero',
      'SELLER': 'Vendedor',
    };

    return positionLabels[position] || position;
  }

  /**
   * Get status label in Spanish
   * @param status - Employee status
   * @returns Status label
   */
  getStatusLabel(isActive: boolean): 'Activo' | 'Inactivo' {
    return isActive ? 'Activo' : 'Inactivo';
  }

  /**
   * Get badge color based on status
   * @param status - Employee status
   * @returns Badge color
   */
  getBadgeColor(isActive: boolean): 'success' | 'light' {
    return isActive ? 'success' : 'light';
  }

  /**
   * Format date to DD-MM-YYYY
   * @param date - Date object
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Check if employee list is empty
   * @returns true if empty, false otherwise
   */
  isEmployeeListEmpty(): boolean {
    return this.employees.length === 0;
  }

  /**
   * Track by function for ngFor optimization
   * @param index - Index of item
   * @param employee - Employee object
   * @returns Unique identifier
   */
  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.id;
  }
}
