import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register-clients',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-register-clients.component.html',
  styleUrls: ['./login-register-clients.component.scss']
})
export class LoginRegisterClientsComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  isRegistering: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.clearMessage();
  }

  onLogin() {
    this.isLoading = true;  // Show loading indicator
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Store token and user information
        localStorage.setItem('token', response.token);
        this.setMessage('Login successful!', 'success');
        this.clearForm();  // Clear form fields

        // Assuming the response contains user data including isAdmin
        const isAdmin = response.user.isAdmin;  // Adjust according to the actual response structure

        this.redirectUser(isAdmin);  // Redirect based on role
      },
      (error) => {
        this.setMessage('Login failed. Please check your credentials.', 'error');
        console.error('Login failed:', error);
      },
      () => {
        this.isLoading = false;  // Hide loading indicator
      }
    );
  }

  onRegister() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: false  // Adjust as needed based on your registration logic
    };

    this.isLoading = true;  // Show loading indicator
    this.authService.register(user).subscribe(
      (response) => {
        this.setMessage('Registration successful! Redirecting to login...', 'success');
        this.clearForm();  // Clear form fields
        setTimeout(() => {
          this.toggleForm();  // Switch to login form
        }, 2000);  // Wait 2 seconds before switching
      },
      (error) => {
        this.setMessage('Registration failed. Please try again.', 'error');
        console.error('Registration failed:', error);
      },
      () => {
        this.isLoading = false;  // Hide loading indicator
      }
    );
  }

  private setMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);  // Clear the message after 5 seconds
  }

  private clearMessage() {
    this.message = '';
    this.messageType = '';
  }

  private clearForm() {
    this.email = '';
    this.password = '';
    this.name = '';  // Clear form fields after login/register
  }

  // New method to redirect based on role
  private redirectUser(isAdmin: boolean): void {
    if (isAdmin) {
      this.router.navigate(['/admin/dashboard']); // Admin dashboard
    } else {
      this.router.navigate(['']); // Client dashboard (or home)
    }
  }
}
