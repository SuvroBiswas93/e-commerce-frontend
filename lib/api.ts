import { ApiResponse, Product, Category } from '@/types/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-side token holder (injected during SSR for authenticated requests)
let __serverToken: string | null = null;

export function setServerToken(token: string | null): void {
  __serverToken = token;
}

// Get token from localStorage (client-side) or injected server token (SSR)
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return __serverToken;
}

// Set token in localStorage
function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

// Clear token and redirect to login
function clearTokenAndRedirect(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  document.cookie = 'authToken=; path=/; max-age=0';
  window.location.href = '/auth/login';
}

interface FetchOptions extends RequestInit {
  includeAuth?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { includeAuth = true, ...fetchOptions } = options;
  const url = `${API_URL}/api${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add authorization token
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 - Unauthorized
  if (response.status === 401) {
    clearTokenAndRedirect();
    throw new Error('Unauthorized - redirecting to login');
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'API request failed');
  }

  return json as T;
}

// Auth API calls
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiFetch<ApiResponse<{ user: any; token: string }>>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        includeAuth: false,
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await apiFetch<ApiResponse<{ user: any; token: string }>>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        includeAuth: false,
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      document.cookie = 'authToken=; path=/; max-age=0';
    }
  },

  getCurrentUser: async () => {
    const response = await apiFetch<ApiResponse<any>>('/auth/me');
    return response.data;
  },
};

// ── Product API calls ─────────────────────────────────────────────
export const productApi = {
  getProducts: async (params: Record<string, any> = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const response = await apiFetch<ApiResponse<Product[]>>(
      `/products?${queryParams.toString()}`
    );
    return { data: response.data, meta: response.meta };
  },

  getProductById: async (id: string) => {
    const response = await apiFetch<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiFetch<ApiResponse<Category[]>>('/categories');
    return response.data;
  },
};
