import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LabelComponent } from '../../../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { InputFieldReactiveComponent } from '../../../../../shared/components/reactive-form/input/input-field-reactive.component';
import { CheckboxReactiveComponent } from '../../../../../shared/components/reactive-form/checkbox-reactive/checkbox-reactive.component';
import { SigninDto } from '../../../models/auth.model';

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
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  get usernameControl(): AbstractControl {
    return this.signinForm.get('username')!;
  }

  get passwordControl(): AbstractControl {
    return this.signinForm.get('password')!;
  }

  @Output() signInSubmitted = new EventEmitter<SigninDto>();

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

    const value = this.signinForm.value;
    
    this.signInSubmitted.emit({
      username: value.username || '',
      password: value.password || '',
      rememberMe: value.rememberMe
    });
  }
}
