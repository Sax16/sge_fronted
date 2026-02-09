import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { ConfirmModalComponent } from '../../shared/components/ui/confirm-modal/confirm-modal.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserService } from './services/user.service';
import { EmployeeService } from '../employees/services/employee.service';
import { User, CreateUserDto, UpdateUserDto } from './models/user.model';
import { Employee } from '../employees/models/employee.model';

/**
 * User View Mode
 * Determines what to display in the component
 */
type UserViewMode = 'list' | 'create' | 'edit' | 'view';

/**
 * Users Component
 * Main container for user management with routing
 * Implements Single Responsibility Principle (SRP) - Orchestrates user management UI
 */
@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    RouterModule,
    PageBreadcrumbComponent,
    UserTableComponent,
    UserFormComponent,
    UserDetailComponent,
    AlertComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  users: User[] = [];
  employees: Employee[] = [];
  selectedUser: User | null = null;
  currentViewMode: UserViewMode = 'list';
  isLoading = false;
  
  // Alert state
  errorMessage: string | null = null;
  errorTitle: string = 'Error';
  
  // Confirm Modal state
  isConfirmModalOpen = false;
  userIdToDelete: number | null = null;

  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEmployees();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribe to route changes to determine view mode
   */
  private subscribeToRouteChanges(): void {
    // Listen to data changes for view mode
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const mode = (data['mode'] as UserViewMode) || 'list';
        this.handleModeChange(mode);
      });

    // Listen to param changes for ID updates
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (this.currentViewMode === 'edit' || this.currentViewMode === 'view') {
          const idStr = params.get('id');
          if (idStr) {
            const id = Number(idStr);
            if (!isNaN(id) && (!this.selectedUser || this.selectedUser.id !== id)) {
              this.loadUser(id);
            }
          }
        }
      });
  }

  /**
   * Handle mode change logic
   */
  private handleModeChange(mode: UserViewMode): void {
    this.currentViewMode = mode;
    this.clearErrorMessage();

    if (mode === 'edit' || mode === 'view') {
      this.handleDetailRoute();
    } else if (mode === 'create') {
      this.selectedUser = null;
    } else {
      // List mode
      this.selectedUser = null;
      if (this.users.length === 0) {
        this.loadUsers();
      }
    }
  }

  /**
   * Handle detail route (edit/view) by loading user data
   */
  private handleDetailRoute(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.handleInvalidUserId();
      return;
    }

    const userId = Number(idParam);
    if (isNaN(userId)) {
      this.handleInvalidUserId();
      return;
    }

    if (!this.selectedUser || this.selectedUser.id !== userId) {
      this.loadUser(userId);
    }
  }

  /**
   * Handle invalid user ID
   */
  private handleInvalidUserId(): void {
    this.errorMessage = 'ID de usuario inválido';
    this.navigateToList();
  }

  /**
   * Load user for editing/viewing
   * @param userId - User ID to load
   */
  private loadUser(userId: number): void {
    this.isLoading = true;

    this.userService
      .getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => this.handleUserLoaded(user),
        error: (error) => this.handleUserLoadError(error),
      });
  }

  /**
   * Handle user loaded
   * @param user - Loaded user
   */
  private handleUserLoaded(user: User): void {
    this.selectedUser = user;
    this.isLoading = false;
  }
  
  /**
   * Handle error loading user
   * @param error - Error object
   */
  private handleUserLoadError(error: Error): void {
    this.errorMessage = 'Error al cargar usuario. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error loading user:', error);
    this.navigateToList();
  }
  
  /**
   * Clear error message
   */
  private clearErrorMessage(): void {
    this.errorTitle = 'Error';
    this.errorMessage = null;
  }

  /**
   * Load all users from service
   */
  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => this.handleUsersLoaded(users),
        error: (error) => this.handleLoadError(error),
      });
  }

  /**
   * Load all employees for dropdown
   */
  private loadEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
        }
      });
  }

  /**
   * Handle successful users load
   * @param users - Loaded users
   */
  private handleUsersLoaded(users: User[]): void {
    this.users = users;
    this.isLoading = false;
  }

  /**
   * Handle error during users load
   * @param error - Error object
   */
  private handleLoadError(error: Error): void {
    this.errorMessage = 'Error al cargar usuarios. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error loading users:', error);
  }

  /**
   * Navigate to create user page
   */
  navigateToCreate(): void {
    this.router.navigate(['users', 'create']);
  }

  /**
   * Navigate to edit user page
   * @param userId - ID of user to edit
   */
  navigateToEdit(userId: number): void {
    this.router.navigate(['users', 'edit', userId]);
  }

  /**
   * Navigate to view user page
   * @param userId - ID of user to view
   */
  navigateToView(userId: number): void {
    this.router.navigate(['users', 'view', userId]);
  }

  /**
   * Navigate to user list
   */
  navigateToList(): void {
    this.router.navigate(['users']);
  }

  handleNewUserClick(): void {
    this.navigateToCreate();
  }

  handleEditUserClick(userId: number): void {
    this.navigateToEdit(userId);
  }

  handleViewUserClick(userId: number): void {
    this.navigateToView(userId);
  }

  handleUserCreate(userData: CreateUserDto): void {
    this.createUser(userData);
  }

  handleUserUpdate(userData: UpdateUserDto): void {
    if (!this.selectedUser) {
      this.errorMessage = 'No hay usuario seleccionado para actualizar';
      return;
    }
    this.updateUser(this.selectedUser.id, userData);
  }

  private createUser(userData: CreateUserDto): void {
    this.isLoading = true;

    this.userService
      .createUser(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleUserCreated(),
        error: (error) => this.handleCreateError(error),
      });
  }

  private updateUser(userId: number, userData: UpdateUserDto): void {
    this.isLoading = true;

    this.userService
      .updateUser(userId, userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleUserUpdated(),
        error: (error) => this.handleUpdateError(error),
      });
  }

  private handleUserCreated(): void {
    this.isLoading = false;
    this.navigateToList();
  }

  private handleUserUpdated(): void {
    this.isLoading = false;
    this.navigateToList();
  }

  private handleCreateError(error: Error): void {
    this.errorMessage = 'Error al crear usuario. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error creating user:', error);
  }

  private handleUpdateError(error: any): void {
    this.errorMessage = error?.error?.errors[0]?.message || 'Error al actualizar usuario. Por favor, intente nuevamente.';
    this.errorTitle = error?.error?.detail || 'Error de actualización';
    this.isLoading = false;
    console.error('Error updating user:', error);
  }

  handleUserDelete(userId: number): void {
    this.userIdToDelete = userId;
    this.isConfirmModalOpen = true;
  }

  onConfirmDelete(): void {
    if (this.userIdToDelete) {
      this.deleteUser(this.userIdToDelete);
    }
    this.closeConfirmModal();
  }

  onCancelDelete(): void {
    this.closeConfirmModal();
  }

  private closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.userIdToDelete = null;
  }

  private deleteUser(userId: number): void {
    this.isLoading = true;

    this.userService
      .deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleUserDeleted(userId),
        error: (error) => this.handleDeleteError(error),
      });
  }

  private handleUserDeleted(userId: number): void {
    this.users = this.users.filter(u => u.id !== userId);
    this.isLoading = false;
    this.navigateToList();
  }

  private handleDeleteError(error: Error): void {
    this.errorMessage = 'Error al eliminar usuario. Por favor, intente nuevamente.';
    this.isLoading = false;
    console.error('Error deleting user:', error);
  }

  handleFormCancel(): void {
    this.navigateToList();
  }

  // View helpers
  isListView(): boolean { return this.currentViewMode === 'list'; }
  isCreateView(): boolean { return this.currentViewMode === 'create'; }
  isEditView(): boolean { return this.currentViewMode === 'edit'; }
  isViewView(): boolean { return this.currentViewMode === 'view'; }
}
