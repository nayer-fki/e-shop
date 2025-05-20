export interface Order {
  _id: string; // Changed to non-optional
  userId: string;
  products: { name: string, price: number, quantity: number, _id: string }[]; // Array of products
  status: string;
  orderDate: string;
  totalPrice: number; // Can be computed dynamically
  userName?: string;
}
