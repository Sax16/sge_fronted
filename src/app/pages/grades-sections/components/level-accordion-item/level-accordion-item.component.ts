import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Level, LevelAcademicType } from '../../models/level.model';
import { Grade } from '../../models/grade.model';
import { Section } from '../../models/section.model';
import { GradeService } from '../../services/grade.service';
import { SectionService } from '../../services/section.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { parseApiError } from '../../../../shared/utils/api-error.util';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { ICONS } from '../../../../shared/constants/icons.constant';
import { GradeFormModalComponent } from '../grade-form-modal/grade-form-modal.component';
import { SectionFormModalComponent } from '../section-form-modal/section-form-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/ui/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-level-accordion-item',
  imports: [
    SafeHtmlPipe,
    GradeFormModalComponent,
    SectionFormModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './level-accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelAccordionItemComponent {
  readonly level = input.required<Level>();
  readonly grades = input<Grade[]>([]);
  readonly sections = input<Section[]>([]);

  readonly editLevelRequest = output<Level>();
  readonly deleteLevelRequest = output<Level>();
  readonly dataChanged = output<void>();

  private readonly gradeService = inject(GradeService);
  private readonly sectionService = inject(SectionService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  // Accordion State
  readonly isOpen = signal(false);

  // Constants
  readonly LevelAcademicType = LevelAcademicType;
  readonly icons = ICONS;

  // Grade Modal State
  readonly isGradeModalOpen = signal(false);
  readonly gradeToEdit = signal<Grade | null>(null);

  // Section Modal State
  readonly isSectionModalOpen = signal(false);
  readonly sectionToEdit = signal<Section | null>(null);
  readonly selectedGradeForSection = signal<Grade | null>(null);

  // Confirm Delete State
  readonly isConfirmDeleteOpen = signal(false);
  readonly deleteTarget = signal<{ type: 'grade'; item: Grade } | { type: 'section'; item: Section } | null>(null);

  readonly confirmDeleteTitle = computed(() => {
    const target = this.deleteTarget();
    return target?.type === 'grade' ? 'Eliminar grado' : 'Eliminar sección';
  });

  readonly confirmDeleteMessage = computed(() => {
    const target = this.deleteTarget();
    if (!target) return '';
    return target.type === 'grade'
      ? `¿Estás seguro que deseas eliminar el grado "${target.item.name}"? Esta acción no se puede deshacer y borrará las secciones asociadas.`
      : `¿Estás seguro que deseas eliminar la sección "${target.item.name}"?`;
  });

  readonly gradesForLevel = computed(() =>
    this.grades().filter((g) => g.levelId === this.level().id)
  );

  getSectionsForGrade(gradeId: number): Section[] {
    return this.sections().filter((s) => s.gradeId === gradeId);
  }

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  // --- Grade Modal ---

  openGradeModal(gradeToEdit?: Grade): void {
    this.gradeToEdit.set(gradeToEdit ?? null);
    this.isGradeModalOpen.set(true);
  }

  closeGradeModal(): void {
    this.isGradeModalOpen.set(false);
    this.gradeToEdit.set(null);
  }

  requestDeleteGrade(grade: Grade): void {
    this.deleteTarget.set({ type: 'grade', item: grade });
    this.isConfirmDeleteOpen.set(true);
  }

  // --- Section Modal ---

  openSectionModal(grade: Grade, sectionToEdit?: Section): void {
    this.selectedGradeForSection.set(grade);
    this.sectionToEdit.set(sectionToEdit ?? null);
    this.isSectionModalOpen.set(true);
  }

  closeSectionModal(): void {
    this.isSectionModalOpen.set(false);
    this.selectedGradeForSection.set(null);
    this.sectionToEdit.set(null);
  }

  requestDeleteSection(section: Section): void {
    this.deleteTarget.set({ type: 'section', item: section });
    this.isConfirmDeleteOpen.set(true);
  }

  // --- Confirm Delete ---

  cancelDelete(): void {
    this.isConfirmDeleteOpen.set(false);
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.isConfirmDeleteOpen.set(false);

    if (target.type === 'grade') {
      this.executeDeleteGrade(target.item);
    } else {
      this.executeDeleteSection(target.item);
    }
  }

  private executeDeleteGrade(grade: Grade): void {
    this.gradeService.deleteGrade(grade.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Grado eliminado correctamente');
          this.deleteTarget.set(null);
          this.dataChanged.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al eliminar el grado');
          this.alertService.showAlert('error', 'Error', msg);
          this.deleteTarget.set(null);
        }
      });
  }

  private executeDeleteSection(section: Section): void {
    this.sectionService.deleteSection(section.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Sección eliminada correctamente');
          this.deleteTarget.set(null);
          this.dataChanged.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al eliminar la sección');
          this.alertService.showAlert('error', 'Error', msg);
          this.deleteTarget.set(null);
        }
      });
  }
}
