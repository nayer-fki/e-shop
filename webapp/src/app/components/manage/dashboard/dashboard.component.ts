import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { OrderTableComponent } from '../order-table/order-table.component';
import { OrdersService } from '../../../services/order/orders.service';
import { UserService } from '../../../services/user/user.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, OrderTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('bounce', [
      state('start', style({ transform: 'scale(1)' })),
      state('end', style({ transform: 'scale(1.1)' })),
      transition('start => end', animate('500ms ease-in')),
      transition('end => start', animate('500ms ease-out')),
    ]),
    trigger('rotateCard', [
      state('hidden', style({ transform: 'rotateY(0)' })),
      state('visible', style({ transform: 'rotateY(180deg)' })),
      transition('hidden => visible', animate('500ms ease-in')),
    ]),
    trigger('scrollIn', [
      state('visible', style({ transform: 'translateY(0)', opacity: 1 })),
      transition(':enter', animate('1s ease-in-out')),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  welcomeMessage = 'Welcome to the Dashboard!';
  totalOrders = 0;
  totalUsers = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  isLoadingData = false; // Track loading state

  // New overviewCards property to bind in the template
  overviewCards = [
    { title: 'Total Orders', value: 0 },
    { title: 'Total Users', value: 0 },
    { title: 'Total Revenue', value: 0 },
    { title: 'Pending Orders', value: 0 },
  ];

  // Chart Data
  salesData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 300 },
    { name: 'May', value: 400 },
  ];

  revenueData = [
    { name: 'Jan', value: 500 },
    { name: 'Feb', value: 700 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 900 },
  ];

  // Corrected colorScheme
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  // State management for the bounce animation
  bounceState: 'start' | 'end' = 'start';

  // State management for showing parts dynamically
  isShowTable = false;
  isShowCharts = false;

  constructor(
    private ordersService: OrdersService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.partyMode();
    this.showDashboardParts();  // Handle visibility after load
  }

  fetchDashboardData(): void {
    this.isLoadingData = true;

    this.ordersService.getOrders().subscribe(
      (orders: { status: string; totalPrice: number }[]) => {
        this.totalOrders = orders.length;
        this.pendingOrders = orders.filter(
          (order) => order.status === 'Pending'
        ).length;
        this.totalRevenue = orders.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );

        // Update the overviewCards values
        this.overviewCards[0].value = this.totalOrders;
        this.overviewCards[1].value = this.totalUsers;
        this.overviewCards[2].value = this.totalRevenue;
        this.overviewCards[3].value = this.pendingOrders;

        this.isLoadingData = false;
      },
      (error) => {
        this.isLoadingData = false;
        console.error('Error fetching orders:', error);
      }
    );

    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.totalUsers = users.length;
        this.overviewCards[1].value = this.totalUsers;
      },
      (error) => {
        this.isLoadingData = false;
        console.error('Error fetching users:', error);
      }
    );
  }

  partyMode(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() },
      });
    }, 5000);
  }

  showDashboardParts(): void {
    setTimeout(() => {
      this.isShowTable = true;
    }, 500); // Show table after delay

    setTimeout(() => {
      this.isShowCharts = true;
    }, 1000); // Show charts after delay
  }
}
