import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/order/orders.service'; // Adjust path if necessary
import { Order } from '../../../types/order'; // Adjust path if necessary
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmed-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmed-orders.component.html',
  styleUrls: ['./confirmed-orders.component.scss']
})
export class ConfirmedOrdersComponent implements OnInit {
  confirmedOrders: Order[] = []; // To hold confirmed orders

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getConfirmedOrders(); // Fetch confirmed orders when the component loads
  }

  // Function to fetch confirmed orders
  getConfirmedOrders(): void {
    this.ordersService.getOrders().subscribe((orders: Order[]) => {
      // Filter orders with 'confirmed' status
      this.confirmedOrders = orders.filter(order => order.status === 'confirmed');
    });
  }

  // Function to update order status to 'shipped'
  updateOrderStatusToShipped(orderId: string | undefined): void {
    if (!orderId) {
      console.error('Order ID is undefined. Cannot update order status.');
      return;
    }
    this.ordersService.updateOrderStatus(orderId, 'shipped').subscribe(() => {
      this.getConfirmedOrders();
    });
  }
}
