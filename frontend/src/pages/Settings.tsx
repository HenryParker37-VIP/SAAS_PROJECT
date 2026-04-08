import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { User, Palette, Shield } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your account preferences.</p>
        </div>

        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">Profile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
              <p className="text-foreground">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <p className="text-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <button
              onClick={() => {
                toggleTheme();
                addToast(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'success');
              }}
              className="px-4 py-2 text-sm rounded-lg border border-border bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">Security</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-sm text-muted-foreground">Last changed: Never</p>
            </div>
            <button
              onClick={() => addToast('Password change coming soon', 'info')}
              className="px-4 py-2 text-sm rounded-lg border border-border bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
          <p className="text-sm text-primary font-medium">Demo Mode</p>
          <p className="text-sm text-muted-foreground mt-1">
            This is a demo application. Data is simulated and live updates are generated via WebSocket.
            Log in with <strong>demo@example.com</strong> / <strong>demo123</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
