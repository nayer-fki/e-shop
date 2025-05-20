import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/whislist/wishlist.service';
import { OrdersService } from '../../services/order/orders.service';
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  userId: string | null = null; // User ID fetched dynamically

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private ordersService: OrdersService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve user information
    this.fetchUserInfo();

    this.categoryService.getCategories().subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    this.productService.getProducts().subscribe(
      (products: any[]) => {
        this.products = products;
        console.log('Products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

// Fetch the authenticated user's ID
// Function to retrieve and parse the user's information from localStorage
public getAuthenticatedUserInfo(): any | null {
  // Retrieve 'authToken' and 'userInfo' from localStorage
  const token = localStorage.getItem('authToken');
  const userInfo = localStorage.getItem('userInfo');

  // Check if token or user info doesn't exist
  if (!token || !userInfo) {
    console.warn('No token or user info found in localStorage');
    return null;  // Return null if user is not authenticated
  }

  try {
    // Attempt to parse userInfo into an object
    const parsedUserInfo = JSON.parse(userInfo);

    // Check if required properties exist in the parsed user info (e.g., id or email)
    if (parsedUserInfo && parsedUserInfo.email && parsedUserInfo.id) {
      // User info is valid
      console.log('User Info:', parsedUserInfo);
      return parsedUserInfo;  // Return the parsed user info object
    } else {
      console.error('Invalid user info in localStorage: Missing required properties');
      return null;  // Return null if the required properties are missing
    }
  } catch (error) {
    // Catch JSON parsing errors (if the JSON is malformed)
    console.error('Error parsing user info from localStorage:', error);
    return null;
  }
}

// Fetch the authenticated user's ID
private fetchUserInfo(): void {
  // Retrieve user info via the auth service method
  const user = this.authService.getAuthenticatedUserInfo();

  // Check if the user is authenticated and the ID is available
  if (user && (user._id || user.id)) {
    // Prioritize _id (MongoDB format) or fallback to id
    this.userId = user._id || user.id;
    console.log('User authenticated with ID:', this.userId); // Debugging statement
  } else {
    console.warn('User not authenticated or invalid user info in localStorage');
    this.userId = null; // Set userId to null if authentication is not successful or invalid data
  }
}



  logProductId(productId: string): void {
    console.log('Navigating to product details for ID:', productId);
  }

  addToCart(product: any): void {
    if (!this.userId) {
      alert('User not authenticated!');
      return;
    }

    const quantity = 1;

    this.cartService.addToCart(this.userId, product._id, quantity).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        alert('Product added to cart!');
      },
      error: (err) => {
        console.error('Failed to add product to cart:', err);
        alert('An error occurred while adding to cart.');
      }
    });
  }

  addToWishlist(product: any): void {
    if (!this.userId) {
      alert('User not authenticated!');
      return;
    }

    this.wishlistService.addToWishlist(this.userId, product._id).subscribe({
      next: (response) => {
        console.log('Product added to wishlist:', response);
        alert('Product added to wishlist!');
      },
      error: (err) => {
        console.error('Failed to add product to wishlist:', err);
        alert('An error occurred while adding to wishlist.');
      }
    });
  }

  createOrder(): void {
    if (!this.userId) {
      alert('User not authenticated!');
      return;
    }

    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (cart) => {
        const order = {
          userId: this.userId,
          items: cart.items,
          total: cart.total
        };
        this.ordersService.createOrder(order).subscribe({
          next: (response) => {
            console.log('Order created successfully:', response);
            alert('Order placed successfully!');
          },
          error: (err) => {
            console.error('Failed to place the order:', err);
            alert('An error occurred while placing the order.');
          }
        });
      },
      error: (err) => {
        console.error('Failed to retrieve cart:', err);
        alert('An error occurred while retrieving your cart.');
      }
    });
  }
}
