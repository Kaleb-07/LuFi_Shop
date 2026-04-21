import { apiFetch, Product, Order } from "./api";

export interface DashboardStats {
  stats: {
    revenue: number;
    orders: number;
    products: number;
    customers: number;
  };
  revenueChart: { date: string; total: number }[];
  orderChart: { date: string; count: number }[];
}

export const adminApi = {
  // Stats
  getStats: () => apiFetch<DashboardStats>("/admin/stats"),

  // Products
  getProducts: () => apiFetch<Product[]>("/admin/products"),
  createProduct: (data: Partial<Product>) => 
    apiFetch<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id: number, data: Partial<Product>) => 
    apiFetch<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: number) => 
    apiFetch<{ message: string }>(`/admin/products/${id}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: () => apiFetch<Order[]>("/admin/orders"),
  getOrderDetails: (id: number) => apiFetch<Order>(`/admin/orders/${id}`),
  updateOrderStatus: (id: number, status: string, paymentStatus?: string) =>
    apiFetch<Order>(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, payment_status: paymentStatus }),
    }),
};
