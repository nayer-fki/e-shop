import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Any necessary data for the dashboard can be added here
  welcomeMessage = 'Welcome to the Admin Dashboard!';
}
