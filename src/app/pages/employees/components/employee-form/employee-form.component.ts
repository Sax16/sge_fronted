import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { DatePickerReactiveComponent } from '../../../../shared/components/reactive-form/date-picker-reactive/date-picker-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { SelectOption } from '../../../../shared/models/select-option.model';
import { CreateEmployeeDto, UpdateEmployeeDto, Employee, EmployeeFormData, Gender, EmployeePosition, EMPLOYEE_POSITIONS } from '../../models/employee.model';
import { DocumentValidators } from '../../../../shared/validators/document.validator';
import { ContactValidators } from '../../../../shared/validators/contact.validator';
import { DateValidators } from '../../../../shared/validators/date.validator';
import { FormValidationUtil } from '../../../../shared/utils/form-validation.util';
import { DateFormatUtil } from '../../../../shared/utils/date-format.util';
import { StringSanitizeUtil } from '../../../../shared/utils/string-sanitize.util';

/**
 * Employee Form Component
 * Handles employee create/edit form logic.
 * Delegates: validation (validators/), date formatting (DateFormatUtil), string sanitization (StringSanitizeUtil).
 */
@Component({
  selector: 'app-employee-form',
  imports: [
    CommonModule,
    InputFieldReactiveComponent,
    LabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    DatePickerReactiveComponent,
    SelectReactiveComponent,
  ],
  templateUrl: './employee-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;
  @Input() isEditMode = false;

  @Output() submitForm = new EventEmitter<CreateEmployeeDto | UpdateEmployeeDto>();
  @Output() cancelForm = new EventEmitter<void>();

  // Derived from EMPLOYEE_POSITIONS to guarantee TypeScript exhaustiveness
  readonly positionOptions: SelectOption[] = EMPLOYEE_POSITIONS.map(p => ({ value: p, label: p }));

  readonly statusOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  readonly genderOptions: SelectOption[] = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
  ];

  form!: FormGroup;
  isSubmitted = false;

  ngOnInit(): void {
    this.form = this.buildForm();
    if (this.employee) {
      this.populateForm(this.employee);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee && this.form) {
      this.populateForm(this.employee);
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.buildDto());
  }

  onCancel(): void {
    this.form.reset();
    this.isSubmitted = false;
    this.cancelForm.emit();
  }

  /**
   * Returns whether a control should show its error state.
   * Reusable from template: shouldShowError(form.get('dni')!)
   */
  shouldShowError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }

  getHint(controlName: string): string | undefined {
    const control = this.form.get(controlName);
    if (!control || !this.shouldShowError(control)) return undefined;
    return FormValidationUtil.getErrorMessage(controlName, control.errors);
  }

  get formTitle(): string {
    return this.isEditMode ? 'Editar Empleado' : 'Registrar Nuevo Empleado';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Guardar Cambios' : 'Registrar Empleado';
  }

  // --- Private helpers ---

  private buildForm(): FormGroup {
    return new FormGroup({
      firstName:   new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName:    new FormControl('', [Validators.required, Validators.minLength(2)]),
      dni:         new FormControl('', [Validators.required, DocumentValidators.dni()]),
      ruc:         new FormControl('', [DocumentValidators.ruc()]),
      gender:      new FormControl<Gender | null>(null, [Validators.required]),
      birthDate:   new FormControl('', [DateValidators.minAge(18)]),
      phoneNumber: new FormControl('', [Validators.required, ContactValidators.phone()]),
      email:       new FormControl('', [Validators.email]),
      address:     new FormControl(''),
      position:    new FormControl<EmployeePosition | null>(null, [Validators.required]),
      isActive:    new FormControl<boolean | null>(null, [Validators.required]),
    });
  }

  private populateForm(employee: Employee): void {
    this.form.patchValue({
      ...employee,
      birthDate: employee.birthDate ? DateFormatUtil.toInputFormat(employee.birthDate) : '',
    });
  }

  /**
   * Builds the DTO from form values.
   * Note: CreateEmployeeDto and UpdateEmployeeDto are currently identical.
   * If UpdateEmployeeDto diverges (e.g. removes 'dni'), split this back into two methods.
   */
  private buildDto(): CreateEmployeeDto {
    const v = this.form.value as EmployeeFormData;
    return {
      firstName:   v.firstName.trim(),
      lastName:    v.lastName.trim(),
      dni:         v.dni.trim(),
      ruc:         StringSanitizeUtil.toStringOrNull(v.ruc),
      gender:      v.gender as Gender,
      birthDate:   v.birthDate ? DateFormatUtil.toApiFormat(v.birthDate) : null,
      address:     StringSanitizeUtil.toStringOrNull(v.address),
      phoneNumber: StringSanitizeUtil.toStringOrNull(v.phoneNumber),
      email:       StringSanitizeUtil.toStringOrNull(v.email),
      isActive:    v.isActive,
      position:    v.position as EmployeePosition,
    };
  }
}