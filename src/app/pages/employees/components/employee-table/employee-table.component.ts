import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Employee } from '../../models/employee.model';


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


  handleNewEmployeeClick(): void {
    this.newEmployee.emit();
  }


  handleEditClick(employeeId: number): void {
    this.editEmployee.emit(employeeId);
  }


  handleDeleteClick(employeeId: number): void {
    this.deleteEmployee.emit(employeeId);
  }


  handleViewClick(employeeId: number): void {
    this.viewEmployee.emit(employeeId);
  }


  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }


  getStatusLabel(isActive: boolean): 'Activo' | 'Inactivo' {
    return isActive ? 'Activo' : 'Inactivo';
  }


  getBadgeColor(isActive: boolean): 'success' | 'light' {
    return isActive ? 'success' : 'light';
  }


  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }


  isEmployeeListEmpty(): boolean {
    return this.employees.length === 0;
  }

  
  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.id;
  }
}
