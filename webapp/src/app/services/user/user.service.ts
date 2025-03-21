import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  _id?: string; // Optional for new user
  name: string;
  email: string;
  password?: string; // Optional, only during registration/login
  isAdmin: boolean;
  image?: string; // Optional
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/users'; // Base API URL for users

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<{ data: User[] }>(this.apiUrl).pipe(
      map((response) => response.data), // Extract the 'data' field
      catchError(this.handleError) // Apply error handling
    );
  }

  // Get a user by their ID
  getUserById(id: string): Observable<User> {
    return this.http.get<{ success: boolean; message: string; data: User }>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data), // Extract 'data' from the response
      catchError(this.handleError)
    );
  }
  

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing user
  updateUser(id: string, user: User): Observable<User> {
    // Send only the required fields to the API
    const updatedUser: Partial<User> = {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image || undefined,
    };

    return this.http.put<User>(`${this.apiUrl}/${id}`, updatedUser).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a user by their ID
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Search for users by query
  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?search=${query}`);
  }

  // Get user profile data
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      catchError(this.handleError)
    );
  }

  // Update user profile data
  updateUserProfile(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, userData).pipe(
      catchError(this.handleError)
    );
  }
  

  // Centralized error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error occurred:', error);
    const errorMessage = error.error?.message || 'An unexpected error occurred. Please try again.';
    return throwError(() => new Error(errorMessage));
  }
}
