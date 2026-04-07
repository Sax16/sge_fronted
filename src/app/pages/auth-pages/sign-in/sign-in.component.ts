import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from './components/signin-form/signin-form.component';
import { AuthService } from '../services/auth.service';
import { SigninDto } from '../models/auth.model';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    AuthPageLayoutComponent,
    SigninFormComponent
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSignIn(credentials: SigninDto): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.signIn(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful', response);
          this.router.navigate(['/']); 
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.detail;
        }
      });
  }
}
