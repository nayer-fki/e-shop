import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';  // Variable to store error message
  loginSuccess: string = '';  // Variable to store success message
  isLoading: boolean = false;  // Show loading indicator

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email for login
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.isLoading = true;  // Show loading indicator

      // Call login method from AuthService
      this.authService.login(email, password).subscribe(
        (res) => {
          if (res.token) {
            // Store token and user info
            localStorage.setItem('token', res.token);
            localStorage.setItem('isAdmin', JSON.stringify(res.user.isAdmin));

            this.loginSuccess = 'Login successful! Redirecting...';
            setTimeout(() => {
              this.redirectUser(res.user.isAdmin); // Pass only the role flag
            }, 1500);
          } else {
            this.loginError = 'Invalid credentials. Please try again.';
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.handleLoginError(error);
        },
        () => {
          this.isLoading = false;  // Hide loading indicator
        }
      );
    } else {
      this.loginError = 'Please complete all required fields.';
    }

    // Clear messages after timeout
    this.clearMessages();
  }

  // Redirect user based on role
  private redirectUser(isAdmin: boolean): void {
    if (isAdmin) {
      this.router.navigate(['/admin/dashboard']); // Admin dashboard
    } else {
      this.router.navigate(['']); // Client dashboard (or home)
    }
  }

  // Handle error in login
  private handleLoginError(error: any): void {
    if (error && error.error && error.error.message) {
      this.loginError = error.error.message;
    } else {
      this.loginError = 'An unexpected error occurred. Please try again.';
    }
  }

  // Clear success and error messages after a timeout
  private clearMessages(): void {
    setTimeout(() => {
      this.loginError = '';
      this.loginSuccess = '';
    }, 5000); // Allow enough time for the user to read the messages
  }
}
