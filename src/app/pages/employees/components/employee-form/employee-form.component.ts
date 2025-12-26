import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { DatePickerReactiveComponent } from '../../../../shared/components/reactive-form/date-picker-reactive/date-picker-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { EmployeeValidationService } from '../../services/employee-validation.service';
import { CreateEmployeeDto, EmployeeFormData, Gender, EmployeePosition, EmployeeStatus } from '../../models/employee.model';

/**
 * Select option interface for dropdowns
 */
interface SelectOption {
  value: string;
  label: string;
}

/**
 * Employee Form Component
 * Implements Single Responsibility Principle (SRP) - Handles only employee form logic
 * Implements Open/Closed Principle (OCP) - Extensible through validation service
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
  styles: ``
})
export class EmployeeFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<CreateEmployeeDto>();
  @Output() cancelForm = new EventEmitter<void>();

  readonly positionOptions: SelectOption[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'CASHIER', label: 'Cajero' },
    { value: 'WAREHOUSE', label: 'Almacenero' },
    { value: 'SELLER', label: 'Vendedor' },
  ];

  readonly statusOptions: SelectOption[] = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' },
  ];

  readonly genderOptions: SelectOption[] = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
  ];

  employeeForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(private validationService: EmployeeValidationService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize employee form with validators
   */
  private initializeForm(): void {
    this.employeeForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      dni: new FormControl('', [Validators.required, this.validationService.dniValidator]),
      ruc: new FormControl('', [this.validationService.rucValidator]),
      gender: new FormControl<Gender | ''>('', [Validators.required]),
      birthDate: new FormControl('', [this.validationService.ageValidator]),
      phoneNumber: new FormControl('', [this.validationService.phoneValidator]),
      email: new FormControl('', [Validators.email]),
      address: new FormControl('', []),
      position: new FormControl<EmployeePosition | ''>('', []),
      isActive: new FormControl<EmployeeStatus | ''>('', [Validators.required]),
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.isSubmitted = true;

    // Early return if form is invalid
    if (!this.isFormValid()) {
      this.showValidationError();
      return;
    }

    const employeeData = this.buildEmployeeDto();
    this.submitForm.emit(employeeData);
    this.resetForm();
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.resetForm();
    this.cancelForm.emit();
  }

  /**
   * Check if form is valid
   * @returns true if valid, false otherwise
   */
  private isFormValid(): boolean {
    return this.employeeForm.valid;
  }

  /**
   * Show validation error alert
   */
  private showValidationError(): void {
    alert('Por favor, complete los campos obligatorios correctamente.');
  }

  /**
   * Build CreateEmployeeDto from form data
   * @returns CreateEmployeeDto object
   */
  private buildEmployeeDto(): CreateEmployeeDto {
    const formValue = this.employeeForm.value as EmployeeFormData;
    
    return {
      firstName: formValue.name.trim(),
      lastName: formValue.lastName.trim(),
      dni: formValue.dni.trim(),
      ruc: formValue.ruc ? formValue.ruc.trim() : undefined,
      gender: formValue.gender as Gender,
      birthDate: formValue.birthDate ? new Date(formValue.birthDate) : null,
      address: formValue.address.trim(),
      phoneNumber: formValue.phoneNumber.trim(),
      email: formValue.email.trim(),
      isActive: formValue.isActive as EmployeeStatus,
      position: formValue.position as EmployeePosition,
    };
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    this.employeeForm.reset();
    this.isSubmitted = false;
  }

  // Getters for form controls (for template access)
  
  get nameControl(): AbstractControl {
    return this.getControl('name');
  }

  get lastNameControl(): AbstractControl {
    return this.getControl('lastName');
  }

  get dniControl(): AbstractControl {
    return this.getControl('dni');
  }

  get rucControl(): AbstractControl {
    return this.getControl('ruc');
  }

  get genderControl(): AbstractControl {
    return this.getControl('gender');
  }

  get birthDateControl(): AbstractControl {
    return this.getControl('birthDate');
  }

  get phoneNumberControl(): AbstractControl {
    return this.getControl('phoneNumber');
  }

  get emailControl(): AbstractControl {
    return this.getControl('email');
  }

  get addressControl(): AbstractControl {
    return this.getControl('address');
  }

  get positionControl(): AbstractControl {
    return this.getControl('position');
  }

  get isActiveControl(): AbstractControl {
    return this.getControl('isActive');
  }

  /**
   * Get form control by name
   * @param controlName - Control name
   * @returns Form control
   */
  private getControl(controlName: string): AbstractControl {
    const control = this.employeeForm.get(controlName);
    if (!control) {
      throw new Error(`Control ${controlName} not found`);
    }
    return control;
  }

  /**
   * Check if control has error and should show error message
   * @param control - Form control
   * @returns true if should show error, false otherwise
   */
  shouldShowError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }

  /**
   * Get error message for email field
   * @returns Error message or undefined
   */
  getEmailHint(): string | undefined {
    const control = this.emailControl;

    // Early return if no error to show
    if (!this.shouldShowError(control)) {
      return undefined;
    }

    return this.validationService.getErrorMessage('email', control.errors);
  }

  /**
   * Get error message for DNI field
   * @returns Error message or undefined
   */
  getDniHint(): string | undefined {
    const control = this.dniControl;

    // Early return if no error to show
    if (!this.shouldShowError(control)) {
      return undefined;
    }

    return this.validationService.getErrorMessage('dni', control.errors);
  }

  /**
   * Get error message for RUC field
   * @returns Error message or undefined
   */
  getRucHint(): string | undefined {
    const control = this.rucControl;

    // Early return if no error to show
    if (!this.shouldShowError(control)) {
      return undefined;
    }

    return this.validationService.getErrorMessage('ruc', control.errors);
  }

  /**
   * Get error message for phone field
   * @returns Error message or undefined
   */
  getPhoneHint(): string | undefined {
    const control = this.phoneNumberControl;

    // Early return if no error to show
    if (!this.shouldShowError(control)) {
      return undefined;
    }

    return this.validationService.getErrorMessage('phoneNumber', control.errors);
  }

  /**
   * Get error message for birth date field
   * @returns Error message or undefined
   */
  getBirthDateHint(): string | undefined {
    const control = this.birthDateControl;

    // Early return if no error to show
    if (!this.shouldShowError(control)) {
      return undefined;
    }

    return this.validationService.getErrorMessage('birthDate', control.errors);
  }
}