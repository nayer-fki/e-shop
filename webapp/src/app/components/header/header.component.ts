import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CategoryService } from '../../services/category/category.service';
import { CartService } from '../../services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { User } from '../../types/user';

// Define Cart structure to use the proper data types
interface Cart {
  totalItems: number;
  totalPrice: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  categories: Array<{ id: string; name: string }> = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  searchSuggestions: string[] = [];
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';
  userAvatar: string = 'default-avatar.png';
  profileDropdownVisible: boolean = false;
  userId: string = ''; // Add userId to identify the logged-in user
  cartTotalItems: number = 0; // Total items in the cart
  cartTotalPrice: number = 0; // Total price of the cart

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.fetchCategories();
    this.loadCart();
  }

  // Check login status and set the userId
  checkLoginStatus(): void {
    const storedUserInfo: User | null = this.authService.getUserInfoFromStorage();
    if (storedUserInfo) {
      this.isLoggedIn = this.authService.isAuthenticated();
      this.userEmail = storedUserInfo.email ?? '';
      this.userName = storedUserInfo.name ?? 'Guest';
      this.userAvatar = storedUserInfo.image ?? 'default-avatar.png';
      this.userId = storedUserInfo._id ?? '';
      console.log(storedUserInfo?._id);

    } else {
      this.isLoggedIn = false;
    }
    console.log(storedUserInfo);
  }

  // Fetch categories for the dropdown
  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any[]) => {
        this.categories = data.map((item) => ({
          id: item.id,
          name: item.name,
        }));
      },
      error: (err: any) => console.error('Error fetching categories:', err),
    });
  }

  // Load cart details when the user logs in
  loadCart(): void {
    if (this.isLoggedIn && this.userId) {
      this.cartService.getCartByEmail(this.userId).subscribe({
        next: (cart: Cart) => {
          this.cartTotalItems = cart.totalItems || 0;
          this.cartTotalPrice = cart.totalPrice || 0;
        },
        error: (err: any) => {
          console.error('Error loading cart:', err);
        },
      });
    }
  }


  // Search products
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.productService.getProducts().subscribe({
        next: (products: any[]) => {
          // Filter products based on search query and selected category
          let filteredProducts = products.filter((product) => {
            const matchesName = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesCategory =
              this.selectedCategory === 'all' || product.categoryId === this.selectedCategory;

            return matchesName && matchesCategory;
          });

          if (filteredProducts.length === 1) {
            // Navigate to product details page if only one product matches
            const productId = filteredProducts[0].id;
            this.router.navigate(['/product', productId]);
          } else {
            // Store filtered products and navigate to search result page
            localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
            this.router.navigate(['/search-result'], { queryParams: { query: this.searchQuery } });
          }

          this.searchSuggestions = filteredProducts.map((p) => p.name);
        },
        error: (err: any) => {
          console.error('Search error:', err);
        },
      });
    } else {
      this.searchSuggestions = [];
    }
  }

  // Add product to cart
  addToCart(productId: string, quantity: number): void {
    if (this.isLoggedIn && this.userId) {
      this.cartService.addToCart(this.userId, productId, quantity).subscribe({
        next: (cart: Cart) => {
          this.cartTotalItems = cart.totalItems;
          this.cartTotalPrice = cart.totalPrice;
        },
        error: (err: any) => {
          console.error('Error adding product to cart:', err);
        },
      });
    } else {
      console.log('User not logged in');
      this.router.navigate(['/login']);
    }
  }

  // Toggle profile dropdown visibility
  toggleProfileDropdown(): void {
    this.profileDropdownVisible = !this.profileDropdownVisible;
  }

  // Log out user
  confirmLogout(): void {
    if (window.confirm('Are you sure you want to log out?')) {
      this.onLogout();
    }
  }

  // Add the method to handle suggestion click
  onSuggestionClick(suggestion: string): void {
    this.productService.getProducts().subscribe({
      next: (products: any[]) => {
        const product = products.find(
          (p) => p.name.toLowerCase() === suggestion.toLowerCase()
        );

        if (product) {
          // Navigate to product details using the product ID
          this.router.navigate(['/product', product.id]);
        }
      },
      error: (err: any) => console.error('Error finding product for suggestion:', err),
    });
    this.searchSuggestions = [];
  }


// Add the method to handle category selection change
onCategoryChange(): void {
  this.productService.getProducts().subscribe({
    next: (products: any[]) => {
      // Filter products based only on selected category
      const filteredProducts = products.filter((product) =>
        this.selectedCategory === 'all' || product.categoryId === this.selectedCategory
      );

      // Save filtered products to local storage
      localStorage.setItem('searchResults', JSON.stringify(filteredProducts));

      // Navigate to the search-result page with query parameters for selected category
      this.router.navigate(['/search-result'], { queryParams: { category: this.selectedCategory } });
    },
    error: (err: any) => console.error('Error filtering by category:', err),
  });
}






  onLogout(): void {
    this.authService.logout();
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
