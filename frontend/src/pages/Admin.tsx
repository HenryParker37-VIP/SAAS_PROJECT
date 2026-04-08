import { useState, useEffect } from 'react';
import { Users, Clock, LogIn, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  lastLogin: string | null;
  loginCount: number;
  joinedAt: string;
}

export function AdminPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/user/admin/users`
          : '/api/user/admin/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeAgo = (date: string | null) => {
    if (!date) return '';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Tracker</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Monitor who has logged into the platform.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{total}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                <LogIn className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {users.filter((u) => u.lastLogin).length}
                </p>
                <p className="text-sm text-muted-foreground">Have Logged In</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {users.filter((u) => !u.lastLogin).length}
                </p>
                <p className="text-sm text-muted-foreground">Never Logged In</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-card-foreground">All Registered Users</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Names and login activity only — passwords are never shown.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Login</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Logins</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-destructive">{error}</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-foreground font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3 text-foreground">
                        <div>
                          {formatDate(user.lastLogin)}
                          {user.lastLogin && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({timeAgo(user.lastLogin)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">{user.loginCount}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(user.joinedAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-medium',
                            user.lastLogin
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          )}
                        >
                          {user.lastLogin ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
