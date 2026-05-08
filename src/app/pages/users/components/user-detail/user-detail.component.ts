import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../models/user.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
  ],
  templateUrl: './user-detail.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent {

  @Input() user: User | null = null;
  @Input() employeeFullName: string | null = null;
  @Output() editUser = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();

  handleEditClick(userId: number): void {
    this.editUser.emit(userId);
  }
}
