import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { SigninDto, AuthResponse } from "../models/auth.model";

/**
 * Authentication Service
 * Implements Single Responsibility Principle (SRP) - Handles only authentication processes
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`; // Adjust endpoint according to your API structure

  constructor(private http: HttpClient) {}

  /**
   * Authenticate a user
   * @param credentials - User credentials
   * @returns Observable of authentication response with token
   */
  signIn(credentials: SigninDto): Observable<AuthResponse> {
    const formData = new FormData();
    // FastAPI's OAuth2PasswordRequestForm exactly expects 'username' and 'password'
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    // RememberMe is not standard in OAuth2PasswordRequestForm but we can pass it if the backend supports it
    if (credentials.rememberMe !== undefined && credentials.rememberMe !== null) {
      formData.append('rememberMe', credentials.rememberMe.toString());
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, formData);
  }

  // Potential methods to add later:
  // signUp()
  // logout()
  // getCurrentUser()
}
