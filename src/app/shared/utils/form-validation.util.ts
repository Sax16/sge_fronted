import { ValidationErrors } from '@angular/forms';

export class FormValidationUtil {
  /**
   * Obtiene el mensaje de error para mostrar en base al fallo de validación detectado por Angular
   * @param fieldName - Nombre del campo a validar, útil para mensajes en hardcoded
   * @param errors    - Objeto global de erores del control asociado a ese input
   */
  static getErrorMessage(fieldName: string, errors: ValidationErrors | null): string | undefined {
    if (!errors) return undefined;

    const errorKey = Object.keys(errors)[0];
    
    // Tratamos los validadores internos (nativos) de Angular
    if (errorKey === 'required') {
      return this.getRequiredFieldMessage(fieldName);
    }
    
    if (errorKey === 'email') {
      return 'El correo no tiene un formato válido';
    }

    if (errorKey === 'minlength') {
      const requiredLength = errors[errorKey].requiredLength;
      return `Debe contener al menos ${requiredLength} caracteres`;
    }

    // Tratamos los custom validators generados donde adjuntamos un { message: string }
    if (errors[errorKey]?.message) {
      return errors[errorKey].message;
    }

    // Fallback genérico
    return 'El campo contiene un valor inválido';
  }

  /**
   * Traducciones/Diccionario hardcoded para los campos requeridos
   */
  private static getRequiredFieldMessage(fieldName: string): string {
    const fieldMessages: Record<string, string> = {
      // Employee fields
      firstName: 'El nombre es obligatorio',
      lastName: 'El apellido es obligatorio',
      dni: 'El DNI es obligatorio',
      gender: 'El género es obligatorio',
      phoneNumber: 'El número de celular es obligatorio',
      email: 'El correo es obligatorio',
      isActive: 'El estado es obligatorio',
      position: 'La responsabilidad es obligatoria',
      // User fields
      username: 'El nombre de usuario es obligatorio',
      password: 'La contraseña es obligatoria',
      role: 'El rol es obligatorio',
      employeeId: 'El empleado es obligatorio',
    };

    return fieldMessages[fieldName] || 'Este campo es obligatorio';
  }
}
