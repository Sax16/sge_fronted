import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { SelectOption } from '../../../../shared/models/select-option.model';
import { UserValidators } from '../../../../shared/validators/user.validator';
import { FormErrorHelper } from '../../../../shared/utils/form-error.helper';
import { User, CreateUserDto, UpdateUserDto, Role, UserFormModel, ROLES } from '../../models/user.model';
import { Employee } from '../../../employees/models/employee.model';
import { STATUS_OPTIONS } from '../../../../shared/constants/status-options.constant';

/**
 * User Form Component
 * Handles user create/edit form logic.
 * Delegates: validation (shared/validators/), error messages (FormValidationUtil).
 */
@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    InputFieldReactiveComponent,
    LabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SelectReactiveComponent,
  ],
  templateUrl: './user-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Input() isEditMode = false;
  @Input() employees: Employee[] = [];
  @Input() employeeFullName = '';
  
  @Output() submitForm = new EventEmitter<CreateUserDto | UpdateUserDto>();
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  formErrors!: FormErrorHelper;
  isSubmitted = false;
  showPassword = false;

  readonly roleOptions: SelectOption[] = ROLES;

  readonly statusOptions: SelectOption[] = STATUS_OPTIONS;

  ngOnInit(): void {
    this.form = this.buildForm();
    this.formErrors = new FormErrorHelper(this.form, () => this.isSubmitted);
    if (this.user) {
      this.populateForm(this.user);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user && this.form) {
      this.populateForm(this.user);
    }
  }

  get employeeOptions(): SelectOption[] {
    return this.employees.filter(emp => emp.isActive).map(emp => ({
      value: String(emp.id),
      label: `${emp.firstName} ${emp.lastName}`
    }));
  }

  get employeePlaceholder(): string {
    return this.isEditMode && this.employeeFullName
      ? this.employeeFullName
      : 'Seleccionar Empleado';
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userData = this.isEditMode 
      ? this.buildUpdateDto() 
      : this.buildCreateDto();
    
    this.submitForm.emit(userData);
  }

  onCancel(): void {
    this.form.reset();
    this.isSubmitted = false;
    this.cancelForm.emit();
  }



  get formTitle(): string {
    return this.isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Guardar Cambios' : 'Registrar Usuario';
  }

  // --- Private helpers ---

  private buildForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required, UserValidators.username()]),
      password: new FormControl('', this.isEditMode ? [UserValidators.password()] : [Validators.required, UserValidators.password()]),
      role: new FormControl<Role | null>(null, [Validators.required]),
      employeeId: new FormControl<string | null>(null, [Validators.required]),
      isActive: new FormControl<boolean | null>(true, [Validators.required]),
    });
  }

  private populateForm(user: User): void {
    this.form.patchValue({
      username: user.username,
      role: user.role,
      employeeId: String(user.employeeId),
      isActive: user.isActive,
    });
    
    if (this.isEditMode) {
      // In edit mode, password is optional — only validate format if entered
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.setValidators([UserValidators.password()]);
      this.form.get('password')?.updateValueAndValidity();

      // Employee cannot be changed via API — disable control and show name as placeholder
      const employeeCtrl = this.form.get('employeeId');
      employeeCtrl?.setValue(null);
      employeeCtrl?.clearValidators();
      employeeCtrl?.updateValueAndValidity();
      employeeCtrl?.disable();
    }
  }

  private buildCreateDto(): CreateUserDto {
    const formValue = this.form.value as UserFormModel;
    
    return {
      username: formValue.username.trim(),
      password: formValue.password,
      role: formValue.role,
      employeeId: Number(formValue.employeeId),
      isActive: formValue.isActive,
    };
  }

  private buildUpdateDto(): UpdateUserDto {
    const formValue = this.form.value as UserFormModel;
    
    const dto: UpdateUserDto = {
      username: formValue.username.trim(),
      role: formValue.role,
      isActive: formValue.isActive,
    };

    // Only add password if it was entered
    if (formValue.password) {
      dto.password = formValue.password;
    }

    return dto;
  }
}
