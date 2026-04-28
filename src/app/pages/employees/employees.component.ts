import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { ConfirmModalComponent } from '../../shared/components/ui/confirm-modal/confirm-modal.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { AlertService } from '../../shared/services/alert.service';
import { NavigationHistoryState } from '../../shared/models/navigation-history-state.model';
import { EmployeesState } from './services/employees.state';
import { UpdateEmployeeDto } from './models/employee.model';

/**
 * Employee View Mode
 * Determines what to display in the component
 */
type EmployeeViewMode = 'list' | 'create' | 'edit' | 'view';

/**
 * Employees Component
 * Main container for employee management with routing
 * Implements Single Responsibility Principle (SRP) - Orchestrates employee management UI delegating logic to EmployeesState
 */
@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    RouterModule,
    PageBreadcrumbComponent,
    EmployeeTableComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent,
    AlertComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './employees.component.html',
  styles: ``,
  providers: [EmployeesState]
})
export class EmployeesComponent implements OnInit {
  public state = inject(EmployeesState);
  public alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly destroyRef = inject(DestroyRef);
  
  currentViewMode: EmployeeViewMode = 'list';

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      filter((e: NavigationStart) => !e.url.startsWith('/employees')),
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.alertService.clearAlert());
    this.subscribeToRouteChanges();
  }

  /**
   * Subscribe to route changes to determine view mode
   */
  private subscribeToRouteChanges(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.currentViewMode = (data['mode'] as EmployeeViewMode) || 'list';
        
        // Verificamos de antemano si el state del router indica que haremos un reload forzado
        const historyState = history.state as NavigationHistoryState;
        const willReload = !!historyState?.reloadData;
        
        if (this.currentViewMode === 'create') {
          this.state.clearSelection();
        } else if (this.currentViewMode === 'list') {
          this.state.clearSelection();
          
          // Solo cargamos por falta de datos si NO viene una orden de recarga por navegación
          if (this.state.employees().length === 0 && !willReload) {
            this.state.loadEmployees();
          }
        }
        
        this.checkHistoryState(historyState);
      });

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (this.currentViewMode === 'edit' || this.currentViewMode === 'view') {
          const idStr = params.get('id');
          if (!idStr) {
            this.handleInvalidEmployeeId();
            return;
          }
          
          const id = Number(idStr);
          if (isNaN(id)) {
            this.handleInvalidEmployeeId();
            return;
          }
          
          const currentEmp = this.state.selectedEmployee();
          if (!currentEmp || currentEmp.id !== id) {
             this.state.loadEmployeeById(id);
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
      this.state.loadEmployees(true);
    }
    
    // Clean up state so a literal page refresh doesn't replay the alert
    if (historyState?.alert || historyState?.reloadData) {
      const cleanState = { ...historyState };
      delete cleanState.alert;
      delete cleanState.reloadData;
      history.replaceState(cleanState, '');
    }
  }

  private handleInvalidEmployeeId(): void {
    this.alertService.showAlert('error', 'Error', 'ID de empleado inválido');
    this.navigateToList();
  }

  // --- Navigation Methods ---

  navigateToCreate(): void {
    this.router.navigate(['employees', 'create']);
  }

  navigateToEdit(employeeId: number): void {
    this.router.navigate(['employees', 'edit', employeeId]);
  }

  navigateToView(employeeId: number): void {
    this.router.navigate(['employees', 'view', employeeId]);
  }

  navigateToList(): void {
    this.router.navigate(['employees']);
  }

  // --- Handlers ---

  handleEmployeeUpdate(employeeData: UpdateEmployeeDto): void {
    const currentEmp = this.state.selectedEmployee();
    if (!currentEmp) {
      this.alertService.showAlert('error', 'Error', 'No hay empleado seleccionado para actualizar');
      return;
    }
    this.state.updateEmployee(currentEmp.id, employeeData);
  }

  // --- View Helpers ---
  isListView(): boolean { return this.currentViewMode === 'list'; }
  isCreateView(): boolean { return this.currentViewMode === 'create'; }
  isEditView(): boolean { return this.currentViewMode === 'edit'; }
  isDetailView(): boolean { return this.currentViewMode === 'view'; }
}
