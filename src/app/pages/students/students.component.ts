import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { ConfirmModalComponent } from '../../shared/components/ui/confirm-modal/confirm-modal.component';
import { AlertService } from '../../shared/services/alert.service';
import { NavigationHistoryState } from '../../shared/models/navigation-history-state.model';
import { StudentsState } from './services/students.state';
import { StudentTableComponent } from './components/student-table/student-table.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { UpdateStudentDto } from './models/student.model';

type StudentViewMode = 'list' | 'create' | 'edit' | 'view';

@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    RouterModule,
    PageBreadcrumbComponent,
    AlertComponent,
    ConfirmModalComponent,
    StudentTableComponent,
    StudentFormComponent,
    StudentDetailComponent,
  ],
  templateUrl: './students.component.html',
  styles: ``,
  providers: [StudentsState]
})
export class StudentsComponent implements OnInit {
  public state = inject(StudentsState);
  public alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly destroyRef = inject(DestroyRef);

  currentViewMode: StudentViewMode = 'list';

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      filter((e: NavigationStart) => !e.url.startsWith('/students')),
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.alertService.clearAlert());
    
    this.state.loadEconomicLevels();
    this.subscribeToRouteChanges();
  }

  private subscribeToRouteChanges(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.currentViewMode = (data['mode'] as StudentViewMode) || 'list';

        const historyState = history.state as NavigationHistoryState;
        const willReload = !!historyState?.reloadData;

        if (this.currentViewMode === 'create') {
          this.state.clearSelection();
        } else if (this.currentViewMode === 'list') {
          this.state.clearSelection();

          if (this.state.students().length === 0 && !willReload) {
            this.state.loadStudents();
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
            this.handleInvalidStudentId();
            return;
          }

          const id = Number(idStr);
          if (isNaN(id)) {
            this.handleInvalidStudentId();
            return;
          }

          const currentStudent = this.state.selectedStudent();
          if (!currentStudent || currentStudent.id !== id) {
            this.state.loadStudentById(id);
          }
        }
      });
  }

  private checkHistoryState(historyState: NavigationHistoryState): void {
    if (historyState?.alert) {
      this.alertService.showAlert(historyState.alert.variant, historyState.alert.title, historyState.alert.message);
    }

    if (historyState?.reloadData) {
      this.state.loadStudents(true);
    }

    if (historyState?.alert || historyState?.reloadData) {
      const cleanState = { ...historyState };
      delete cleanState.alert;
      delete cleanState.reloadData;
      history.replaceState(cleanState, '');
    }
  }

  private handleInvalidStudentId(): void {
    this.alertService.showAlert('error', 'Error', 'ID de estudiante inválido');
    this.navigateToList();
  }

  // Navigation Methods

  navigateToCreate(): void {
    this.router.navigate(['students', 'create']);
  }

  navigateToEdit(studentId: number): void {
    this.router.navigate(['students', 'edit', studentId]);
  }

  navigateToView(studentId: number): void {
    this.router.navigate(['students', 'view', studentId]);
  }

  navigateToList(): void {
    this.router.navigate(['students']);
  }

  // Handlers

  handleStudentUpdate(studentData: UpdateStudentDto): void {
    const currentStudent = this.state.selectedStudent();
    if (!currentStudent) {
      this.alertService.showAlert('error', 'Error', 'No hay estudiante seleccionado para actualizar');
      return;
    }
    this.state.updateStudent(currentStudent.id, studentData);
  }

  // View Helpers
  isListView(): boolean { return this.currentViewMode === 'list'; }
  isCreateView(): boolean { return this.currentViewMode === 'create'; }
  isEditView(): boolean { return this.currentViewMode === 'edit'; }
  isDetailView(): boolean { return this.currentViewMode === 'view'; }
}
