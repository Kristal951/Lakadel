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
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (
    productId: string,
    qty: number,
    color?: string,
    size?: string,
  ) => void;

  clearCart: () => void;

  totalItems: () => number;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    sizes: string[];
    categories: string[];
  };
  sortBy: "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc" | "newest" | null;
  query: string;

  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSort: (sortBy: ProductState["sortBy"]) => void;
  setQuery: (query: string) => void;
  setFilter: (type: "sizes" | "categories", value: string[]) => void;

  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  filteredAndSearchedProducts: () => Product[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: "GOOGLE" | "EMAIL";
  isGuest: boolean;
  currency: string;

  cart: {
    productId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];

  orders: string[];

  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;

  createdAt: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string | null;
  currency: string;
  country: string;
  currencySymbol: string

  setUser: (user: User) => void;
  setCurrency: (currency: string, symbol:string) => void;
  setCountry: (country: string) => void;
  logout: () => void;
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
  }) => User | null | Promise<any>;
  loginUser: (data: { email: string; password: string }) => User | null | Promise<any>;
}

export interface ExchangeRateState {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  fetchRates: () => Promise<void>;
  resetRates: () => void;
}