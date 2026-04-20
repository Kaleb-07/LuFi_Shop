// Backend API base URL — set in .env as VITE_API_BASE_URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL + "/api" ||
  "http://localhost:8000/api";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// Types — matches the Laravel EcommerceItem model
// ─────────────────────────────────────────────
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
  part_number?: string;
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
  const data = await apiFetch<Product[]>("/ecommerce");
  // Only show products where is_visible is true (or undefined = treat as visible)
  return data.filter((p) => p.is_visible !== false);
}

/** Fetches a single product by its numeric id */
export async function fetchProductById(id: number): Promise<Product | null> {
  const data = await apiFetch<Product[]>("/ecommerce");
  return data.find((p) => p.id === id) ?? null;
}
