import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/cart'; // Your backend cart route

  constructor(private http: HttpClient) {}

  // Fetch cart by user ID
  getCartByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  // Fetch cart by user email
  getCartByEmail(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/email/${userId}`);
  }

  // Add item to cart
  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, { userId, productId, quantity });
  }

  // Remove item from cart
  removeFromCart(email: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${email}/${productId}`);
  }

  // Update cart item quantity
  updateCartQuantity(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}`, { userId, productId, quantity });
  }
}
