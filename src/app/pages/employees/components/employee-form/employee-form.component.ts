import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { DatePickerReactiveComponent } from '../../../../shared/components/reactive-form/date-picker-reactive/date-picker-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { EmployeeValidationService } from '../../services/employee-validation.service';
import { CreateEmployeeDto, UpdateEmployeeDto, Employee, EmployeeFormData, Gender, EmployeePosition } from '../../models/employee.model';

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
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;
  @Input() isEditMode = false;
  
  @Output() submitForm = new EventEmitter<CreateEmployeeDto | UpdateEmployeeDto>();
  @Output() cancelForm = new EventEmitter<void>();

  readonly positionOptions: SelectOption[] = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Cajero', label: 'Cajero' },
    { value: 'Almacenero', label: 'Almacenero' },
    { value: 'Vendedor', label: 'Vendedor' },
  ];

  readonly statusOptions: SelectOption[] = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
  ];

  readonly genderOptions: SelectOption[] = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
  ];

  employeeForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(private validationService: EmployeeValidationService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee && this.employeeForm) {
      this.populateForm(this.employee);
    }
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
      position: new FormControl<EmployeePosition | ''>('', [Validators.required]),
      isActive: new FormControl(false, [Validators.required]),
    });

    // Populate form if employee data exists
    if (this.employee) {
      this.populateForm(this.employee);
    }
  }

  /**
   * Populate form with employee data
   * @param employee - Employee to populate form with
   */
  private populateForm(employee: Employee): void {
    this.employeeForm.patchValue({
      name: employee.firstName,
      lastName: employee.lastName,
      dni: employee.dni,
      ruc: employee.ruc || '',
      gender: employee.gender,
      birthDate: employee.birthDate ? this.formatDateForInput(employee.birthDate) : '',
      phoneNumber: employee.phoneNumber,
      email: employee.email,
      address: employee.address,
      position: employee.position,
      isActive: employee.isActive,
    });
  }

  /**
   * Format date for input field
   * @param date - Date to format
   * @returns Formatted date string
   */
  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
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

    const employeeData = this.isEditMode 
      ? this.buildUpdateDto() 
      : this.buildCreateDto();
    
    this.submitForm.emit(employeeData);
    
    if (!this.isEditMode) {
      this.resetForm();
    }
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
  private buildCreateDto(): CreateEmployeeDto {
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
      isActive: formValue.isActive,
      position: formValue.position as EmployeePosition,
    };
  }

  /**
   * Build UpdateEmployeeDto from form data
   * @returns UpdateEmployeeDto object
   */
  private buildUpdateDto(): UpdateEmployeeDto {
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
      isActive: formValue.isActive,
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

  /**
   * Get form title based on mode
   * @returns Form title
   */
  getFormTitle(): string {
    return this.isEditMode ? 'Editar Empleado' : 'Registrar Nuevo Empleado';
  }

  /**
   * Get submit button text based on mode
   * @returns Button text
   */
  getSubmitButtonText(): string {
    if (this.isLoading) {
      return this.isEditMode ? 'Actualizando...' : 'Guardando...';
    }
    return this.isEditMode ? 'Actualizar Empleado' : 'Guardar Cambios';
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