import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  price: number;
  categoryId: string; // This is linked with categoryId
  images?: string[];
  shortDescription?: string;
  description?: string;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000/product';
  private readonly categoryUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get all products by categoryId
  getProductsByCategoryId(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
}


  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  getCommentsByProductId(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/comments`);
  }

  submitProductComment(productId: string, comment: { userName: string; text: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/comment`, comment);
  }

  submitProductRating(productId: string, ratingPayload: { userId: string, userName: string, rating: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/rating`, ratingPayload);
  }

  getRatingByProductId(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/comments`);
  }

  // Get a product by its ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Add a new product
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Update an existing product
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Delete a product by its ID
  deleteProductById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
