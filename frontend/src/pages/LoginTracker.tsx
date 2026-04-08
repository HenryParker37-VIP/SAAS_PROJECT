import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { LoginActivityEntry } from '@/lib/api';
import { Users, Search, ChevronLeft, ChevronRight, RefreshCw, Shield } from 'lucide-react';

export function LoginTrackerPage() {
  const [activities, setActivities] = useState<LoginActivityEntry[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const data = await api.getLoginActivity({
        page: String(page),
        limit: '20',
        ...(searchQuery ? { search: searchQuery } : {}),
      });
      setActivities(data.activities);
      setPagination(data.pagination);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchActivities(1, '');
  }, []);

  const handleSearch = () => {
    fetchActivities(1, search);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Login Tracker</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              See who logged in to your SaaS account. Names and emails only -- passwords are never stored or shown.
            </p>
          </div>
          <button
            onClick={() => fetchActivities(pagination.page, search)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Privacy notice */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary">Privacy Protected</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              This tracker only shows user names, emails, and login times. Passwords are <strong>never</strong> recorded or displayed.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Login Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      Loading login activity...
                    </td>
                  </tr>
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No login activity found.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                            {getInitials(activity.userName)}
                          </div>
                          <span className="text-sm font-medium text-foreground">{activity.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{activity.userEmail}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(activity.loginAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fetchActivities(pagination.page - 1, search)}
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm text-foreground font-medium">
                  {pagination.page} / {pagination.pages}
                </span>
                <button
                  onClick={() => fetchActivities(pagination.page + 1, search)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
