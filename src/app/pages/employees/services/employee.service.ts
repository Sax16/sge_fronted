import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '../models/employee.model';

/**
 * Employee Service
 * Implements Single Responsibility Principle (SRP) - Handles only employee data operations
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiBaseUrl}/employees`;
  
  constructor(private http: HttpClient) {}

  /**
   * Get all employees
   * @returns Observable of employee array
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Observable of employee
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new employee
   * @param newEmployee - Create employee data transfer object
   * @returns Observable of created employee
   */
  createEmployee(newEmployee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, newEmployee);
  }

  /**
   * Update existing employee
   * @param id - Employee ID
   * @param dto - Update employee data transfer object
   * @returns Observable of updated employee
   */
  updateEmployee(id: number, dto: UpdateEmployeeDto): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete employee
   * @param id - Employee ID
   * @returns Observable of void
   */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
