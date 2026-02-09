import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailComponent {

  @Input() employee: Employee | null = null;
  @Output() editEmployee = new EventEmitter<number>();
  

  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  handleEditClick(employeeId: number): void {
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
    console.log('Year changed:', ($event.target as HTMLSelectElement).value);
    // TODO: Implement year filtering logic
  }
  
  // Temporal forma para tabla de pagos a empleados mas adelante se conecta a un servicio
  // MOCK DATA - To be replaced by service call
  tableData = [
    {
      id: 1,
      date: '2025-07-18',
      description: 'UI Kits',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 109,
    },
    // ... rest of mock data
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