import { Component, ViewChild, inject } from '@angular/core';
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
import { CommonModule, NgClass } from '@angular/common'; // Combined imports
import { Product } from '../../../types/product';
import { ProductPopupComponent } from '../product-popup/product-popup.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  displayedColumns: string[] = ['id', 'name', 'price', 'discount', 'category', 'image', 'action'];
  dataSource: MatTableDataSource<Product>;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  selectedProduct: Product | null = null; // Stores the product for popup display

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
    this.productService.getProducts().subscribe({
      next: (result: Product[]) => {
        this.dataSource.data = result;
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      },
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
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProductById(id).subscribe({
        next: () => {
          this.alertMessage = 'Product successfully deleted.';
          this.alertType = 'success';
          this.getServerData(); // Refresh data
        },
        error: (err: any) => {
          console.error('Error deleting product:', err);
          this.alertMessage = 'Failed to delete the product.';
          this.alertType = 'error';
        },
      });

      setTimeout(() => {
        this.alertMessage = null;
        this.alertType = null;
      }, 2000);
    }
  }

  openProductPopup(product: Product) {
    this.selectedProduct = product;
    // Logic to open the popup
    const popup = document.getElementById('product-popup');
    if (popup) popup.style.display = 'block';
  }

  closeProductPopup() {
    this.selectedProduct = null;
    // Logic to close the popup
    const popup = document.getElementById('product-popup');
    if (popup) popup.style.display = 'none';
  }
}
