import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components

@Component({
  selector: 'app-order-table',
  standalone: true, // Mark it as a standalone component
  imports: [CommonModule], // Import necessary Angular modules
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent implements OnInit {
  orders = [
    { id: 1, customerName: 'John Doe', totalPrice: 123.45, status: 'Delivered' },
    { id: 2, customerName: 'Jane Smith', totalPrice: 678.90, status: 'Pending' }
  ];

  ngOnInit(): void {
    // Component initialization logic
  }
}
