import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/order/orders.service';
import { ProductService } from '../../../services/product/product.service';
import { UserService } from '../../../services/user/user.service';  // Import UserService to fetch users
import { Router } from '@angular/router';
import { Order } from '../../../types/order';
import { Product } from '../../../types/product';
import { User } from '../../../types/user';  // Define a User interface
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  newOrder: Order = {
    _id: '',
    userId: '',
    userName: '',
    products: [],
    status: 'pending',
    totalPrice: 0,
    orderDate: new Date().toISOString()
  };

  productOptions: Product[] = [];
  userOptions: User[] = [];  // This will hold the fetched users
  searchTerm: string = '';

  constructor(
    private ordersService: OrdersService,
    private productService: ProductService,
    private userService: UserService,  // Inject the UserService
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch products dynamically from the API
    this.productService.getProducts().subscribe(
      (products) => {
        this.productOptions = products;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );

    // Fetch users dynamically from the API
    this.userService.getUsers().subscribe(
      (users) => {
        this.userOptions = users;  // Store fetched users
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  filteredProducts() {
    return this.productOptions.filter(product => product.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Function to create a new order
  createOrder(): void {
    if (!this.newOrder.userId || this.newOrder.products.length === 0) {
      alert('Please select a user and add products to the order.');
      return;
    }

    // Log the form data in the console
    console.log('Order Data:', this.newOrder);

    // Log user data
    const user = this.userOptions.find(user => user._id === this.newOrder.userId);
    console.log('User Data:', user);

    // Proceed with creating the order
    this.ordersService.createOrders(this.newOrder).subscribe({
      next: (order) => {
        console.log('Order Created:', order);
        this.router.navigate(['/admin/orders']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        const errorMessage =
          error.status === 404 ? 'Error: User not found or invalid data.' :
          error.status === 500 ? 'Server error occurred. Please try again later.' :
          'An unexpected error occurred.';
        alert(errorMessage);
      }
    });
  }



  addProduct(product: Product): void {
    this.newOrder.products.push({ ...product, quantity: 1, _id: product._id || '' });
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.newOrder.totalPrice = this.newOrder.products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  }

  removeProduct(index: number): void {
    this.newOrder.products.splice(index, 1);
    this.calculateTotalPrice();
  }
}
