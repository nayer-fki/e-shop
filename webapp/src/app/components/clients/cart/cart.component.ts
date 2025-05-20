import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../services/order/orders.service';
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Holds the cart items
  userId: string | null = null; // User's email (used as ID)
  total: number = 0; // Holds total price of the cart
  quantity: number = 1; // Default product quantity to add

  constructor(
    private cartService: CartService,
    private authService: AuthService, // AuthService for authentication
    private router: Router,
    private ordersService: OrdersService // OrdersService to handle orders
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  // Check if the user is authenticated
  private checkAuthentication(): void {
    this.userId = this.authService.getUserInfoFromStorage()?.email || null;
    if (!this.userId) {
      console.warn('No user authenticated! Redirecting to login page...');
      this.router.navigate(['/login']); // Redirect to login
    } else {
      this.getCartItems(); // Fetch cart items
    }
  }

  // Fetch cart items for the user
  private getCartItems(): void {
    if (!this.userId) return;
    this.cartService.getCartByEmail(this.userId).subscribe(
      (response: any) => {
        console.log('Cart items fetched:', response);
        this.cart = response.products.map((product: any) => ({
          ...product,
          product: product.productId, // Access the product details via productId
        }));
        this.calculateTotal(); // Update the total price
      },
      (error: HttpErrorResponse) => {
        console.error('Error retrieving cart items:', error.message);
      }
    );
  }

  // Calculate total cart value
  private calculateTotal(): void {
    this.total = this.cart.reduce((acc, item) => {
      const price = item.product?.price?.$numberDecimal || 0; // Safe access to price
      const quantity = item.quantity || 1;
      return acc + price * quantity; // Sum up the total
    }, 0);
  }

  // Add a product to the cart
  addToCart(productId: string): void {
    if (!this.userId) return;
    this.cartService.addToCart(this.userId, productId, this.quantity).subscribe(
      (response: any) => {
        console.log('Product added to cart:', response);
        this.getCartItems(); // Refresh cart
      },
      (error: HttpErrorResponse) => {
        console.error('Error adding product to cart:', error.message);
      }
    );
  }

  // Remove a product from the cart
  removeFromCart(productId: string): void {
    if (!this.userId) return;
    this.cartService.removeFromCart(this.userId, productId).subscribe(
      (response: any) => {
        console.log('Product removed from cart:', response);
        this.getCartItems(); // Refresh cart
      },
      (error: HttpErrorResponse) => {
        console.error('Error removing product from cart:', error.message);
      }
    );
  }

  // Checkout and create an order
  checkout(): void {
    if (!this.userId) return;

    const order = {
      email: this.userId,
      products: this.cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: this.total,
      status: 'pending',
      orderDate: new Date().toISOString(),
    };

    this.ordersService.createOrder(order).subscribe(
      (response: any) => {
        console.log('Order created successfully:', response);
        this.router.navigate(['/order-confirmation', response._id]); // Navigate to confirmation page
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating order:', error.message);
      }
    );
  }
}
