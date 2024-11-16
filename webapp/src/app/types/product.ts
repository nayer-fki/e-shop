export interface Product {
    id?: string; // Optional because the ID might not exist initially
    name: string;
    shortDescription?: string;
    description?: string;
    price: number;
    discount?: number;
    images?: string[];
    categoryId: string; // Assuming it's required
  }
  