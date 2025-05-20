import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../types/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  // Get all orders
  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

// Update order status (For Admin use)
updateOrderStatus(orderId: string, status: string): Observable<Order> {
  return this.http.put<Order>(`${this.baseUrl}/${orderId}/status`, { status });
}

  // Create a new order

   createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, order);
  }
  createOrders(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/creates`, order);
  }


  // Get an order by ID
  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}`);
  }

  // Update an order
  updateOrder(orderId: string, orderData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}`, orderData);
  }

  // Delete an order
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${orderId}`);
  }
}
