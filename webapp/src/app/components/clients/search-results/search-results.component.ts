import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CartService } from '../../../services/cart/cart.service';  // Import CartService
import { AuthService } from '../../../services/auth/auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  userId: string | null = null; // Store the authenticated user ID
  loading: boolean = false;
  noResults: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService, // Inject CartService
    private authService: AuthService, // Inject AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch user info for authentication
    this.fetchUserInfo();

    this.route.queryParams.subscribe((params) => {
      const query = params['query'] || '';
      const categoryName = params['category'] || '';

      this.fetchCategories(query, categoryName);
    });
  }

  // Fetch user info and set userId
  private fetchUserInfo(): void {
    const user = this.authService.getAuthenticatedUserInfo();
    if (user && (user._id || user.id)) {
      this.userId = user._id || user.id; // Prioritize _id for MongoDB
    } else {
      console.warn('User not authenticated.');
      this.userId = null;
    }
  }

  // Fetch categories based on query parameters
  fetchCategories(query: string, categoryName: string): void {
    this.loading = true;
    this.noResults = false;

    this.productService.getCategories().subscribe({
      next: (categories: any[]) => {
        this.categories = categories;
        const category = this.categories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        const categoryId = category ? category._id : '';
        if (categoryId) {
          this.fetchProductsByCategoryId(query, categoryId);
        } else {
          this.fetchAllProducts(query);
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loading = false;
      },
    });
  }

  fetchProductsByCategoryId(query: string, categoryId: string): void {
    this.productService.getProductsByCategoryId(categoryId).subscribe({
      next: (products: any[]) => {
        this.products = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        this.noResults = this.products.length === 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products by category:', err);
        this.loading = false;
      },
    });
  }

  fetchAllProducts(query: string): void {
    this.productService.getProducts().subscribe({
      next: (products: any[]) => {
        this.products = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        this.noResults = this.products.length === 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching all products:', err);
        this.loading = false;
      },
    });
  }

  // Add product to cart (Logic reused from HomeComponent)
  addToCart(product: any): void {
    if (!this.userId) {
      alert('User not authenticated!');
      return;
    }

    const quantity = 1; // Default quantity set to 1

    this.cartService.addToCart(this.userId, product._id, quantity).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        alert('Product added to cart!');
      },
      error: (err) => {
        console.error('Failed to add product to cart:', err);
        alert('An error occurred while adding to cart.');
      },
    });
  }

  viewDetails(product: any): void {
    if (product && product._id) {
      this.router.navigate(['/product-details', product._id]);
    } else {
      console.error('Product does not have _id or is undefined:', product);
    }
  }
}
