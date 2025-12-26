import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-employee-table',
  imports: [
    CommonModule,
    BadgeComponent,
    AvatarTextComponent,
    ButtonComponent,
],
  templateUrl: './employee-table.component.html',
  styles: ``
})
export class EmployeeTableComponent {

  @Output() newEmployee = new EventEmitter<void>();

  tableRowData = [
    {
      id: 'DE124321',
      name: 'Empleado 1',
      DNI: '09817',
      number: '964876211',
      create_at: '01-01-2024',
      email: 'empleado@gmail.com',
      position: 'Administrador',
      status: { type: 'Activo' },
      actions: { delete: true },
    },
    {
      id: 'DE124322',
      name: 'Empleado 1',
      DNI: '09817',
      number: '964876211',
      create_at: '01-01-2024',
      email: 'empleado@gmail.com',
      position: 'Administrador',
      status: { type: 'Activo' },
      actions: { delete: true },
    },
    {
      id: 'DE124323',
      name: 'Empleado 1',
      DNI: '09817',
      number: '964876211',
      create_at: '01-01-2024',
      email: 'empleado@gmail.com',
      position: 'Administrador',
      status: { type: 'Activo' },
      actions: { delete: true },
    },
    {
      id: 'DE124324',
      name: 'Empleado 1',
      DNI: '09817',
      number: '964876211',
      create_at: '01-01-2024',
      email: 'empleado@gmail.com',
      position: 'Administrador',
      status: { type: 'Inactivo' },
      actions: { delete: true },
    },
    {
      id: 'DE124325',
      name: 'Empleado 1',
      DNI: '09817',
      number: '964876211',
      create_at: '01-01-2024',
      email: 'empleado@gmail.com',
      position: 'Administrador',
      status: { type: 'Inactivo' },
      actions: { delete: true },
    },
  ];

  getBadgeColor(type: string): 'success' | 'light' {
    if (type === 'Activo') return 'success';
    return 'light';
  }
}
