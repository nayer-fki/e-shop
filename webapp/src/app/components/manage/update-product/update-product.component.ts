import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { Product } from '../../../types/product';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  product: Product = {
    name: '',
    price: 0,
    categoryId: '', // Initially empty
    images: [], // Initialize images as an array
    description: '',
    shortDescription: '',
    discount: 0,
  };
  isEdit = false;
  id!: string;
  categories: any[] = [];
  alertMessage: string = '';
  alertMessageType: 'success' | 'error' = 'error';
  loading: boolean = false;

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
    this.loading = true;
    this.productService.getProductById(this.id).subscribe({
      next: (result: Product) => {
        this.product = result;
        this.product.images = this.product.images || [];
        this.loading = false;
      },
      error: (err) => {
        this.alertMessageType = 'error';
        this.alertMessage = `Failed to load product details: ${err.message}`;
        this.router.navigateByUrl('/admin/products');
        this.loading = false;
      },
    });
  }

  private loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (result: any[]) => {
        this.categories = result;
        this.loading = false;
      },
      error: (err) => {
        this.alertMessageType = 'error';
        this.alertMessage = `Failed to load categories: ${err.message}`;
        this.loading = false;
      },
    });
  }

  getCategoryNameById(categoryId: string): string | undefined {
    const category = this.categories.find((cat) => cat._id === categoryId);
    return category?.name;
  }

  addImage() {
    this.product.images = this.product.images || [];
    this.product.images.push('');
  }

  deleteImage(index: number) {
    if (this.product.images) {
      this.product.images.splice(index, 1);
    }
  }

  isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)/;
    return pattern.test(url);
  }

  areAllImagesValid(): boolean {
    return this.product.images?.every((url: string) => this.isValidUrl(url)) ?? true;
  }

  update() {
    if (
      !this.product.name.trim() ||
      !this.product.description?.trim() ||
      this.product.price <= 0 ||
      !this.product.categoryId ||
      !this.areAllImagesValid()
    ) {
      this.alertMessageType = 'error';
      this.alertMessage =
        'Please provide valid product details, including a valid image URL and category.';
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
