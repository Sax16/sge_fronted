import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from './student.service';
import { EconomicLevelService } from '../../finances/economic-levels/services/economic-level.service';
import { Student, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
import { EconomicLevel } from '../../finances/economic-levels/models/economic-level.model';
import { AlertService } from '../../../shared/services/alert.service';
import { parseApiError } from '../../../shared/utils/api-error.util';

/**
 * Students State Service
 * Implementa Patrón de "State / Facade"
 * Maneja llamadas a APIs, lógica de negocio y mantiene el estado reactivo usando Signals.
 */
@Injectable()
export class StudentsState {
  private studentService = inject(StudentService);
  private economicLevelService = inject(EconomicLevelService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  // --- Estado Público (Signals) ---
  readonly students = signal<Student[]>([]);
  readonly economicLevels = signal<EconomicLevel[]>([]);
  readonly selectedStudent = signal<Student | null>(null);

  readonly isLoading = signal<boolean>(false);

  // Estado Local (UI - Modal)
  readonly isConfirmModalOpen = signal<boolean>(false);
  readonly studentIdToDelete = signal<number | null>(null);

  // --- Operaciones (Commands) ---

  loadStudents(silently = false): void {
    if (!silently) this.isLoading.set(true);

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        const errorMsg = parseApiError(err, 'Error al cargar estudiantes. Por favor, intente nuevamente.');
        this.alertService.showAlert('error', 'Error al cargar', errorMsg);
        this.isLoading.set(false);
        console.error('Error loading students:', err);
      }
    });
  }

  loadStudentById(id: number): void {
    this.isLoading.set(true);
    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.selectedStudent.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        const errorMsg = parseApiError(err, 'Error al cargar estudiante. Por favor, intente nuevamente.');
        this.alertService.showAlert('error', 'Error al cargar', errorMsg);
        this.isLoading.set(false);
        console.error('Error loading student:', err);
        this.router.navigate(['/students']);
      }
    });
  }

  loadEconomicLevels(): void {
    this.economicLevelService.getEconomicLevels().subscribe({
      next: (data) => {
        this.economicLevels.set(data);
      },
      error: (err) => {
        console.error('Error loading economic levels:', err);
      }
    });
  }

  createStudent(dto: CreateStudentDto): void {
    this.isLoading.set(true);
    console.log(dto)
    this.studentService.createStudent(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showAlert('success', '¡Éxito!', 'Estudiante registrado correctamente.');
        this.router.navigate(['/students'], { state: { reloadData: true } });
      },
      error: (err) => {
        const errorMsg = parseApiError(err, 'Error al registrar estudiante. Por favor, intente nuevamente.');
        this.alertService.showAlert('error', 'Error al registrar', errorMsg);
        console.error(err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      }
    });
  }

  updateStudent(id: number, dto: UpdateStudentDto): void {
    this.isLoading.set(true);
    this.studentService.updateStudent(id, dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showAlert('info', 'Actualizado', 'Estudiante actualizado correctamente.');
        this.router.navigate(['/students'], { state: { reloadData: true } });
      },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      error: (err) => {
        const errorMsg = parseApiError(err, 'Error al actualizar estudiante. Por favor, intente nuevamente.');
        this.alertService.showAlert('error', 'Error al actualizar', errorMsg);
        console.error(err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      }
    });
  }

  openDeleteConfirmModal(id: number): void {
    this.studentIdToDelete.set(id);
    this.isConfirmModalOpen.set(true);
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen.set(false);
    this.studentIdToDelete.set(null);
  }

  deleteStudent(): void {
    const id = this.studentIdToDelete();
    if (!id) return;

    this.isLoading.set(true);
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students.update(list => list.filter(s => s.id !== id));
        this.isLoading.set(false);
        this.alertService.showAlert('success', 'Eliminado', 'Estudiante eliminado correctamente.');
        this.closeConfirmModal();
      },
      error: (err) => {
        const errorMsg = parseApiError(err, 'Error al eliminar estudiante. Por favor, intente nuevamente.');
        this.alertService.showAlert('error', 'Error al eliminar', errorMsg);
        this.isLoading.set(false);
        this.closeConfirmModal();
        console.error('Error deleting student:', err);
      }
    });
  }

  clearSelection(): void {
    this.selectedStudent.set(null);
  }
}
