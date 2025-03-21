import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service'; // Adjust path if necessary
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  errorMessage: string = '';  // Make sure this is declared as a string

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form with default values
    this.userProfileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image: ['']  // Optional field for image URL
    });
  }

  ngOnInit(): void {
    // Fetch the user profile on component initialization
    this.getUserProfile();
  }

  // Get user profile data from the service
  getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (response) => {
        if (response?.data) {
          this.userProfileForm.patchValue({
            name: response.data.name || '',
            email: response.data.email || '',
            image: response.data.image || ''
          });
        } else {
          this.errorMessage = 'Profile data not found.';
        }
      },
      (error) => {
        console.error('Error fetching profile data:', error);
        this.errorMessage = 'Error fetching profile data. Please try again later.';
      }
    );
  }

  // Update user profile data
  updateUserProfile(): void {
    if (this.userProfileForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const updatedData = this.userProfileForm.value;
    this.userService.updateUserProfile(updatedData).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        this.router.navigate(['/profile']);  // Navigate to the profile page after successful update
      },
      (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Error updating profile. Please try again later.';
      }
    );
  }
}
