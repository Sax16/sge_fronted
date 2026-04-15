import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidators {
  /**
   * Valida si la fecha de entrada cumple con una edad mínima especificada.
   * Asume el formato de entrada de España/Latam: DD/MM/YYYY
   */
  static minAge(minYears: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      
      if (!value) {
        return null; 
      }

      const [day, month, year] = value.split('/');
      if (!day || !month || !year) {
         return { invalidAge: { value, message: 'Formato de fecha inválido. Intente DD/MM/YYYY' } };
      }

      const birthDate = new Date(+year, +month - 1, +day);
      const today = new Date();
      
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let isOldEnough = age >= minYears;
      
      // Si el mes actual es anterior al mes de nacimiento, 
      // o es el mismo mes pero el día actual es anterior, 
      // todavía no tiene el año cumplido entero.
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        isOldEnough = (age - 1) >= minYears;
      }

      if (!isOldEnough) {
        return { 
          invalidAge: { 
            value, 
            message: `Debe tener al menos ${minYears} años de edad` 
          } 
        };
      }

      return null;
    };
  }
}
