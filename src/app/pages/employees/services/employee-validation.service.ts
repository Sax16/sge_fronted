import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidationResult, ValidationError } from '../models/employee.model';

/**
 * Employee Validation Service
 * Implements Single Responsibility Principle (SRP) - Handles only validation logic
 * Implements Open/Closed Principle (OCP) - Open for extension, closed for modification
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeValidationService {
  /**
   * Validate DNI format (8 digits for Peru)
   * @param dni - DNI string
   * @returns true if valid, false otherwise
   */
  isValidDni(dni: string): boolean {
    if (!dni) return false;
    return /^\d{8}$/.test(dni);
  }

  /**
   * Validate RUC format (11 digits for Peru)
   * @param ruc - RUC string
   * @returns true if valid, false otherwise
   */
  isValidRuc(ruc: string): boolean {
    if (!ruc) return true; // RUC is optional
    return /^\d{11}$/.test(ruc);
  }

  /**
   * Validate email format
   * @param email - Email string
   * @returns true if valid, false otherwise
   */
  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (9 digits for Peru mobile)
   * @param phoneNumber - Phone number string
   * @returns true if valid, false otherwise
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber) return false;
    return /^9\d{8}$/.test(phoneNumber.replace(/\s+/g, ''));
  }

  /**
   * Validate age (minimum 18 years old)
   * @param birthDate - Birth date
   * @returns true if valid, false otherwise
   */
  isValidAge(birthDate: Date | null): boolean {
    if (!birthDate) return true; // Birth date is optional
    
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  }

  /**
   * Custom validator for DNI field
   * @param control - Form control
   * @returns Validation errors or null
   */
  dniValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null; // Let required validator handle empty values
    }

    if (!this.isValidDni(value)) {
      return { invalidDni: { value, message: 'El DNI debe tener 8 dígitos' } };
    }

    return null;
  };

  /**
   * Custom validator for RUC field
   * @param control - Form control
   * @returns Validation errors or null
   */
  rucValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null; // RUC is optional
    }

    if (!this.isValidRuc(value)) {
      return { invalidRuc: { value, message: 'El RUC debe tener 11 dígitos' } };
    }

    return null;
  };

  /**
   * Custom validator for phone number field
   * @param control - Form control
   * @returns Validation errors or null
   */
  phoneValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null; // Let required validator handle empty values
    }

    if (!this.isValidPhoneNumber(value)) {
      return { 
        invalidPhone: { 
          value, 
          message: 'El teléfono debe ser un número móvil válido (9 dígitos, comenzando con 9)' 
        } 
      };
    }

    return null;
  };

  /**
   * Custom validator for age field
   * @param control - Form control
   * @returns Validation errors or null
   */
  ageValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null; // Birth date is optional
    }

    const birthDate = new Date(value);
    
    if (!this.isValidAge(birthDate)) {
      return { 
        invalidAge: { 
          value, 
          message: 'El empleado debe tener al menos 18 años' 
        } 
      };
    }

    return null;
  };

  /**
   * Validate complete employee form data
   * @param formData - Employee form data
   * @returns Validation result
   */
  validateEmployeeForm(formData: Record<string, unknown>): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (!formData['name']) {
      errors.push({ field: 'name', message: 'El nombre es obligatorio' });
    }

    if (!formData['lastName']) {
      errors.push({ field: 'lastName', message: 'El apellido es obligatorio' });
    }

    if (!formData['dni']) {
      errors.push({ field: 'dni', message: 'El DNI es obligatorio' });
    } else if (!this.isValidDni(formData['dni'] as string)) {
      errors.push({ field: 'dni', message: 'El DNI debe tener 8 dígitos' });
    }

    if (!formData['gender']) {
      errors.push({ field: 'gender', message: 'El género es obligatorio' });
    }

    if (!formData['isActive']) {
      errors.push({ field: 'isActive', message: 'El estado es obligatorio' });
    }

    // Validate optional fields with format validation
    if (formData['ruc'] && !this.isValidRuc(formData['ruc'] as string)) {
      errors.push({ field: 'ruc', message: 'El RUC debe tener 11 dígitos' });
    }

    if (formData['email'] && !this.isValidEmail(formData['email'] as string)) {
      errors.push({ field: 'email', message: 'El correo no tiene un formato válido' });
    }

    if (formData['phoneNumber'] && !this.isValidPhoneNumber(formData['phoneNumber'] as string)) {
      errors.push({ 
        field: 'phoneNumber', 
        message: 'El teléfono debe ser un número móvil válido' 
      });
    }

    if (formData['birthDate'] && !this.isValidAge(formData['birthDate'] as Date)) {
      errors.push({ 
        field: 'birthDate', 
        message: 'El empleado debe tener al menos 18 años' 
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

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
      name: 'El nombre es obligatorio',
      lastName: 'El apellido es obligatorio',
      dni: 'El DNI es obligatorio',
      gender: 'El género es obligatorio',
      email: 'El correo es obligatorio',
      isActive: 'El estado es obligatorio',
    };

    return fieldMessages[fieldName] || 'Este campo es obligatorio';
  }
}
