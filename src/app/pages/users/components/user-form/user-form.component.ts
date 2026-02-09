import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';
import { UserValidationService } from '../../services/user-validation.service';
import { User, CreateUserDto, UpdateUserDto, Role, UserFormModel } from '../../models/user.model';
import { Employee } from '../../../employees/models/employee.model';

interface SelectOption {
  value: string | boolean;
  label: string;
}

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
  
  @Output() submitForm = new EventEmitter<CreateUserDto | UpdateUserDto>();
  @Output() cancelForm = new EventEmitter<void>();

  userForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  showPassword = false;

  readonly roleOptions: SelectOption[] = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  readonly statusOptions: SelectOption[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  constructor(private validationService: UserValidationService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user && this.userForm) {
      this.populateForm(this.user);
    }
  }

  get employeeOptions(): SelectOption[] {
    return this.employees.map(emp => ({
      value: String(emp.id),
      label: `${emp.firstName} ${emp.lastName}`
    }));
  }

  private initializeForm(): void {
    this.userForm = new FormGroup({
      userName: new FormControl('', [Validators.required, this.validationService.userNameValidator]),
      password: new FormControl('', this.isEditMode ? [] : [Validators.required, this.validationService.passwordValidator]),
      role: new FormControl<Role | null>(null, [Validators.required]),
      employeeId: new FormControl<string | null>(null, [Validators.required]),
      isActive: new FormControl<boolean | null>(true, [Validators.required]),
    });

    if (this.user) {
      this.populateForm(this.user);
    }
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      userName: user.userName,
      password: user.password,
      role: user.role,
      employeeId: String(user.employeeId),
      isActive: user.isActive,
    });
    
    // In edit mode, password is optional
    if (this.isEditMode) {
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.setValidators([this.validationService.passwordValidator]); // Only validate format if entered
        this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (!this.isFormValid()) {
      this.showValidationError();
      return;
    }

    const userData = this.isEditMode 
      ? this.buildUpdateDto() 
      : this.buildCreateDto();
    
    this.submitForm.emit(userData);
    
    if (!this.isEditMode) {
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelForm.emit();
  }

  private isFormValid(): boolean {
    return this.userForm.valid;
  }

  private showValidationError(): void {
    alert('Por favor, complete los campos obligatorios correctamente.');
  }

  private buildCreateDto(): CreateUserDto {
    const formValue = this.userForm.value as UserFormModel;
    
    return {
      userName: formValue.userName.trim(),
      password: formValue.password,
      role: formValue.role,
      employeeId: Number(formValue.employeeId),
      isActive: formValue.isActive,
    };
  }

  private buildUpdateDto(): UpdateUserDto {
    const formValue = this.userForm.value as UserFormModel;
    
    const dto: UpdateUserDto = {
      userName: formValue.userName.trim(),
      role: formValue.role,
      employeeId: Number(formValue.employeeId),
      isActive: formValue.isActive,
    };

    // Only add password if it was entered
    if (formValue.password) {
        dto.password = formValue.password;
    }

    return dto;
  }

  private resetForm(): void {
    this.userForm.reset();
    this.isSubmitted = false;
    // Reset default status
    this.userForm.patchValue({ isActive: true }); // REVIEW
  }

  getFormTitle(): string {
    return this.isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario';
  }

  getSubmitButtonText(): string {
    if (this.isLoading) {
      return this.isEditMode ? 'Actualizando...' : 'Guardando...';
    }
    return this.isEditMode ? 'Guardar Cambios' : 'Registrar Usuario';
  }

  // Getters
  get userNameControl(): AbstractControl { return this.getControl('userName'); }
  get passwordControl(): AbstractControl { return this.getControl('password'); }
  get roleControl(): AbstractControl { return this.getControl('role'); }
  get employeeIdControl(): AbstractControl { return this.getControl('employeeId'); }
  get isActiveControl(): AbstractControl { return this.getControl('isActive'); }

  private getControl(name: string): AbstractControl {
    const control = this.userForm.get(name);
    if (!control) throw new Error(`Control ${name} not found`);
    return control;
  }

  shouldShowError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }

  getUserNameHint(): string | undefined {
    return this.validationService.getErrorMessage('userName', this.userNameControl.errors);
  }
  
  getPasswordHint(): string | undefined {
    return this.validationService.getErrorMessage('password', this.passwordControl.errors);
  }
}
