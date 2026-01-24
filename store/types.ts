export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; 
  colors: { name: string; hex: string }[]; 
  sizes: string[];
  filters: string[];
  createdAt: string
}
