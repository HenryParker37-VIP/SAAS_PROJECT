import { useState, useEffect, useCallback } from 'react';
import { api, type Transaction } from '@/lib/api';

interface DashboardMetrics {
  totalRevenue: number;
  totalTransactions: number;
  completedTransactions: number;
  growthRate: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  monthlyRevenue: { month: string; revenue: number; transactions: number }[];
  productSales: { product: string; revenue: number; count: number }[];
  regionDistribution: { region: string; count: number; revenue: number }[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

interface TransactionFilters {
  page?: string;
  limit?: string;
  product?: string;
  region?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export function useTransactions(filters: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      for (const [key, value] of Object.entries(filters)) {
        if (value) params[key] = value;
      }
      const result = await api.getTransactions(params);
      setTransactions(result.transactions);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev.slice(0, prev.length - 1)]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  return { transactions, pagination, loading, error, refetch: fetchTransactions, addTransaction };
}
