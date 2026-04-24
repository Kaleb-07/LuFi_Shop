/// <reference types="vite/client" />
// Backend API base URL — set in .env as VITE_API_BASE_URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/api" : null) ||
  "http://127.0.0.1:8000/api";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  
  // If the body is FormData, we let the browser set the Content-Type automatically (with boundary)
  const isFormData = options?.body instanceof FormData;
  
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    } as any,
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch (e) {
      errorData = { message: `API error: ${res.status}` };
    }
    const error: any = new Error(errorData.message || `API error: ${res.status}`);
    error.response = errorData;
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// ─────────────────────────────────────────────
// Types — matches the Laravel models
// ─────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
}

export interface Product {
  id: number;
  item_code: string;
  item_name: string;
  price: number;           // selling price
  stock_quantity: number;
  description?: string;
  images?: string[];       // array of image URLs
  category_name?: string;
  brand_name?: string;
  is_visible?: boolean;
  category_id?: number;
  brand_id?: number;
  part_number?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_name?: string;
  items_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string; // Used as a display helper
  email: string;
  phone: string;
  shipping_address: string;
  payment_method: string;
  payment_status?: string;
  total_amount: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────

/** Fetches all visible ecommerce products from the backend */
export async function fetchEcommerceProducts(): Promise<Product[]> {
  return await apiFetch<Product[]>("/ecommerce");
}

/** Fetches a single product by its numeric id */
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/ecommerce/${id}`);
  } catch (err) {
    console.error("Product not found", err);
    return null;
  }
}

/** Fetches related products (recommendations) */
export async function fetchRelatedProducts(id: number): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>(`/ecommerce/${id}/related`);
  } catch (err) {
    console.error("Failed to fetch related products", err);
    return [];
  }
}

/** Fetches all categories */
export async function fetchCategories(): Promise<Category[]> {
  return await apiFetch<Category[]>("/categories");
}

/** Fetches all brands */
export async function fetchBrands(): Promise<Brand[]> {
  return await apiFetch<Brand[]>("/brands");
}

/** Fetches public store settings */
export async function fetchPublicSettings(): Promise<any> {
  return await apiFetch<any>("/ecommerce/settings");
}

/** Submits a new order */
export async function createOrder(orderData: any): Promise<Order> {
  return await apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

/** Tracks an order by its order number */
export async function fetchOrderDetails(orderNumber: string): Promise<Order> {
  return await apiFetch<Order>(`/orders/${orderNumber}`);
}

/**
 * Fetches orders for the currently authenticated user.
 */
export async function fetchUserOrders(): Promise<Order[]> {
  const data = await apiFetch<Order[]>("/user/orders");
  return data || [];
}

/** Fetches reviews for a specific product */
export async function fetchProductReviews(productId: number): Promise<any[]> {
  return await apiFetch<any[]>(`/products/${productId}/reviews`);
}

/** Submits a new product review */
export async function submitReview(reviewData: { product_id: number; rating: number; comment?: string }): Promise<any> {
  return await apiFetch<any>("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

