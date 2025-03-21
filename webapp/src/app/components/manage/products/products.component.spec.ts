import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../../services/product/product.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Product } from '../../../types/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,  // Add CommonModule
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  displayedColumns: string[] = ['id', 'name', 'price', 'discount', 'category', 'image', 'action'];

  dataSource: MatTableDataSource<Product>;
  alertMessage: string | null = null; // Alert message
  alertType: 'success' | 'error' | null = null; // Alert type (success or error)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productService = inject(ProductService);

  constructor() {
    this.dataSource = new MatTableDataSource([] as Product[]);
  }

  ngOnInit() {
    this.getServerData();
  }

  private getServerData() {
    this.productService.getProducts().subscribe((result: any) => {
      console.log(result);  // Check API response
      this.dataSource.data = result;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(id: string) {
    const confirmation = confirm("Are you sure you want to delete this product?");
    if (confirmation) {
      this.productService.deleteProductById(id).subscribe({
        next: () => {
          this.alertMessage = "Product successfully deleted.";
          this.alertType = 'success';
          this.getServerData(); // Refresh the data after deletion
        },
        error: (err: any) => {
          console.error("Error deleting product:", err);
          this.alertMessage = "Failed to delete the product.";
          this.alertType = 'error';
        }
      });
    } else {
      this.alertMessage = "Deletion cancelled.";
      this.alertType = 'error';
    }
  }
}
