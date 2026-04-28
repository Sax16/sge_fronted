import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  inject,
  effect,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Grade, GradeCreate } from '../../models/grade.model';
import { GradeService } from '../../services/grade.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { FormErrorHelper } from '../../../../shared/utils/form-error.helper';
import { parseApiError } from '../../../../shared/utils/api-error.util';
import { ModalComponent } from '../../../../shared/components/common/modal/modal.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-grade-form-modal',
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputFieldReactiveComponent,
    LabelComponent,
    ButtonComponent,
  ],
  templateUrl: './grade-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeFormModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly levelId = input.required<number>();
  readonly levelName = input.required<string>();
  readonly gradeToEdit = input<Grade | null>(null);

  readonly closed = output<void>();
  readonly saved = output<void>();

  private readonly gradeService = inject(GradeService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly isFormSubmitted = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    tag: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  readonly formErrors = new FormErrorHelper(this.form, () => this.isFormSubmitted());

  /** Populate or reset form when modal opens */
  private readonly populateEffect = effect(() => {
    if (!this.isOpen()) return;

    this.isFormSubmitted.set(false);
    const grade = this.gradeToEdit();

    if (grade) {
      this.form.patchValue({ name: grade.name, tag: grade.tag });
    } else {
      this.form.reset();
    }
  });

  readonly isEditMode = () => !!this.gradeToEdit();

  onSubmit(): void {
    this.isFormSubmitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    this.isSubmitting.set(true);

    if (this.isEditMode()) {
      this.updateGrade(val);
    } else {
      this.createGrade(val);
    }
  }

  private createGrade(val: typeof this.form.value): void {
    const payload: GradeCreate = {
      name: val.name!.trim(),
      tag: val.tag!.trim(),
      levelId: this.levelId(),
    };

    this.gradeService.createGrade(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Grado creado correctamente');
          this.closed.emit();
          this.saved.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al crear el grado');
          this.alertService.showAlert('error', 'Error', msg);
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
  }

  private updateGrade(val: typeof this.form.value): void {
    const payload = {
      name: val.name!.trim(),
      tag: val.tag!.trim(),
    };

    this.gradeService.updateGrade(this.gradeToEdit()!.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Grado actualizado correctamente');
          this.closed.emit();
          this.saved.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al actualizar el grado');
          this.alertService.showAlert('error', 'Error', msg);
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
  }
}
