import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
    try {
      return this.deleteEmployeeFromApi(id);
    } catch (error) {
      return throwError(() => new Error('Failed to delete employee'));
    }
  }

  /**
   * Delete employee from API
   * @param id - Employee ID
   * @returns Observable of void from backend
   */
  private deleteEmployeeFromApi(id: number): Observable<void> {
    const url = `http://localhost:8000/employees/${id}`;
    return this.http.delete<void>(url);
  }
}
