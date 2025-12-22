import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { AvatarTextComponent } from '../../ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-user-table',
  imports: [
    CommonModule,
    BadgeComponent,
    AvatarTextComponent,
    ButtonComponent
],
  templateUrl: './user-table.component.html',
  styles: ``
})
export class UserTableComponent {

  tableRowData = [
    {
      id: 'DE124321',
      username: 'admin16',
      passwor: 'password',
      owner: { name: 'Jhordan Sax', position: 'Apoyo', email: 'admin16@gmail.com', initials: 'AB'},
      create_at: '01-01-2024',
      status: { type: 'Activo' },
      actions: { delete: true },
    },
    {
      id: 'DE124322',
      username: 'gisse10',
      passwor: 'password',
      owner: { name: 'Gissela Muñoz', position: 'Secretaria', email: 'gisse10@gmail.com', initials: 'AD'},
      create_at: '01-01-2024',
      status: { type: 'Activo' },
      actions: { delete: true },
    },
    {
      id: 'DE124323',
      username: 'paulina22',
      passwor: 'password',
      owner: { name: 'Paulina Peñafield', position: 'Directora', email: 'paulina22@gmail.com', initials: 'AF'},
      create_at: '01-01-2024',
      status: { type: 'Activo' },
      actions: { delete: true },
    },
    {
      id: 'DE124324',
      username: 'javier30',
      passwor: 'password',
      owner: { name: 'Javier Huaranga', position: 'Profesor', email: 'javier30@gmail.com', initials: 'AB'},
      create_at: '01-01-2024',
      status: { type: 'Inactivo' },
      actions: { delete: true },
    },
    {
      id: 'DE124325',
      username: 'gabriela45',
      passwor: 'password',
      owner: { name: 'Gabriela Salazar', position: 'Promotora', email: 'gabriela45@gmail.com', initials: 'AB'},
      create_at: '01-01-2024',
      status: { type: 'Inactivo' },
      actions: { delete: true },
    },
  ];

  getBadgeColor(type: string): 'success' | 'light' {
    if (type === 'Activo') return 'success';
    return 'light';
  }
}
