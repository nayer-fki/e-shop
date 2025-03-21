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
import { BrandService } from '../../../services/brand/brand.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { NgClass } from '@angular/common';  // Import NgClass
import { Brand } from '../../../types/brand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    CommonModule,  // Ajouter CommonModule
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
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Brand>;

  alertMessage: string | null = null; // Message d'alerte
  alertType: 'success' | 'error' | null = null; // Type d'alerte (succès ou erreur)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  brandService = inject(BrandService);

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }

  ngOnInit() {
    this.getServerData();
  }

  private getServerData() {
    this.brandService.getBrands().subscribe((result: any) => {
      console.log(result);
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
    const confirmation = confirm("Are you sure you want to delete this brand?");
    if (confirmation) {
      this.brandService.deleteBrandById(id).subscribe({
        next: () => {
          this.alertMessage = "brand successfully deleted.";
          this.alertType = 'success';
          this.getServerData(); // Rafraîchissement après suppression
        },
        error: (err: any) => {
          console.error("Error deleting brand:", err);
          this.alertMessage = "Failed to delete the brand.";
          this.alertType = 'error';
        }
      });
    } else {
      this.alertMessage = "Deletion cancelled.";
      this.alertType = 'error';
    }

    // Effacer le message d'alerte après 3 secondes
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 2000);
  }
}
