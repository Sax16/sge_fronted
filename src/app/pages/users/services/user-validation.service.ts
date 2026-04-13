import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * User Validation Service
 * Handles validation logic for user forms
 */
@Injectable({
  providedIn: 'root',
})
export class UserValidationService {

  /**
   * Validate password strength
   * @param password - Password string
   * @returns true if valid, false otherwise
   */
  isValidPassword(password: string): boolean {
    if (!password) return false;
    // At least 6 characters
    return password.length >= 6;
  }

  /**
   * Validate username format
   * @param username - username string
   * @returns true if valid, false otherwise
   */
  isValidUsername(username: string): boolean {
    if (!username) return false;
    return username.length >= 4;
  }

  /**
   * Custom validator for password field
   * @param control - Form control
   * @returns Validation errors or null
   */
  passwordValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null; // Required validator handles empty
    }

    if (!this.isValidPassword(value)) {
      return { invalidPassword: { value, message: 'La contraseña debe tener al menos 6 caracteres' } };
    }

    return null;
  };

  /**
   * Custom validator for username field
   * @param control - Form control
   * @returns Validation errors or null
   */
  usernameValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null;
    }

    if (!this.isValidUsername(value)) {
      return { invalidUsername: { value, message: 'El usuario debe tener al menos 4 caracteres' } };
    }

    return null;
  };

  /**
   * Get validation error message for a specific field
   * @param fieldName - Field name
   * @param errors - Form control errors
   * @returns Error message or undefined
   */
  getErrorMessage(
    fieldName: string,
    errors: ValidationErrors | null
  ): string | undefined {
    if (!errors) return undefined;

    const errorKey = Object.keys(errors)[0];
    
    if (errorKey === 'required') {
      return this.getRequiredFieldMessage(fieldName);
    }

    if (errors[errorKey]?.message) {
      return errors[errorKey].message;
    }

    return 'Campo inválido';
  }

  /**
   * Get required field message
   * @param fieldName - Field name
   * @returns Required field message
   */
  private getRequiredFieldMessage(fieldName: string): string {
    const fieldMessages: Record<string, string> = {
      username: 'El nombre de usuario es obligatorio',
      password: 'La contraseña es obligatoria',
      role: 'El rol es obligatorio',
      employeeId: 'El empleado es obligatorio',
      isActive: 'El estado es obligatorio',
    };

    return fieldMessages[fieldName] || 'Este campo es obligatorio';
  }
}
