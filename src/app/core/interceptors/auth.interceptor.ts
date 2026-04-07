import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Leemos directamente del storage para evitar Inyección Circular (NG0200)
  // ya que AuthService usa HttpClient y el Interceptor usa AuthService.
  const TOKEN_KEY = 'access_token';
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
