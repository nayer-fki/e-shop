import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../services/user/user.service';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  image?: string;
}

@Component({
  selector: 'app-user-admin-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-admin-form.component.html',
  styleUrls: ['./user-admin-form.component.scss'],
})
export class UserAdminFormComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    image: '',
  };

  alertMessage: string = '';
  alertMessageType: 'success' | 'error' = 'success';

  constructor(private userService: UserService, private router: Router) {}

  addUser(): void {
    // Log the user data to verify form input
    console.log('Form Data:', this.user);

    // Prepare the user data object (using formData if image is provided)
    const userData: User = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      isAdmin: this.user.isAdmin,
      image: this.user.image || undefined, // Optional image field
    };

    // Call the service to create the user
    this.userService.createUser(userData).subscribe({
      next: () => {
        this.showAlert('User created successfully!', 'success');
        this.router.navigate(['/admin/admin-users']);
      },
      error: (err) => this.showAlert(`Error creating user: ${err.message}`, 'error'),
    });
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertMessageType = type;
    setTimeout(() => (this.alertMessage = ''), 3000);
    this.router.navigate(['/admin/admin-users']);
  }
}
