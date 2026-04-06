import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LabelComponent } from '../../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { CheckboxReactiveComponent } from '../../../../../shared/components/reactive-form/checkbox-reactive/checkbox-reactive.component';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LabelComponent,
    ButtonComponent,
    InputFieldReactiveComponent,
    CheckboxReactiveComponent,
  ],
  templateUrl: './signin-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninFormComponent {
  
  showPassword = false;
  isSubmitted = false;

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  get emailControl(): AbstractControl {
    return this.signinForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.signinForm.get('password')!;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  shouldShowError(control: any): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }

  onSignIn() {
    this.isSubmitted = true;

    if (this.signinForm.invalid) {
      return;
    }

    console.log('Email:', this.signinForm.value.email);
    console.log('Password:', this.signinForm.value.password);
    console.log('Remember Me:', this.signinForm.value.rememberMe);
  }
}
