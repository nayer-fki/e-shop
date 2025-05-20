import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'http://localhost:3000/wishlist';

  constructor(private http: HttpClient) {}

  // Get wishlist for a user
  getWishlist(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  // Add a product to the wishlist
  addToWishlist(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { userId, productId });
  }

  // Remove a product from the wishlist
  removeFromWishlist(email: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${email}/${productId}`);
  }


  // Clear wishlist for a user
  clearWishlist(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`);
  }
}
