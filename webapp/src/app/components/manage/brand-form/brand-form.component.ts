import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importation de NgIf
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand/brand.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [
    CommonModule, // Importation de CommonModule pour *ngIf
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
})
export class BrandFormComponent implements OnInit {
  name!: string;
  isEdit = false;
  id!: string;
  alertMessage: string = ''; // Ajout de la propriété

  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.loadBrand();
    }
  }

  private loadBrand() {
    this.brandService.getBrandById(this.id).subscribe({
      next: (result: any) => {
        this.name = result.name;
      },
      error: () => {
        this.alertMessage = 'Failed to load brand details.';
        this.router.navigateByUrl('/admin/brands');
      },
    });
  }

  add() {
    if (!this.name.trim()) {
      this.alertMessage = 'Please enter a valid brand name.';
      return;
    }
    this.brandService.addBrand(this.name).subscribe({
      next: () => {
        this.alertMessage = 'Brand added successfully.';
        setTimeout(() => this.router.navigateByUrl('/admin/brands'), 1000);
      },
      error: () => {
        this.alertMessage = 'Failed to add brand.';
      },
    });
  }

  update() {
    if (!this.name.trim()) {
      this.alertMessage = 'Please enter a valid brand name.';
      return;
    }
    this.brandService.updateBrand(this.id, this.name).subscribe({
      next: () => {
        this.alertMessage = 'Brand updated successfully.';
        setTimeout(() => this.router.navigateByUrl('/admin/brands'), 1000);
      },
      error: () => {
        this.alertMessage = 'Failed to update brand.';
      },
    });
  }
}
