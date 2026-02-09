import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { User } from '../../models/user.model';

/**
 * User Table Component
 * Handles user table display
 */
@Component({
  selector: 'app-user-table',
  imports: [
    CommonModule,
    BadgeComponent,
    AvatarTextComponent,
    ButtonComponent,
  ],
  templateUrl: './user-table.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Output() newUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<number>();
  @Output() deleteUser = new EventEmitter<number>();
  @Output() viewUser = new EventEmitter<number>();

  /**
   * Handle new user button click
   */
  handleNewUserClick(): void {
    this.newUser.emit();
  }

  /**
   * Handle edit user button click
   * @param userId - ID of user to edit
   */
  handleEditClick(userId: number): void {
    this.editUser.emit(userId);
  }

  /**
   * Handle delete user button click
   * @param userId - ID of user to delete
   */
  handleDeleteClick(userId: number): void {
    this.deleteUser.emit(userId);
  }

  /**
   * Handle view user button click
   * @param userId - ID of user to view
   */
  handleViewClick(userId: number): void {
    this.viewUser.emit(userId);
  }

  /**
   * Get status label in Spanish
   * @param isActive - User status
   * @returns Status label
   */
  getStatusLabel(isActive: boolean): 'Activo' | 'Inactivo' {
    return isActive ? 'Activo' : 'Inactivo';
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
   * Format date to DD-MM-YYYY
   * @param date - Date object or string
   * @returns Formatted date string
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Check if user list is empty
   * @returns true if empty, false otherwise
   */
  isUserListEmpty(): boolean {
    return this.users.length === 0;
  }

  /**
   * Track by function for ngFor optimization
   * @param index - Index of item
   * @param user - User object
   * @returns Unique identifier
   */
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
