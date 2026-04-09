import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { Toasts } from '@/components/Toasts';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/Landing';
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';
import { DashboardPage } from '@/pages/Dashboard';
import { TransactionsPage } from '@/pages/Transactions';
import { SettingsPage } from '@/pages/Settings';
import { AdminPage } from '@/pages/Admin';
import { NotFoundPage } from '@/pages/NotFound';
import { Loader2 } from 'lucide-react';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toasts />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
