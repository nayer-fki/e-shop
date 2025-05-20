import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Get user information from local storage
    const user = this.authService.getUserInfoFromStorage();

    // If user is not authenticated or not an admin, redirect to login
    if (!user || !user.isAdmin) {
      this.router.navigate(['/admin/login']); // Redirect to admin login if user is not admin
      return false;
    }

    // Allow access if the user is an admin
    return true;
  }
}
