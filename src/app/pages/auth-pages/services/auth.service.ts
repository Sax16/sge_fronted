import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, BehaviorSubject, switchMap } from "rxjs";
import { environment } from "../../../../environments/environment";
import { SigninDto, AuthResponse } from "../models/auth.model";
import { User } from "../../users/models/user.model";

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

  // User state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  // Observable to subscribe to user changes
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al refrescar la página, el componente se destruye pero el servicio vuelve a nacer.
    // Verificamos si aún tenemos un token válido guardado:
    if (this.isAuthenticated()) {
      this.getCurrentUser().subscribe({
        error: (err) => {
          console.error('Error al restaurar la sesión del usuario:', err);
          this.logout();
        }
      });
    }
  }

  /**
   * Authenticate a user
   * @param credentials - User credentials
   * @returns Observable of authentication response with token
   */
  signIn(credentials: SigninDto): Observable<User> {
    const formData = new FormData();
    // FastAPI's OAuth2PasswordRequestForm exactly expects 'username' and 'password'
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, formData).pipe(
      tap((response: AuthResponse) =>   {
        this.saveToken(response.access_token, credentials.rememberMe || false);
      }),
      // Get user data after successful login
      switchMap(() => this.getCurrentUser())
    );
  }


  
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

  /**
   * Decodes the JWT payload and checks the `exp` claim against current time.
   * No external library needed — JWT payload is plain base64-encoded JSON.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // `exp` is in seconds (Unix timestamp); Date.now() is in milliseconds
      return payload.exp * 1000 < Date.now();
    } catch {
      // Malformed token → treat as expired
      return true;
    }
  }

  /**
   * Returns true only if a token exists AND it has not yet expired.
   * Auto-cleans storage when an expired token is found.
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/login/me`).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  public getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
