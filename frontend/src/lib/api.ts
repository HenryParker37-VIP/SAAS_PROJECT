const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  if (res.headers.get('Content-Type')?.includes('text/csv')) {
    return (await res.text()) as unknown as T;
  }

  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string; role: 'user' | 'admin' } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  signup: (email: string, password: string, name: string) =>
    request<{ token: string; user: { id: string; email: string; name: string; role: 'user' | 'admin' } }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  getProfile: () =>
    request<{ user: { id: string; email: string; name: string; role: 'user' | 'admin' } }>('/user/profile'),

  // Dashboard
  getDashboard: () =>
    request<{
      metrics: { totalRevenue: number; totalTransactions: number; completedTransactions: number; growthRate: number };
      monthlyRevenue: { month: string; revenue: number; transactions: number }[];
      productSales: { product: string; revenue: number; count: number }[];
      regionDistribution: { region: string; count: number; revenue: number }[];
    }>('/dashboard'),

  getTransactions: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request<{
      transactions: Transaction[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/dashboard/transactions?${query}`);
  },

  exportCSV: (filters: Record<string, string>) =>
    request<string>('/dashboard/export', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),
};

export interface Transaction {
  _id: string;
  date: string;
  product: string;
  revenue: number;
  region: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  customerName: string;
  quantity: number;
  createdAt: string;
}
