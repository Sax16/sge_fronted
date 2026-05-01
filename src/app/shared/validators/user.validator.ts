import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * User Validators
 * Pure validator functions for user-specific fields.
 * Follows the same pattern as DocumentValidators, ContactValidators, etc.
 */
export class UserValidators {

  private static readonly USERNAME_MIN = 4;
  private static readonly USERNAME_MAX = 15;
  private static readonly USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

  private static readonly PASSWORD_MIN = 6;
  private static readonly PASSWORD_MAX = 15;

  /**
   * Validates username format:
   * - Between 4 and 15 characters
   * - Only alphanumeric characters and underscores (a-z, A-Z, 0-9, _)
   */
  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null; // Required validator handles empty

      if (value.length < this.USERNAME_MIN || value.length > this.USERNAME_MAX) {
        return { invalidUsername: { value, message: `El usuario debe tener entre ${this.USERNAME_MIN} y ${this.USERNAME_MAX} caracteres` } };
      }

      if (!this.USERNAME_PATTERN.test(value)) {
        return { invalidUsername: { value, message: 'El usuario solo puede contener letras, números y guiones bajos' } };
      }

      return null;
    };
  }

  /**
   * Validates password length:
   * - Between 6 and 15 characters
   */
  static password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null; // Required validator handles empty

      if (value.length < this.PASSWORD_MIN || value.length > this.PASSWORD_MAX) {
        return { invalidPassword: { value, message: `La contraseña debe tener entre ${this.PASSWORD_MIN} y ${this.PASSWORD_MAX} caracteres` } };
      }

      return null;
    };
  }
}
