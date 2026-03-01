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
export type Color = { name: string; hex: string };

export type CartItem = {
  productId: string;
  quantity: number;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string | null;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    totalStock: number;
  };
};

export interface CartStore {
  items: CartItem[];
  isSyncing: boolean;

  addToCart: (item: CartItem) => void;
  syncCart: ()=> void
  clearLocalCart: () => void;

  removeFromCart: (
    productId: string,
    selectedSize?: string | null,
    selectedColorHex?: string | null,
  ) => void;

  increaseQty: (
    productId: string,
    selectedSize?: string | null,
    selectedColorHex?: string | null,
  ) => void;

  decreaseQty: (
    productId: string,
    selectedSize?: string | null,
    selectedColorHex?: string | null,
  ) => void;

  clearCart: () => void;
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  phone?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  landMark?: string;
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
  image?: string;

  cart: {
    productId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];

  orders: string[];

  shippingAddress?: {
    fullName: string;
    streetAddress: string;
    phone?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
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
  currencySymbol: string;

  setUser: (user: User) => void;
  setCurrency: (currency: string) => void;
  setCountry: (country: string) => void;
  logout: () => void;
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
  }) => User | null | Promise<any>;
  loginUser: (data: {
    email: string;
    password: string;
  }) => User | null | Promise<any>;
}

export interface ExchangeRateState {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  fetchRates: () => Promise<void>;
  resetRates: () => void;
  lastFetched: number;
}

export type CartItemPayload = {
  productId: string;
  quantity: number;
  selectedColor: string | null;
  selectedSize: string | null;
};
