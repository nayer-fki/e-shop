import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../../services/user/user.service';
import { RouterLink } from '@angular/router';
import { User } from '../../../types/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'image', 'action'];  // Added 'image' column
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userService = inject(UserService);

  constructor() {}

  ngOnInit() {
    this.loadAdminClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadAdminClients() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Filter users where isAdmin is true
        this.dataSource.data = users.filter((user) => user.isAdmin === false);
      },
      error: (err) => {
        console.error('Error loading clients:', err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id: string | undefined) {
    if (!id) {
      console.error('Invalid ID passed to deleteClient:', id);
      return;
    }
    if (confirm('Are you sure you want to delete this clients?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log('Client deleted successfully.');
          this.loadAdminClients(); // Refresh after deletion
        },
        error: (err) => {
          console.error('Error deleting client:', err);
        },
      });
    }
  }
  
}
