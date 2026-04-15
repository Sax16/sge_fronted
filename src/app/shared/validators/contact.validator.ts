import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ContactValidators {
  /**
   * Valida el número telefónico celular (Perú: 9 dígitos iniciando por 9)
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      
      if (!value) {
        return null;
      }

      // Remover espacios posibles antes de validar la máscara
      const cleanValue = value.replace(/\s+/g, '');
      const isValid = /^9\d{8}$/.test(cleanValue);
      
      if (!isValid) {
        return { 
          invalidPhone: { 
            value, 
            message: 'El teléfono debe ser un número móvil válido de 9 dígitos (comenzando con 9)' 
          } 
        };
      }

      return null;
    };
  }
}
