import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DocumentValidators {
  /**
   * Valida el formato del DNI Peruano (8 dígitos)
   */
  static dni(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      
      // Permitimos nulo o vacío para que la obligación recaiga en Validators.required si lo hubiere
      if (!value) {
        return null; 
      }

      const isValid = /^\d{8}$/.test(value);
      if (!isValid) {
        return { invalidDni: { value, message: 'El DNI debe tener 8 dígitos' } };
      }

      return null;
    };
  }

  /**
   * Valida el formato del RUC Peruano (11 dígitos)
   */
  static ruc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      
      if (!value) {
        return null;
      }

      const isValid = /^(10|20)\d{9}$/.test(value);
      if (!isValid) {
        return { invalidRuc: { value, message: 'El RUC debe tener 11 dígitos y comenzar con 10 o 20' } };
      }

      return null;
    };
  }
}
