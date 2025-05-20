import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/order/orders.service';
import { Order } from '../../../types/order';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../types/user';
import { ProductService } from '../../../services/product/product.service'; // Assuming this service exists

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  searchQuery: string = '';

  constructor(
    private orderService: OrdersService,
    private userService: UserService,
    private productService: ProductService, // Inject the ProductService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        this.orders.forEach((order) => {
          // Calculate total price by summing each product's (price * quantity)
          let totalPrice = 0;
          order.products.forEach(product => {
            totalPrice += product.price * product.quantity;
          });
          order.totalPrice = totalPrice;

          // Fetch user details asynchronously
          this.userService.getUserById(order.userId).subscribe(
            (user: User) => {
              order.userName = user.name || 'Unknown User';
            },
            (error: any) => {
              order.userName = 'Unknown User';
              console.error('Error fetching user for order', order.userId, error);
            }
          );
        });

        console.log('Orders loaded:', this.orders);
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  // Search and Filter logic combined
  get filteredOrders(): Order[] {
    const filteredBySearch = this.orders.filter(order =>
      (order.userName && order.userName.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      (order.status.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );

    // Further filter to show only pending orders
    return filteredBySearch.filter(order => order.status === 'pending');
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe(
      (updatedOrder) => {
        this.loadOrders();
        console.log('Order status updated:', updatedOrder);
      },
      (error: any) => {
        console.error('Failed to update order status:', error);
      }
    );
  }

  createNewOrder(): void {
    this.router.navigate(['/admin/create-order']);
  }

    // Logic to handle navigation to confirmed orders
    goToConfirmedOrders(): void {
      this.router.navigate(['/admin/confirmed-orders']);  // Assumes your confirmed orders page route is set up as '/confirmed-orders'
    }
}
