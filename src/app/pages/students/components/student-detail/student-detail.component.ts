import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent, BadgeColor } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-student-detail',
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  templateUrl: './student-detail.component.html',
  styles: ``
})
export class StudentDetailComponent {
  @Input() student!: Student;

  @Output() edit = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

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

  getFullName(): string {
    return `${this.student.paternalSurname} ${this.student.maternalSurname}, ${this.student.name}`;
  }
}
