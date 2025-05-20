import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Import Router for navigation
import { AuthService } from '../../services/auth/auth.service'; // Import the AuthService

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],  // Add any necessary imports
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router  // Inject Router
  ) {}

  /**
   * Handle logout with confirmation
   */
  logout(): void {
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {
      // Call the logout method from AuthService
      this.authService.logout();  // Simply call logout without passing 'user-email'

      // Redirect to login page after logout
      this.router.navigate(['/admin/login']);
    } else {
      console.log('Logout cancelled');
    }
  }
}
