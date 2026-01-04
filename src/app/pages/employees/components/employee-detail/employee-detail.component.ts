import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-employee-detail',
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
  ],
  templateUrl: './employee-detail.component.html',
  styles: ``
})
export class EmployeeDetailComponent {
  @Input() employee: Employee | null = null;
  @Output() editEmployee = new EventEmitter<string>();
  

  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  handleEditClick(employeeId: string): void {
    this.editEmployee.emit(employeeId);
  }

  getBadgeColor(isActive: boolean): 'success' | 'light' {
    return isActive ? 'success' : 'light';
  }

  // Temporal forma para tabla de pagos a empleados
  tableData = [
    {
      id: 1,
      date: '2025-07-18',
      description: 'UI Kits',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 109,
    },
    {
      id: 2,
      date: '2025-07-18',
      description: 'Templates',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 59,
    },
    {
      id: 3,
      date: '2025-07-18',
      description: 'Templates',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 49,
    },
    {
      id: 4,
      date: '2025-07-18',
      description: 'SaaS',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 39,
    },
    {
      id: 5,
      date: '2025-07-18',
      description: 'Templates',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 93,
    },
    {
      id: 6,
      date: '2025-07-18',
      description: 'Templates',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 29
    },
    {
      id: 7,
      date: '2025-07-18',
      description: 'Templates',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 19
    },
  ];

  handleFilter() {
    console.log('Filter clicked');
    // Add your filter logic here
  }

  handleSeeAll() {
    console.log('See all clicked');
    // Add your see all logic here
  }

}