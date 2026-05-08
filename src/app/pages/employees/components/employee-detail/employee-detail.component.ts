import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { EmployeePaymentHistoryComponent } from '../employee-payment-history/employee-payment-history.component';
import { getFullName } from '../../../../shared/utils/employee.util';

@Component({
  selector: 'app-employee-detail',
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
    EmployeePaymentHistoryComponent,
  ],
  templateUrl: './employee-detail.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailComponent {
  @Input() employee: Employee | null = null;
  @Output() editEmployee = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();

  readonly getFullName = getFullName;

  handleEditClick(employeeId: number): void {
    this.editEmployee.emit(employeeId);
  }
}