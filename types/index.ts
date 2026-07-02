// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  stock: number;
  rating?: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Auth Store Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Sorting Types
export enum SortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  TOP_RATED = 'top_rated',
  NEWEST = 'newest',
}
