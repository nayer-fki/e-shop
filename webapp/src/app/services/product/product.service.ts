import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../types/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = "http://localhost:3000/product"; // Base URL for the API

  constructor(private http: HttpClient) {} // Use constructor injection for HttpClient

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Fetch a single product by its ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`); // Correct response type
  }

  // Add a new product
  addProduct(model : Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, { name });
  }

  // Update an existing product
  updateProduct(id: string, model : Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, { name });
  }

  // Delete a product by its ID
  deleteProductById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
