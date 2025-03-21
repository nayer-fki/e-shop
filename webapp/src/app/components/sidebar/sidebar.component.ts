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
      this.authService.logout().subscribe({
        next: () => {
          // Redirect to login page after successful logout
          this.router.navigate(['/admin/login']);
        },
        error: (err) => {
          console.error('Logout failed', err); // Handle error if needed
        }
      });
    } else {
      console.log('Logout cancelled');
    }
  }
}
