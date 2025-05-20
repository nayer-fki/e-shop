import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service'; // Import your AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Get the Router instance using inject
  const authService = inject(AuthService); // Get the AuthService instance using inject

  // Retrieve token from localStorage using AuthService
  const token = authService.getToken();

  // Check if the token exists (indicating that the user is authenticated)
  if (token) {
    return true; // Allow access if the user is authenticated
  }

  // If not authenticated, redirect to the login page and pass the returnUrl as queryParams
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
