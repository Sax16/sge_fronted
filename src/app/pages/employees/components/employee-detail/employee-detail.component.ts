import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

export interface Option {
  value: string;
  label: string;
}

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

  // Opciones para el select de estado temporalmente años laborales, mas adelante se conecta a un servicio
  yearOptions: Option[] = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ];

  handleYearChange($event: Event) {
    throw new Error('Method not implemented.');
  }
  // Temporal forma para tabla de pagos a empleados mas adelante se conecta a un servicio
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