import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../services/product/product.service';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../types/user';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  comments: { userName: string; text: string }[] = [];
  currentRating: number = 0;
  hoveredRating: number = 0;
  comment: string = '';
  userId: string | null = null; // User's email (used as ID)
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';
  userAvatar: string = 'default-avatar.png';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.getProductDetails(this.productId);
    this.fetchComments();
    this.checkLoginStatus();
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    this.userId = this.authService.getUserInfoFromStorage()?.email || null;

    this.isLoggedIn = !!this.userId; // Correct assignment using the '!!' operator

    console.log(this.userId);

    if (!this.userId) {
      console.warn('No user authenticated! Redirecting to login page...');
      this.router.navigate(['/login']);
    }
  }

  checkLoginStatus(): void {
    const storedUserInfo: User | null = this.authService.getUserInfoFromStorage();
    if (storedUserInfo) {
      this.isLoggedIn = this.authService.isAuthenticated();
      this.userEmail = storedUserInfo.email ?? '';
      this.userName = storedUserInfo.name ?? 'Guest';
      this.userAvatar = storedUserInfo.image ?? 'default-avatar.png';
      this.userId = storedUserInfo._id ?? '';
      console.log(storedUserInfo?._id);

    } else {
      this.isLoggedIn = false;
    }
    console.log('Stored User Info:', storedUserInfo);
  }

  getProductDetails(productId: string): void {
    this.productService.getProductById(productId).subscribe(
      (product: Product) => {
        this.product = product;
        console.log('Product details fetched:', product);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  fetchComments(): void {
    this.productService.getCommentsByProductId(this.productId).subscribe(
      (comments) => {
        this.comments = comments;
        console.log('Fetched comments:', comments);
      },
      (error: HttpErrorResponse) => {
        console.error('Failed to fetch comments:', error);
      }
    );
  }

  // Rating Methods
  hoverRating(star: number): void {
    this.hoveredRating = star;
  }

  resetHover(): void {
    this.hoveredRating = 0;
  }

  submitRating(star: number): void {
    const user = this.authService.getUserInfoFromStorage(); // Fetch user details
    if (!user || !user._id || !user.name) {
      console.warn('No user authenticated! Unable to submit rating.');
      alert('You need to be logged in to submit a rating.');
      return;
    }

    this.currentRating = star;

    const ratingPayload = {
      productId: this.productId,       // ID of the product
      userId: user._id,                 // User's ID from AuthService
      userName: user.name,             // User's name or email
      rating: this.currentRating       // Rating value (1-5)
    };

    console.log('Submitting rating payload:', ratingPayload);

    this.productService.submitProductRating(this.productId, ratingPayload).subscribe(
      () => {
        console.log('Rating submitted successfully!');
        alert('Thank you for your rating!');
      },
      (error: HttpErrorResponse) => {
        console.error('Error submitting rating:', error);
        alert('Failed to submit rating. Please try again.');
      }
    );
  }

  submitComment(): void {
    const user = this.authService.getUserInfoFromStorage(); // Fetch user details
    if (!user || !user._id || !user.name) {
      console.warn('No user authenticated! Unable to submit comment.');
      alert('You need to be logged in to submit a comment.');
      return;
    }

    const newComment = {
      productId: this.productId,       // ID of the product
      userId: user._id,                 // User's ID from AuthService
      userName: user.name,             // User's name or email
      text: this.comment               // User's comment text
    };

    console.log('Submitting comment payload:', newComment);

    this.productService.submitProductComment(this.productId, newComment).subscribe(
      () => {
        console.log('Comment submitted successfully!');
        this.comments.push(newComment); // Update UI with the new comment
        this.comment = '';              // Clear input field
      },
      (error: HttpErrorResponse) => {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment. Please try again.');
      }
    );
  }
}
