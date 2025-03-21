import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Adjust if your root component name differs
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // For animations support
import { RouterModule } from '@angular/router';  // Import RouterModule for routing
import { routes } from './app.routes';  // Import the routes configuration
import { ClientLayoutComponent } from './client-layout/client-layout.component';  // Client layout
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';  // Admin layout
import { HomeComponent } from './components/home/home.component';  // Home component
import { HeaderComponent } from './components/header/header.component';  // Header component
import { FooterComponent } from './components/footer/footer.component';  // Footer component
import { SidebarComponent } from './components/sidebar/sidebar.component';  // Sidebar component
import { NavbarComponent } from './components/navbar/navbar.component';  // Navbar component
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule

@NgModule({
  declarations: [
    AppComponent,               // Declare your root component
    ClientLayoutComponent,      // Declare the client layout component
    AdminLayoutComponent,       // Declare the admin layout component
    HomeComponent,              // Declare the home component
    HeaderComponent,            // Declare the header component
    FooterComponent,            // Declare the footer component
    SidebarComponent,           // Declare the sidebar component
    NavbarComponent             // Declare the navbar component
  ],
  imports: [
    BrowserModule,              // For basic browser support
    BrowserAnimationsModule,    // For animations support
    RouterModule.forRoot(routes),  // Configure routing with the routes
    ReactiveFormsModule         // Import ReactiveFormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]     // The component that bootstraps the app
})
export class AppModule { }
