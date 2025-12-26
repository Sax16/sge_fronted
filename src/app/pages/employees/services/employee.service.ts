import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeTableViewModel,
} from '../models/employee.model';

/**
 * Employee Service
 * Implements Single Responsibility Principle (SRP) - Handles only employee data operations
 * Implements Dependency Inversion Principle (DIP) - Depends on abstractions (interfaces)
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // In-memory storage for demo purposes (would be replaced with HTTP calls)
  private employees: Employee[] = this.getMockEmployees();

  /**
   * Get all employees
   * @returns Observable of employee array
   */
  getAllEmployees(): Observable<Employee[]> {
    return of(this.employees).pipe(delay(300));
  }

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Observable of employee or error
   */
  getEmployeeById(id: string): Observable<Employee> {
    const employee = this.employees.find((emp) => emp.id === id);

    if (!employee) {
      return throwError(() => new Error(`Employee with ID ${id} not found`));
    }

    return of(employee).pipe(delay(300));
  }

  /**
   * Create new employee
   * @param dto - Create employee data transfer object
   * @returns Observable of created employee or error
   */
  createEmployee(dto: CreateEmployeeDto): Observable<Employee> {
    try {
      const newEmployee: Employee = {
        id: this.generateEmployeeId(),
        ...dto,
        createdAt: new Date(),
      };

      this.employees = [...this.employees, newEmployee];
      return of(newEmployee).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to create employee'));
    }
  }

  /**
   * Update existing employee
   * @param id - Employee ID
   * @param dto - Update employee data transfer object
   * @returns Observable of updated employee or error
   */
  updateEmployee(
    id: string,
    dto: UpdateEmployeeDto
  ): Observable<Employee> {
    const index = this.employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Employee with ID ${id} not found`));
    }

    try {
      const updatedEmployee: Employee = {
        ...this.employees[index],
        ...dto,
      };

      this.employees = [
        ...this.employees.slice(0, index),
        updatedEmployee,
        ...this.employees.slice(index + 1),
      ];

      return of(updatedEmployee).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to update employee'));
    }
  }

  /**
   * Delete employee
   * @param id - Employee ID
   * @returns Observable of void or error
   */
  deleteEmployee(id: string): Observable<void> {
    const index = this.employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Employee with ID ${id} not found`));
    }

    try {
      this.employees = [
        ...this.employees.slice(0, index),
        ...this.employees.slice(index + 1),
      ];

      return of(void 0).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to delete employee'));
    }
  }

  /**
   * Get employees as table view models
   * @returns Observable of employee table view models
   */
  getEmployeesForTable(): Observable<EmployeeTableViewModel[]> {
    return this.getAllEmployees().pipe(
      map((employees) => employees.map(this.mapToTableViewModel))
    );
  }

  /**
   * Map employee to table view model
   * @param employee - Employee entity
   * @returns Employee table view model
   */
  private mapToTableViewModel(employee: Employee): EmployeeTableViewModel {
    return {
      id: employee.id,
      fullName: `${employee.firstName} ${employee.lastName}`,
      dni: employee.dni,
      phoneNumber: employee.phoneNumber,
      email: employee.email,
      position: employee.position,
      status: employee.isActive,
      createdAt: employee.createdAt.toLocaleDateString('es-PE'),
    };
  }

  /**
   * Generate unique employee ID
   * @returns Unique employee ID
   */
  private generateEmployeeId(): string {
    const prefix = 'EMP';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Get mock employees for demo
   * @returns Array of mock employees
   */
  private getMockEmployees(): Employee[] {
    return [
      {
        id: 'EMP001',
        firstName: 'Juan',
        lastName: 'Pérez García',
        dni: '12345678',
        ruc: '10123456781',
        gender: 'MALE',
        birthDate: new Date('1990-05-15'),
        address: 'Av. Principal 123, Lima',
        phoneNumber: '987654321',
        email: 'juan.perez@empresa.com',
        isActive: 'ACTIVE',
        position: 'ADMIN',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'EMP002',
        firstName: 'María',
        lastName: 'López Fernández',
        dni: '87654321',
        gender: 'FEMALE',
        birthDate: new Date('1992-08-20'),
        address: 'Jr. Secundario 456, Callao',
        phoneNumber: '912345678',
        email: 'maria.lopez@empresa.com',
        isActive: 'ACTIVE',
        position: 'CASHIER',
        createdAt: new Date('2024-02-10'),
      },
      {
        id: 'EMP003',
        firstName: 'Carlos',
        lastName: 'Rodríguez Silva',
        dni: '11223344',
        ruc: '10112233441',
        gender: 'MALE',
        birthDate: new Date('1988-12-10'),
        address: 'Calle Tercera 789, Miraflores',
        phoneNumber: '998877665',
        email: 'carlos.rodriguez@empresa.com',
        isActive: 'INACTIVE',
        position: 'WAREHOUSE',
        createdAt: new Date('2024-01-20'),
      },
      {
        id: 'EMP004',
        firstName: 'Ana',
        lastName: 'Martínez Torres',
        dni: '55667788',
        gender: 'FEMALE',
        birthDate: new Date('1995-03-25'),
        address: 'Av. Los Olivos 321, San Isidro',
        phoneNumber: '955443322',
        email: 'ana.martinez@empresa.com',
        isActive: 'ACTIVE',
        position: 'SELLER',
        createdAt: new Date('2024-03-05'),
      },
      {
        id: 'EMP005',
        firstName: 'Luis',
        lastName: 'González Ramos',
        dni: '99887766',
        gender: 'MALE',
        birthDate: new Date('1991-07-18'),
        address: 'Jr. Las Flores 654, Surco',
        phoneNumber: '966554433',
        email: 'luis.gonzalez@empresa.com',
        isActive: 'INACTIVE',
        position: 'SELLER',
        createdAt: new Date('2024-02-28'),
      },
    ];
  }
}
