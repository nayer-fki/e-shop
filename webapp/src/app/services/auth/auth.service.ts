import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Use environment variable for production

  constructor(private http: HttpClient) {}

  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   * @returns Observable of the login response
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    // Check if token is stored in localStorage
    return !!localStorage.getItem('token');
  }

  /**
   * Logout the user
   * @returns Observable of the logout response
   */
  logout(): Observable<any> {
    // Clear token and isAdmin flag from localStorage
    this.clearToken();
    localStorage.removeItem('isAdmin');
  
    const token = localStorage.getItem('token'); // Assuming your token is stored in localStorage
  
    // Ensure token is available
    if (!token) {
      console.error('No token found');
      return throwError('No token found');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  /**
   * Register a new user
   * @param user User details (e.g., name, email, password, etc.)
   * @returns Observable of the registration response
   */
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get the current user's information from the backend
   * @returns Observable containing the user's details
   */
  getUserInfo(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }

    return this.http.get<User>('http://localhost:3000/auth/me', {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    }).pipe(catchError(this.handleError));
  }

  /**
   * Save the token in local storage
   * @param token JWT token
   */
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Get the token from local storage
   * @returns JWT token
   */
  getToken(): string | null {
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
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Return true if token exists
  }

  /**
   * Check if the user is an admin based on the stored role
   * @returns boolean indicating if the user is an admin
   */
  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true'; // Adjust logic based on how isAdmin is stored
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
