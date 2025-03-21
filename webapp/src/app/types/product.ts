export interface Product {
  id?: string; // Optional because the ID might not exist initially
  name: string;
  shortDescription?: string; // Optional field
  description?: string; // Optional field
  price: number;
  discount?: number; // Optional field
  images?: string[]; // Optional array of image URLs
  categoryId: string; // Assuming categoryId is required
}
