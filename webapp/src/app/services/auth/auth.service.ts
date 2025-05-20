import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // API URL for auth

  constructor(private http: HttpClient) {}

  /**
   * Login with email and password for a specific user
   * @param email User email
   * @param password User password
   * @returns Observable of the login response
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError(this.handleError),
      tap((response) => {
        // Store token for the specific user on successful login
        if (response?.token && response?.user) {
          this.saveToken(response.token);
          this.saveUserInfo(response.user);
        }
      })
    );
  }

  /**
   * Register a new user
   * @param user User details (e.g., email, name, password, etc.)
   * @returns Observable of the registration response
   */
  register(user: User): Observable<any> {
    // Send email as userId and handle the rest of the properties
    return this.http.post<any>(`${this.apiUrl}/register`, {
      email: user.email,
      name: user.name,
      password: user.password,
      isAdmin: user.isAdmin || false, // Default isAdmin to false if not provided
      image: user.image || '', // Optional image URL
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get the current user's information based on email
   * @param email User email
   * @returns Observable containing the user's details or null if not found
   */
  getUserInfo(email: string): Observable<User | null> {
    const token = this.getToken(); // Get token for the specific user
    if (!token) {
      console.warn('User is not authenticated');
      return of(null); // Return null if the user is not authenticated
    }

    // Add token to headers for authentication
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`, // Pass the user's token in the Authorization header
      }),
    }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  /**
 * Check if the user is authenticated and if user info is available
 * @returns User's information if authenticated, null otherwise
 */
  public getAuthenticatedUserInfo(): any | null {
    // Retrieve 'authToken' and 'userInfo' from localStorage
    const token = localStorage.getItem('authToken');  // Replace 'authToken' with actual key if needed
    const userInfo = localStorage.getItem('userInfo');  // Replace 'userInfo' with actual key if needed

    // Check if token or user info doesn't exist
    if (!token || !userInfo) {
      console.warn('No token or user info found in localStorage');
      return null;  // Return null if user is not authenticated
    }

    try {
      // Attempt to parse userInfo into an object
      const parsedUserInfo = JSON.parse(userInfo);

      // Check if required properties exist in the parsed user info (e.g., _id or email)
      if (parsedUserInfo && parsedUserInfo.email && parsedUserInfo.id) {
        // User info is valid
        console.log('User Info:', parsedUserInfo);
        return parsedUserInfo;  // Return the parsed user info object
      } else {
        console.error('Invalid user info in localStorage: Missing required properties');
        return null;  // Return null if the required properties are missing
      }
    } catch (error) {
      // Catch JSON parsing errors (if the JSON is malformed)
      console.error('Error parsing user info from localStorage:', error);
      return null;
    }
  }


  /**
   * Save the token in local storage
   * @param token JWT token
   */
  private saveToken(token: string): void {
    localStorage.setItem('authToken', token); // Store token globally for now (consider user-specific storage for multi-user support)
  }

  /**
   * Get the token from local storage
   * @returns JWT token
   */
  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Remove the token from local storage
   */
  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Check if the user is logged in based on token availability
   * @returns boolean indicating if the user is logged in
   */
  public isAuthenticated(): boolean {
    return !!this.getToken(); // Check if a token exists
  }

  /**
   * Save the user's information in local storage
   * @param user User data
   */
  private saveUserInfo(user: User): void {
    localStorage.setItem('userInfo', JSON.stringify(user)); // Store user info globally for now (consider user-specific storage for multi-user support)
  }

  /**
   * Get the user's information from local storage
   * @returns User data or null if not found
   */
  getUserInfoFromStorage(): User | null {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Logout the user by clearing the stored authentication data
   */
  logout(): void {
    // Clear authentication-related data from localStorage
    this.clearToken();
    localStorage.removeItem('userInfo');
  }

  /**
   * Error handling for HTTP requests
   * @param error HTTP error response
   * @returns Observable with error message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error: ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
