import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any = { name: '', profileImage: '' };
  isLoading: boolean = true;
  searchLoading: boolean = false; // Added loading state for search
  errorMessage: string = '';
  searchQuery: string = ''; // Holds the search input
  searchResults: any[] = []; // Stores the search results

  constructor(
    private authService: AuthService, 
    private userService: UserService, 
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser).user || {};
        this.isLoading = false;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        this.isLoading = false;
      }
    } else {
      this.fetchUserData();
    }
  }

  private fetchUserData(): void {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.user = response.user || {};
        localStorage.setItem('user', JSON.stringify(response));
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load user data';
        console.error('Error fetching user data:', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery); // Debug log
    if (this.searchQuery.trim()) {
      this.searchLoading = true; // Show loading indicator for search
      this.userService.searchUsers(this.searchQuery).subscribe(
        (results: any[]) => {
          this.searchResults = results;
          console.log('Search results:', this.searchResults);
          this.searchLoading = false; // Hide loading indicator
          this.cdRef.detectChanges(); // Manually trigger change detection
        },
        (error) => {
          console.error('Search error:', error);
          this.errorMessage = 'Error fetching search results';
          this.searchLoading = false; // Hide loading indicator
        }
      );
    } else {
      this.searchResults = []; // Clear results when search input is empty
      console.log('Search cleared');
      this.searchLoading = false; // Hide loading indicator
      this.cdRef.detectChanges(); // Manually trigger change detection
    }
  }

  selectResult(result: any): void {
    console.log('Selected result:', result); // Handle the result selection here
  }
}
