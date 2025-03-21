import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  product: any = {}; // Product object
  isEdit = false;
  id!: string;
  categories: any[] = [];
  alertMessage: string = '';
  alertMessageType: 'success' | 'error' = 'error';

  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.loadProduct();
    }
    this.loadCategories();
  }

  private loadProduct() {
    this.productService.getProductById(this.id).subscribe({
      next: (result: any) => {
        this.product = result;
      },
      error: (err) => {
        this.alertMessageType = 'error';
        this.alertMessage = `Failed to load product details: ${err.message}`;
        this.router.navigateByUrl('/admin/products');
      },
    });
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (result: any[]) => {
        this.categories = result;
      },
      error: (err) => {
        this.alertMessageType = 'error';
        this.alertMessage = `Failed to load categories: ${err.message}`;
      },
    });
  }

  // Add an empty image URL to the images array
  addImage() {
    if (!this.product.images) {
      this.product.images = [];
    }
    this.product.images.push(''); // Adds an empty string to represent a new image input field.
  }

  // Delete an image URL from the images array at a specified index
  deleteImage(index: number) {
    if (this.product.images && this.product.images.length > index) {
      this.product.images.splice(index, 1); // Removes the image URL at the given index
    }
  }

  // Validate image URL format
  isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)/;
    return pattern.test(url);
  }

  // Check if all images are valid
  areAllImagesValid(): boolean {
    return this.product.images.every((url: string) => this.isValidUrl(url));
  }

  // Add new product
  add() {
    if (!this.product.name.trim() || !this.product.shortDescription.trim() || !this.product.description.trim() ||
        this.product.price <= 0 || !this.product.categoryId || !this.areAllImagesValid()) {
      this.alertMessageType = 'error';
      this.alertMessage = 'Please provide valid product details, including a valid image URL.';
      return;
    }

    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.alertMessageType = 'success';
        this.alertMessage = 'Product added successfully.';
        setTimeout(() => this.router.navigateByUrl('/admin/products'), 2000);
      },
      error: (err) => {
        this.alertMessageType = 'error';
        this.alertMessage = `Failed to add product: ${err.message}`;
      },
    });
  }

  // Update existing product
  update() {
    if (!this.product.name.trim() || !this.product.shortDescription.trim() || !this.product.description.trim() ||
        this.product.price <= 0 || !this.product.categoryId || !this.areAllImagesValid()) {
      this.alertMessageType = 'error';
      this.alertMessage = 'Please provide valid product details, including a valid image URL.';
      return;
    }

    this.productService.updateProduct(this.id, this.product).subscribe({
      next: () => {
        this.alertMessageType = 'success';
        this.alertMessage = 'Product updated successfully.';
        setTimeout(() => this.router.navigateByUrl('/admin/products'), 1000);
      },
      error: (err) => {
        this.alertMessageType = 'error';
        this.alertMessage = `Failed to update product: ${err.message}`;
      },
    });
  }
}
