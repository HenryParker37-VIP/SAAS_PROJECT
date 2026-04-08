import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download, Search, Filter, Loader2 } from 'lucide-react';
import { api, type Transaction } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { useTransactions } from '@/hooks/useDashboardData';

interface DataTableProps {
  liveTransactions?: Transaction[];
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function DataTable({ liveTransactions = [] }: DataTableProps) {
  const { addToast } = useToast();
  const [page, setPage] = useState('1');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [product, setProduct] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [exporting, setExporting] = useState(false);

  const filters = useMemo(
    () => ({ page, limit: '15', sortBy, sortOrder, product, region, status, search }),
    [page, sortBy, sortOrder, product, region, status, search]
  );

  const { transactions, pagination, loading } = useTransactions(filters);

  const allTransactions = useMemo(() => {
    if (page === '1' && liveTransactions.length > 0) {
      return [...liveTransactions, ...transactions].slice(0, 15);
    }
    return transactions;
  }, [transactions, liveTransactions, page]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage('1');
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const csv = await api.exportCSV({ product, region, status });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
      addToast('CSV exported successfully', 'success');
    } catch {
      addToast('Failed to export CSV', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage('1');
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortBy === field ? (
      sortOrder === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )
    ) : null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h3 className="text-base font-semibold text-card-foreground">Recent Transactions</h3>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customer or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          <select
            value={product}
            onChange={(e) => { setProduct(e.target.value); setPage('1'); }}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Products</option>
            <option>Analytics Pro</option>
            <option>Cloud Storage</option>
            <option>API Gateway</option>
            <option>Auth Service</option>
            <option>Data Pipeline</option>
          </select>
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage('1'); }}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Regions</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia</option>
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage('1'); }}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {[
                { key: 'date', label: 'Date' },
                { key: 'customerName', label: 'Customer' },
                { key: 'product', label: 'Product' },
                { key: 'revenue', label: 'Revenue' },
                { key: 'region', label: 'Region' },
                { key: 'status', label: 'Status' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon field={key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </td>
              </tr>
            ) : allTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              allTransactions.map((tx) => (
                <tr key={tx._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-foreground">{tx.customerName}</td>
                  <td className="px-4 py-3 text-foreground">{tx.product}</td>
                  <td className="px-4 py-3 text-foreground font-medium">${tx.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground">{tx.region}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', STATUS_COLORS[tx.status])}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(String(pagination.page - 1))}
            disabled={pagination.page <= 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-foreground font-medium">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage(String(pagination.page + 1))}
            disabled={pagination.page >= pagination.pages}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
