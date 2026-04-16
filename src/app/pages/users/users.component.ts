import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { ConfirmModalComponent } from '../../shared/components/ui/confirm-modal/confirm-modal.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AlertService } from '../../shared/services/alert.service';
import { NavigationHistoryState } from '../../shared/models/navigation-history-state.model';
import { UsersState } from './services/users.state';
import { UpdateUserDto } from './models/user.model';


type UserViewMode = 'list' | 'create' | 'edit' | 'view';

/**
 * Users Component
 * Main container for user management with routing
 * Implements Single Responsibility Principle (SRP) - Orchestrates user management UI delegating logic to UsersState
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
  styles: ``,
  providers: [UsersState]
})
export class UsersComponent implements OnInit, OnDestroy {
  public state = inject(UsersState);
  public alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly destroy$ = new Subject<void>();

  currentViewMode: UserViewMode = 'list';

  ngOnInit(): void {
    this.state.loadEmployees();
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
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.currentViewMode = (data['mode'] as UserViewMode) || 'list';

        // Check if history.state indicates a forced reload
        const historyState = history.state as NavigationHistoryState;
        const willReload = !!historyState?.reloadData;

        if (this.currentViewMode === 'create') {
          this.state.clearSelection();
        } else if (this.currentViewMode === 'list') {
          this.state.clearSelection();

          // Only load if no data and no reload signal coming
          if (this.state.users().length === 0 && !willReload) {
            this.state.loadUsers();
          }
        }

        this.checkHistoryState(historyState);
      });

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (this.currentViewMode === 'edit' || this.currentViewMode === 'view') {
          const idStr = params.get('id');
          if (!idStr) {
            this.handleInvalidUserId();
            return;
          }

          const id = Number(idStr);
          if (isNaN(id)) {
            this.handleInvalidUserId();
            return;
          }

          const currentUser = this.state.selectedUser();
          if (!currentUser || currentUser.id !== id) {
            this.state.loadUserById(id);
          }
        }
      });
  }

  /**
   * Check for navigation state passed via Router.
   * Receives historyState as parameter to avoid reading history.state twice.
   */
  private checkHistoryState(historyState: NavigationHistoryState): void {
    // Process passed alert if exists
    if (historyState?.alert) {
      this.alertService.showAlert(historyState.alert.variant, historyState.alert.title, historyState.alert.message);
    }

    // Process signal to reload data
    if (historyState?.reloadData) {
      this.state.loadUsers(true);
    }

    // Clean up state so a literal page refresh doesn't replay the alert
    if (historyState?.alert || historyState?.reloadData) {
      const cleanState = { ...historyState };
      delete cleanState.alert;
      delete cleanState.reloadData;
      history.replaceState(cleanState, '');
    }
  }

  private handleInvalidUserId(): void {
    this.alertService.showAlert('error', 'Error', 'ID de usuario inválido');
    this.navigateToList();
  }

  // --- Navigation Methods ---

  navigateToCreate(): void {
    this.router.navigate(['users', 'create']);
  }

  navigateToEdit(userId: number): void {
    this.router.navigate(['users', 'edit', userId]);
  }

  navigateToView(userId: number): void {
    this.router.navigate(['users', 'view', userId]);
  }

  navigateToList(): void {
    this.router.navigate(['users']);
  }

  // --- Handlers ---

  handleUserUpdate(userData: UpdateUserDto): void {
    const currentUser = this.state.selectedUser();
    if (!currentUser) {
      this.alertService.showAlert('error', 'Error', 'No hay usuario seleccionado para actualizar');
      return;
    }
    this.state.updateUser(currentUser.id, userData);
  }

  // --- View Helpers ---
  isListView(): boolean { return this.currentViewMode === 'list'; }
  isCreateView(): boolean { return this.currentViewMode === 'create'; }
  isEditView(): boolean { return this.currentViewMode === 'edit'; }
  isDetailView(): boolean { return this.currentViewMode === 'view'; }
}
