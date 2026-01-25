export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  filters: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartState {
  items: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (
    productId: string,
    color?: string,
    size?: string
  ) => void;
  updateQuantity: (
    productId: string,
    qty: number,
    color?: string,
    size?: string
  ) => void;

  clearCart: () => void;

  totalItems: () => number;
}
