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
    return this.http.get<Employee[]>(url);
  }

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Observable of employee or error
   */
  getEmployeeById(id: number): Observable<Employee> {
    const employee = this.fetchEmployeeByIdFromApi(id);

    if (!employee) {
      return throwError(() => new Error(`Employee with ID ${id} not found`));
    }

    return employee;
  }

  /**
   * Fetch employee by ID from API
   * @param id - Employee ID
   * @returns Observable of employee from backend
   */
  private fetchEmployeeByIdFromApi(id: number): Observable<Employee> {
    const url = `http://localhost:8000/employees/${id}`;
    return this.http.get<Employee>(url);
  }

  /**
   * Create new employee
   * @param dto - Create employee data transfer object
   * @returns Observable of created employee or error
   */
  createEmployee(newEmployee: CreateEmployeeDto): Observable<Employee> {
    try {
      return this.postEmployeeToApi(newEmployee);

    } catch (error) {
      return throwError(() => new Error('Failed to create employee'));
    }
  }

  /**
   * Post new employee to API
   * @param dto - Create employee data transfer object
   * @returns Observable of created employee from backend
   */
  private postEmployeeToApi(dto: CreateEmployeeDto): Observable<Employee> {
    const url = 'http://localhost:8000/employees';
    return this.http.post<Employee>(url, dto);
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

    try {
      return this.putEmployeeToApi(id, dto);
    } catch (error) {
      return throwError(() => new Error('Failed to update employee'));
    }
  }

  /**
   * Put updated employee to API
   * @param id - Employee ID
   * @param dto - Update employee data transfer object
   * @returns Observable of updated employee from backend
   */
  private putEmployeeToApi(id: number, dto: UpdateEmployeeDto): Observable<Employee> {
    const url = `http://localhost:8000/employees/${id}`;
    return this.http.put<Employee>(url, dto);
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
        birthDate: '1990-05-15',
        address: 'Av. Principal 123, Lima',
        phoneNumber: '987654321',
        email: 'juan.perez@empresa.com',
        isActive: true,
        position: 'Docente',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ];
  }
}
