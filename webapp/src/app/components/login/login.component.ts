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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Changed to email
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Call the login method from AuthService with email and password
      this.authService.login(email, password).subscribe(
        (res) => {
          if (res.token) {  // Check if token is returned
            // Store token and isAdmin flag in localStorage
            localStorage.setItem('token', res.token);
            localStorage.setItem('isAdmin', JSON.stringify(res.user.isAdmin)); // Store isAdmin flag

            // Redirect based on user role
            if (res.user.isAdmin) {
              this.router.navigate(['/admin/dashboard']); // Redirect to admin dashboard
            } else {
              this.router.navigate(['/']); // Redirect to client home
            }
          } else {
            this.loginError = 'Login failed. Please check your credentials.'; // Show error message
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.loginError = error.error.message || 'An error occurred. Please try again later.'; // Show generic error message
        }
      );
    } else {
      this.loginError = 'Please fill in the form correctly.';
    }
  }
}
