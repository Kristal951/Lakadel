import { create } from "zustand";
import { Product } from "./types";

interface ProductState {
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

  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  setFilter: (type: "sizes" | "categories", value: string[]) => void;
  filteredProducts: () => Product[];
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: { sizes: [], categories: [] },
  sortBy: null,
  query: "",
  setQuery: (q) => set({ query: q }),

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSort: (sortBy: ProductState["sortBy"]) => set({ sortBy }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  fetchProducts: async () => {
    const { products } = get();
    if (products.length > 0) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data: Product[] = await res.json();
      set({ products: data });
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  getProductById: (id: string) => get().products.find((p) => p.id === id),

  setFilter: (type, value) =>
    set((state) => ({
      filters: { ...state.filters, [type]: value },
    })),

  filteredProducts: () => {
    let products = [...get().products];
    const { sizes, categories } = get().filters;
    const { sortBy } = get();

    if (sizes.length > 0) {
      products = products.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    }

    if (categories.length > 0) {
      products = products.filter((p) =>
        p.filters.some((f) => categories.includes(f)),
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "nameAsc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "newest":
          products.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
      }
    }

    return products;
  },
  searchedProducts: () => {
  const products = get().products;
  const { query } = get();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.colors.some((color) =>
        color.name.toLowerCase().includes(query.toLowerCase())
      )
  );

  return filteredProducts;
},

}));

export default useProductStore;
