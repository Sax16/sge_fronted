import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { User } from '../../models/user.model';
import { Employee } from '../../../employees/models/employee.model';
import { getFullName } from '../../../../shared/utils/employee.util';
import { getBadgeColor, getStatusLabel, formatDate } from '../../../../shared/utils/status.util';

/**
 * User Table Component
 * Presentational component — handles user table display.
 */
@Component({
  selector: 'app-user-table',
  imports: [
    CommonModule,
    BadgeComponent,
    AvatarTextComponent,
    ButtonComponent,
  ],
  templateUrl: './user-table.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() employees: Employee[] = [];
  @Output() newUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<number>();
  @Output() deleteUser = new EventEmitter<number>();
  @Output() viewUser = new EventEmitter<number>();

  // Expose shared utils to the template
  readonly getBadgeColor = getBadgeColor;
  readonly getStatusLabel = getStatusLabel;
  readonly formatDate = formatDate;

  handleNewUserClick(): void {
    this.newUser.emit();
  }

  handleEditClick(userId: number): void {
    this.editUser.emit(userId);
  }

  handleDeleteClick(userId: number): void {
    this.deleteUser.emit(userId);
  }

  handleViewClick(userId: number): void {
    this.viewUser.emit(userId);
  }

  getEmployeeName(employeeId: number): string {
    let employee = this.employees.find(employee => employee.id === employeeId);
    if (!employee) {
      return '#Error';
    }
    return getFullName(employee);
  }

  isUserListEmpty(): boolean {
    return this.users.length === 0;
  }
}
