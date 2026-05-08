import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Employee } from '../../models/employee.model';
import { getFullName } from '../../../../shared/utils/employee.util';

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

  readonly getFullName = getFullName;

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

  isEmployeeListEmpty(): boolean {
    return this.employees.length === 0;
  }
}
