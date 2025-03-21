import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: string; // Optional, as it's generated on the server
  name: string;
  price: number;
  categoryId: string; // Category is required
  images?: string[]; // Optional, as not every product may have images
  shortDescription?: string; // Optional description field
  description?: string; // Optional description field
  discount?: number; // Optional discount field
}

export interface Category {
  id: string; // Assuming this is the ID for the category
  name: string; // Name of the category
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000/product'; // API URL for products
  private readonly categoryUrl = 'http://localhost:3000/category'; // API URL for categories

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
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
    // Make sure to exclude fields that should not be updated if they are undefined
    const updatedProduct: Product = {
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      images: product.images || [],
      shortDescription: product.shortDescription,
      description: product.description,
      discount: product.discount,
    };

    // Send the updated product details
    return this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct);
  }

  // Delete a product by its ID
  deleteProductById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
