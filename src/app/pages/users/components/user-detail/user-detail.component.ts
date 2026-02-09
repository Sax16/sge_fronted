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
  @Output() editUser = new EventEmitter<number>();
  
  /**
   * Handle edit user button click
   * @param userId - ID of user to edit
   */
  handleEditClick(userId: number): void {
    this.editUser.emit(userId);
  }

  /**
   * Get badge color based on status
   * @param isActive - User status
   * @returns Badge color
   */
  getBadgeColor(isActive: boolean): 'success' | 'light' {
    return isActive ? 'success' : 'light';
  }

  /**
   * Get status label
   * @param isActive - User status
   * @returns Status label
   */
  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }
}
