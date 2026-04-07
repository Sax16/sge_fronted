import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
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
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';

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

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, formData).pipe(
      tap((response: AuthResponse) =>   {
        this.saveToken(response.access_token, credentials.rememberMe || false);
      })
    );
  }

  
  // Potential methods to add later:
  // signUp()
  // logout()
  // getCurrentUser()
  
  private saveToken(token: string, rememberMe?: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
