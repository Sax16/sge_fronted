import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * User Validators
 * Pure validator functions for user-specific fields.
 * Follows the same pattern as DocumentValidators, ContactValidators, etc.
 */
export class UserValidators {

  /**
   * Validates username format (minimum 4 characters).
   * @returns ValidatorFn
   */
  static username(minLength = 4): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null; // Required validator handles empty

      if (value.length < minLength) {
        return { invalidUsername: { value, message: `El usuario debe tener al menos ${minLength} caracteres` } };
      }

      return null;
    };
  }

  /**
   * Validates password strength (minimum 6 characters).
   * @returns ValidatorFn
   */
  static password(minLength = 6): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null; // Required validator handles empty

      if (value.length < minLength) {
        return { invalidPassword: { value, message: `La contraseña debe tener al menos ${minLength} caracteres` } };
      }

      return null;
    };
  }
}
