import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importation de NgIf
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule, // Importation de CommonModule pour *ngIf
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  name!: string;
  isEdit = false;
  id!: string;
  alertMessage: string = ''; // Ajout de la propriété

  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.loadCategory();
    }
  }

  private loadCategory() {
    this.categoryService.getCategoryById(this.id).subscribe({
      next: (result: any) => {
        this.name = result.name;
      },
      error: () => {
        this.alertMessage = 'Failed to load category details.';
        this.router.navigateByUrl('/admin/categories');
      }
    });
  }

  add() {
    if (!this.name.trim()) {
      this.alertMessage = 'Please enter a valid category name.';
      return;
    }
    this.categoryService.addcategory(this.name).subscribe({
      next: () => {
        this.alertMessage = 'Category added successfully.';
        setTimeout(() => this.router.navigateByUrl('/admin/categories'), 2000);
      },
      error: () => {
        this.alertMessage = 'Failed to add category.';
      }
    });
  }

  update() {
    if (!this.name.trim()) {
      this.alertMessage = 'Please enter a valid category name.';
      return;
    }
    this.categoryService.updatecategory(this.id, this.name).subscribe({
      next: () => {
        this.alertMessage = 'Category updated successfully.';
        setTimeout(() => this.router.navigateByUrl('/admin/categories'), 2000);
      },
      error: () => {
        this.alertMessage = 'Failed to update category.';
      }
    });
  }



}
