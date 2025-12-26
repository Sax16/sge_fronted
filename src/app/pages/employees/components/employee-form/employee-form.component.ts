import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import {InputFieldReactiveComponent } from "../../../../shared/components/reactive-form/input/input-field-reactive.component";
import { DatePickerReactiveComponent } from '../../../../shared/components/reactive-form/date-picker-reactive/date-picker-reactive.component';
import { SelectReactiveComponent } from '../../../../shared/components/reactive-form/select-reactive/select-reactive.component';

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
export class EmployeeFormComponent {

  optionsPosition = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'CASHIER', label: 'Cajero' },
    { value: 'WAREHOUSE', label: 'Almacenero' },
    { value: 'SELLER', label: 'Vendedor' },
  ];

  optionsStatus = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' },
  ];

  optionsGender = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
  ];

  @Output() submitForm = new EventEmitter<void>();

  submitted = false;

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
    ruc: new FormControl('', []),
    gender: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', []),
    phoneNumber: new FormControl('', []),
    email: new FormControl('', [Validators.email]),
    address: new FormControl('', []),
    position: new FormControl('', []),
    isActive: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.submitted = true;

    // Validate the form before emitting the event
    if (this.employeeForm.invalid) {
      alert('Por favor, complete los campos obligatorios correctamente.');
      return;
    }

    this.submitForm.emit();
  }

  get emailCtrl() {
    return this.employeeForm.get('email')!;
  }


  // Method to get email hint message
  getEmailHint(): string | undefined {
    const control = this.emailCtrl;

    if (!(control.touched || this.submitted)) return undefined;

    if (control.hasError('required')) {
      return 'El correo es obligatorio';
    }

    if (control.hasError('email')) {
      return 'El correo no tiene un formato válido';
    }

    return undefined;
  }


}