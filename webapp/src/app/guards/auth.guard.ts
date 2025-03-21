import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Use Angular's `inject` to get the Router instance
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Check if the user is logged in
  if (user && user.token) {
    return true; // Allow access if the user is authenticated
  }

  // Redirect to the login page if not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
