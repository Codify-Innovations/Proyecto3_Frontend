import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/features/auth/auth.service';

export const GuestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.check()) return true;

  router.navigateByUrl('/app/dashboard');
  return false;
};
