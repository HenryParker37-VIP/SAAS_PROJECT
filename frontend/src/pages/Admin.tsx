import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Clock, LogIn, Loader2, RefreshCw, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginEntry {
  timestamp: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string | null;
  loginCount: number;
  loginHistory: LoginEntry[];
  joinedAt: string;
}

export function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Redirect non-admin users
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

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
      if (!res.ok) {
        if (res.status === 403) throw new Error('Admin access required');
        throw new Error('Failed to fetch users');
      }
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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">User Tracker</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin Only
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              Monitor login activity. Click a user row to see their login history.
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
                  {users.reduce((sum, u) => sum + u.loginCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Logins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-card-foreground">All Registered Users</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Passwords are never shown. Click a row to see login history.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8"></th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Login</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Logins</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-destructive">{error}</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <>
                      <tr
                        key={user.id}
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {expandedUser === user.id
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                              user.role === 'admin'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground'
                            )}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-foreground font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            user.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            {user.role}
                          </span>
                        </td>
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
                      {/* Login History Dropdown */}
                      {expandedUser === user.id && (
                        <tr key={`${user.id}-history`}>
                          <td colSpan={8} className="bg-muted/20 px-8 py-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-foreground">
                                Login History ({user.loginHistory.length} records)
                              </p>
                              {user.loginHistory.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No login history yet.</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {[...user.loginHistory].reverse().map((entry, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm"
                                    >
                                      <LogIn className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                      <span className="text-foreground">{formatDate(entry.timestamp)}</span>
                                      <span className="text-xs text-muted-foreground ml-auto">
                                        {timeAgo(entry.timestamp)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
