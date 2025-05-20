import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/manage/categories/categories.component';
import { CategoryFormComponent } from './components/manage/category-form/category-form.component';
import { BrandsComponent } from './components/manage/brands/brands.component';
import { BrandFormComponent } from './components/manage/brand-form/brand-form.component';
import { ProductsComponent } from './components/manage/products/products.component';
import { ProductFormComponent } from './components/manage/product-form/product-form.component';
import { UpdateProductComponent } from './components/manage/update-product/update-product.component';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { authGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/manage/dashboard/dashboard.component';
import { UsersAdminComponent } from './components/manage/users-admin/users-admin.component';
import { UserAdminFormComponent } from './components/manage/user-admin-form/user-admin-form.component';
import { AdminUpdateComponent } from './components/manage/admin-update/admin-update.component';
import { ClientsComponent } from './components/manage/clients/clients.component';
import { EditProfileComponent } from './components/manage/edit-profile/edit-profile.component';
import { ProductDetailsComponent } from './components/clients/product-details/product-details.component';
import { CartComponent } from './components/clients/cart/cart.component';
import { OrderConfirmationComponent } from './components/clients/order-confirmation/order-confirmation.component';
import { OrdersComponent } from './components/manage/orders/orders.component';
import { ConfirmedOrdersComponent } from './components/manage/confirmed-orders/confirmed-orders.component';
import { CreateOrderComponent } from './components/manage/create-order/create-order.component';
import { SearchResultsComponent } from './components/clients/search-results/search-results.component';

export const routes: Routes = [
  // Client Routes
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [authGuard], // Protect client routes
    children: [
      { path: '', component: HomeComponent },
      {path: 'product-details/:id',  component: ProductDetailsComponent },
      { path: 'cart/:userId', component: CartComponent },
      { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
      { path: 'search-result', component: SearchResultsComponent },


    ],
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard], // Protect admin layout
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect to dashboard by default
      { path: 'dashboard', component: DashboardComponent }, // Admin Dashboard
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/add', component: CategoryFormComponent },
      { path: 'categories/:id', component: CategoryFormComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'brands/add', component: BrandFormComponent },
      { path: 'brands/:id', component: BrandFormComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/add', component: ProductFormComponent },
      { path: 'products/:id', component: UpdateProductComponent },
      { path: 'admin-users', component: UsersAdminComponent },
      { path: 'admin-users/add', component: UserAdminFormComponent },
      { path: 'admin-users/:id', component: AdminUpdateComponent },
      { path: 'admin-clients', component: ClientsComponent },
      { path: 'profile', component: EditProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'confirmed-orders', component: ConfirmedOrdersComponent},
      { path: 'create-order', component: CreateOrderComponent},

    ],
  },

  // Admin Login Route (Public route)
  {
    path: 'admin/login',
    component: LoginComponent, // Admin login page
  },

  // Wildcard Route for Unknown Paths
  {
    path: '**',
    redirectTo: '', // Redirect to the home page by default
  },
];
