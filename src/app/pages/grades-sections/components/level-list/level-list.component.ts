import { Component, ChangeDetectionStrategy, input, output, computed, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Level, LevelAcademicType, LevelCreate } from '../../models/level.model';
import { Grade } from '../../models/grade.model';
import { Section } from '../../models/section.model';
import { LevelAccordionItemComponent } from '../level-accordion-item/level-accordion-item.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/common/modal/modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/ui/confirm-modal/confirm-modal.component';
import { SafeHtmlPipe } from '../../../../shared/pipe/safe-html.pipe';
import { ICONS } from '../../../../shared/constants/icons.constant';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { LevelService } from '../../services/level.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { parseApiError } from '../../../../shared/utils/api-error.util';
import { FormErrorHelper } from '../../../../shared/utils/form-error.helper';

@Component({
  selector: 'app-level-list',
  imports: [
    LevelAccordionItemComponent,
    ButtonComponent,
    ModalComponent,
    ReactiveFormsModule,
    InputFieldReactiveComponent,
    LabelComponent,
    SafeHtmlPipe,
    ConfirmModalComponent,
  ],
  templateUrl: './level-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelListComponent {
  readonly levels = input.required<Level[]>();
  readonly grades = input<Grade[]>([]);
  readonly sections = input<Section[]>([]);
  readonly type = input.required<LevelAcademicType>();

  readonly dataChanged = output<void>();

  private readonly levelService = inject(LevelService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isModalOpen = signal(false);
  readonly isSubmitting = signal(false);
  readonly isFormSubmitted = signal(false);

  readonly LevelAcademicType = LevelAcademicType;
  readonly icons = ICONS;

  readonly selectedLevel = signal<Level | null>(null);

  // Confirm Delete State
  readonly isConfirmDeleteOpen = signal(false);
  readonly levelToDelete = signal<Level | null>(null);

  readonly form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
    modularCode: new FormControl('', [Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    tag: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
  });

  readonly formErrors = new FormErrorHelper(this.form, () => this.isFormSubmitted());

  /** Descriptive title shown above the accordion list */
  readonly title = computed(() =>
    this.type() === LevelAcademicType.REGULAR
      ? 'Educación Básica Regular'
      : 'Educación Extraordinaria'
  );

  readonly description = computed(() =>
    this.type() === LevelAcademicType.REGULAR
      ? 'Estructura estándar de niveles y grados según el sistema educativo nacional'
      : 'Niveles, grados y secciones personalizados (academias, preparatorias, etc.)'
  );

  openModal(level?: Level) {
    this.isFormSubmitted.set(false);
    if (level) {
      this.selectedLevel.set(level);
      this.form.patchValue({
        name: level.name,
        modularCode: level.modularCode || '',
        tag: level.tag,
      });
    } else {
      this.selectedLevel.set(null);
      this.form.reset();
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedLevel.set(null);
  }

  onSubmit() {
    this.isFormSubmitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    this.isSubmitting.set(true);

    if (this.selectedLevel()) {
      this.updateLevel(val);
    } else {
      this.createLevel(val);
    }
  }

  requestDeleteLevel(level: Level): void {
    this.levelToDelete.set(level);
    this.isConfirmDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.isConfirmDeleteOpen.set(false);
    this.levelToDelete.set(null);
  }

  confirmDeleteLevel(): void {
    const level = this.levelToDelete();
    if (!level) return;

    this.isConfirmDeleteOpen.set(false);

    this.levelService.deleteLevel(level.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Nivel eliminado correctamente');
          this.levelToDelete.set(null);
          this.dataChanged.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al eliminar el nivel');
          this.alertService.showAlert('error', 'Error', msg);
          this.levelToDelete.set(null);
        }
      });
  }

  private createLevel(val: typeof this.form.value): void {
    const payload: LevelCreate = {
      name: val.name!.trim(),
      modularCode: val.modularCode?.trim() || null,
      tag: val.tag!.trim(),
      type: this.type(),
    };

    this.levelService.createLevel(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Nivel creado correctamente');
          this.closeModal();
          this.dataChanged.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al crear el nivel');
          this.alertService.showAlert('error', 'Error', msg);
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
  }

  private updateLevel(val: typeof this.form.value): void {
    const payload = {
      name: val.name!.trim(),
      modularCode: val.modularCode?.trim() || null,
      tag: val.tag!.trim(),
    };

    this.levelService.updateLevel(this.selectedLevel()!.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Nivel actualizado correctamente');
          this.closeModal();
          this.dataChanged.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al actualizar el nivel');
          this.alertService.showAlert('error', 'Error', msg);
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
  }
}
