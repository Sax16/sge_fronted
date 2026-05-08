import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent, BadgeColor } from '../../../../shared/components/ui/badge/badge.component';
import { ICONS } from '../../../../shared/constants/icons.constant';

@Component({
  selector: 'app-student-table',
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  templateUrl: './student-table.component.html',
  styles: ``
})
export class StudentTableComponent {
  @Input() students: Student[] = [];
  @Input() isLoading = false;

  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() view = new EventEmitter<number>();

  public readonly icons = ICONS;

  getBadgeColor(status: string): BadgeColor {
    switch (status) {
      case 'Matriculado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Inactivo':
        return 'light';
      case 'Retirado':
        return 'error';
      case 'Egresado':
        return 'info';
      default:
        return 'light';
    }
  }

  getFullName(student: Student): string {
    return `${student.paternalSurname} ${student.maternalSurname}, ${student.name}`;
  }
}
