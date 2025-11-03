import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../pages/features/auth/auth.service';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let headers = {};

  if (!authService.check()) return next(req);
  if (!req.url.includes('auth')) {
    headers = {
        setHeaders: {
          Authorization: `Bearer ${authService.getAccessToken()?.replace(/"/g, '')}`,
        },
    }
};

  const clonedRequest = req.clone(headers);

  return next(clonedRequest);
};
