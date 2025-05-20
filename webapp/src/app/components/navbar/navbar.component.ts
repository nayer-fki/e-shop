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
  searchLoading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';
  searchResults: any[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.fetchUserData();
    } else {
      this.isLoading = false;
    }
  }

  private fetchUserData(): void {
    const storedUser = this.authService.getUserInfoFromStorage();
    if (storedUser) {
      this.user = storedUser;
      this.isLoading = false;
      console.log('User data from localStorage:', this.user);
    } else if (this.authService.isAuthenticated()) {
      this.authService.getUserInfo(this.user.email).subscribe(
        (response: any) => {
          this.user = response;
          this.isLoading = false;
          console.log('Fetched user data:', this.user);
        },
        (error) => {
          this.errorMessage = 'Failed to load user data';
          console.error('Error fetching user data:', error);
          this.isLoading = false;
        }
      );
    }
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    if (this.searchQuery.trim()) {
      this.searchLoading = true;
      this.userService.searchUsers(this.searchQuery).subscribe(
        (results: any[]) => {
          this.searchResults = results;
          console.log('Search results:', this.searchResults);
          this.searchLoading = false;
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Search error:', error);
          this.errorMessage = 'Error fetching search results';
          this.searchLoading = false;
        }
      );
    } else {
      this.searchResults = [];
      console.log('Search cleared');
      this.searchLoading = false;
      this.cdRef.detectChanges();
    }
  }

  selectResult(result: any): void {
    console.log('Selected result:', result);
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.user = { name: '', profileImage: '' }; // Reset user data
  }
}
