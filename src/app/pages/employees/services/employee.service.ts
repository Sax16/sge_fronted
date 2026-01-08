import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
  constructor(private http: HttpClient) {}

  /**
   * Get all employees
   * @returns Observable of employee array
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.fetchEmployeesFromApi();
  }

  /**
   * Fetch employees from API
   * @returns Observable of employee array from backend
   */
  private fetchEmployeesFromApi(): Observable<Employee[]> {
    const url = 'http://localhost:8000/employees';
    return this.http.get<Employee[]>(url)
      .pipe(
        // Adapt snake_case to camelCase if necessary
        
      )
      ;
  }

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Observable of employee or error
   */
  getEmployeeById(id: number): Observable<Employee> {
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
    id: number,
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
  deleteEmployee(id: number): Observable<void> {
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
  private generateEmployeeId(): number {
    // Simulate auto-increment ID from database
    const maxId = this.employees.length > 0 
      ? Math.max(...this.employees.map(emp => emp.id))
      : 0;
    return maxId + 1;
  }

  /**
   * Get mock employees for demo
   * @returns Array of mock employees
   */
  private getMockEmployees(): Employee[] {
    return [
      {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez García',
        dni: '12345678',
        ruc: '10123456781',
        gender: 'Masculino',
        birthDate: new Date('1990-05-15'),
        address: 'Av. Principal 123, Lima',
        phoneNumber: '987654321',
        email: 'juan.perez@empresa.com',
        isActive: true,
        position: 'Administrador',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        firstName: 'María',
        lastName: 'López Fernández',
        dni: '87654321',
        gender: 'Femenino',
        birthDate: new Date('1992-08-20'),
        address: 'Jr. Secundario 456, Callao',
        phoneNumber: '912345678',
        email: 'maria.lopez@empresa.com',
        isActive: true,
        position: 'Cajero',
        createdAt: new Date('2024-02-10'),
      },
      {
        id: 3,
        firstName: 'Carlos',
        lastName: 'Rodríguez Silva',
        dni: '11223344',
        ruc: '10112233441',
        gender: 'Masculino',
        birthDate: new Date('1988-12-10'),
        address: 'Calle Tercera 789, Miraflores',
        phoneNumber: '998877665',
        email: 'carlos.rodriguez@empresa.com',
        isActive: false,
        position: 'Almacenero',
        createdAt: new Date('2024-01-20'),
      },
      {
        id: 4,
        firstName: 'Ana',
        lastName: 'Martínez Torres',
        dni: '55667788',
        gender: 'Femenino',
        birthDate: new Date('1995-03-25'),
        address: 'Av. Los Olivos 321, San Isidro',
        phoneNumber: '955443322',
        email: 'ana.martinez@empresa.com',
        isActive: true,
        position: 'Vendedor',
        createdAt: new Date('2024-03-05'),
      },
      {
        id: 5,
        firstName: 'Luis',
        lastName: 'González Ramos',
        dni: '99887766',
        gender: 'Masculino',
        birthDate: new Date('1991-07-18'),
        address: 'Jr. Las Flores 654, Surco',
        phoneNumber: '966554433',
        email: 'luis.gonzalez@empresa.com',
        isActive: false,
        position: 'Vendedor',
        createdAt: new Date('2024-02-28'),
      },
    ];
  }
}
