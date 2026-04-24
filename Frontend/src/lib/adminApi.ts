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
  recentOrders: Order[];
}

export const adminApi = {
  // Stats
  getStats: () => apiFetch<DashboardStats>("/admin/stats"),
  getReports: (period: string = "month") => apiFetch<any>(`/admin/reports?period=${period}`),

  // Products
  getProducts: () => apiFetch<Product[]>("/admin/products"),
  createProduct: (data: Partial<Product> | FormData) => 
    apiFetch<Product>("/admin/products", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  updateProduct: (id: number, data: Partial<Product> | FormData) => {
    const isFormData = data instanceof FormData;
    if (isFormData && !data.has('_method')) {
      data.append('_method', 'PUT');
    }
    return apiFetch<Product>(`/admin/products/${id}`, {
      method: isFormData ? "POST" : "PUT",
      body: isFormData ? data : JSON.stringify(data),
    });
  },
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

  // Users/Customers
  getUsers: () => apiFetch<any[]>("/admin/users"),
  getStaff: () => apiFetch<any[]>("/admin/staff"),
  createStaff: (data: any) => apiFetch<any>("/admin/staff", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  updateStaff: (id: number, data: any) => apiFetch<any>(`/admin/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deleteStaff: (id: number) => apiFetch<{ message: string }>(`/admin/staff/${id}`, {
    method: "DELETE",
  }),
  getUserDetails: (id: number) => apiFetch<any>(`/admin/users/${id}`),
  deleteUser: (id: number) => apiFetch<{ message: string }>(`/admin/users/${id}`, {
    method: "DELETE",
  }),

  // Settings
  getSettings: () => apiFetch<Record<string, string>>("/admin/settings"),
  updateSettings: (data: Record<string, string>) => 
    apiFetch<{ message: string }>("/admin/settings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getNotifications: () => apiFetch<any[]>("/admin/notifications"),

  // Reviews
  getReviews: () => apiFetch<any>("/admin/reviews"),
  updateReviewStatus: (id: number, status: string) => 
    apiFetch<any>(`/admin/reviews/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  deleteReview: (id: number) => 
    apiFetch<any>(`/admin/reviews/${id}`, {
      method: "DELETE",
    }),
};
