import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
} from "../models/user.model";

/**
 * User Service
 * Implements Single Responsibility Principle (SRP) - Handles only user data operations
 * Implements Dependency Inversion Principle (DIP) - Depends on abstractions (interfaces)
 */
@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get all users
   * @returns Observable of user array
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns Observable of user
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new user
   * @param newUser - Create user data transfer object
   * @returns Observable of created user
   */
  createUser(newUser: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, newUser);
  }

  /**
   * Update existing user
   * @param id - User ID
   * @param dto - Update user data transfer object
   * @returns Observable of updated user
   */
  updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete user
   * @param id - User ID
   * @returns Observable of void
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}