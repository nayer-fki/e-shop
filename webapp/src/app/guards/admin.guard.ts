import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service'; // Adjust the path as per your project structure

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is authenticated (has a token)
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdmin = this.authService.isAdmin();

    if (isAuthenticated && isAdmin) {
      return true; // Allow access to admin routes
    }

    // If not authenticated, redirect to login
    this.router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url }, // Save the return URL for post-login redirection
    });
    return false;
  }
}
