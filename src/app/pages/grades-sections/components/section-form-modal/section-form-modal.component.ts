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
import { Section, SectionCreate } from '../../models/section.model';
import { Grade } from '../../models/grade.model';
import { SectionService } from '../../services/section.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { FormErrorHelper } from '../../../../shared/utils/form-error.helper';
import { parseApiError } from '../../../../shared/utils/api-error.util';
import { ModalComponent } from '../../../../shared/components/common/modal/modal.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-section-form-modal',
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputFieldReactiveComponent,
    LabelComponent,
    ButtonComponent,
  ],
  templateUrl: './section-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFormModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly grade = input<Grade | null>(null);
  readonly sectionToEdit = input<Section | null>(null);

  readonly closed = output<void>();
  readonly saved = output<void>();

  private readonly sectionService = inject(SectionService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly isFormSubmitted = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    tag: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  readonly formErrors = new FormErrorHelper(this.form, () => this.isFormSubmitted());

  /** Populate or reset form when modal opens */
  private readonly populateEffect = effect(() => {
    if (!this.isOpen()) return;

    this.isFormSubmitted.set(false);
    const section = this.sectionToEdit();

    if (section) {
      this.form.patchValue({ name: section.name, tag: section.tag });
    } else {
      this.form.reset();
    }
  });

  readonly isEditMode = () => !!this.sectionToEdit();

  onSubmit(): void {
    this.isFormSubmitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentGrade = this.grade();
    if (!currentGrade) return;

    const val = this.form.value;
    this.isSubmitting.set(true);

    if (this.isEditMode()) {
      this.updateSection(val);
    } else {
      this.createSection(val, currentGrade.id);
    }
  }

  private createSection(val: typeof this.form.value, gradeId: number): void {
    const payload: SectionCreate = {
      name: val.name!.trim(),
      tag: val.tag!.trim(),
      gradeId,
    };

    this.sectionService.createSection(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Sección creada correctamente');
          this.closed.emit();
          this.saved.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al crear la sección');
          this.alertService.showAlert('error', 'Error', msg);
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
  }

  private updateSection(val: typeof this.form.value): void {
    const payload = {
      name: val.name!.trim(),
      tag: val.tag!.trim(),
    };

    this.sectionService.updateSection(this.sectionToEdit()!.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Éxito', 'Sección actualizada correctamente');
          this.closed.emit();
          this.saved.emit();
        },
        error: (err) => {
          const msg = parseApiError(err, 'Error al actualizar la sección');
          this.alertService.showAlert('error', 'Error', msg);
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
  }
}
