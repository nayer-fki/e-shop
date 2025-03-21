import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../types/user';

@Component({
  selector: 'app-admin-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-update.component.html',
  styleUrls: ['./admin-update.component.scss'],
})
export class AdminUpdateComponent implements OnInit {
  user: User = { name: '', email: '', isAdmin: false, image: '' };
  userId: string | null = null;
  alertMessage: string = '';
  alertMessageType: 'success' | 'error' = 'error';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (!this.userId) {
      this.alertMessage = 'Invalid user ID provided.';
      this.alertMessageType = 'error';
      this.navigateToAdmin();
      return;
    }
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.userService.getUserById(this.userId!).subscribe({
      next: (user) => {
        console.log('User fetched:', user);
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.alertMessage = 'Failed to load user details.';
        this.alertMessageType = 'error';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.user.name || !this.user.email) {
      this.alertMessage = 'Name and email are required.';
      this.alertMessageType = 'error';
      return;
    }

    if (this.userId) {
      this.loading = true;
      this.userService.updateUser(this.userId, this.user).subscribe({
        next: () => {
          this.alertMessage = 'User updated successfully!';
          this.alertMessageType = 'success';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/admin-users']), 2000);
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.alertMessage = 'Failed to update user.';
          this.alertMessageType = 'error';
          this.loading = false;
        },
      });
    }
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin/admin-users']).catch((err) => {
      console.error('Navigation error:', err);
      this.alertMessage = 'Failed to navigate to admin users.';
      this.alertMessageType = 'error';
    });
  }
}
