import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { MetricCard } from '@/components/MetricCard';
import { RevenueChart, ProductChart, RegionChart } from '@/components/Charts';
import { DataTable } from '@/components/DataTable';
import { DollarSign, ShoppingCart, TrendingUp, CheckCircle, Wifi } from 'lucide-react';
import { DashboardSkeleton } from '@/components/Skeleton';
import type { Transaction } from '@/lib/api';

export function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data, loading, error } = useDashboardData();
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('newTransaction', (tx: Transaction) => {
      setLiveTransactions((prev) => [tx, ...prev].slice(0, 5));
      if (tx.status === 'completed') {
        addToast(`New transaction: $${tx.revenue.toLocaleString()} from ${tx.customerName}`, 'info');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [addToast]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-muted-foreground'}`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`$${data.metrics.totalRevenue.toLocaleString()}`}
            change={`${data.metrics.growthRate >= 0 ? '+' : ''}${data.metrics.growthRate}% from last month`}
            changeType={data.metrics.growthRate >= 0 ? 'positive' : 'negative'}
            icon={DollarSign}
          />
          <MetricCard
            title="Transactions"
            value={data.metrics.totalTransactions.toLocaleString()}
            change={`${data.metrics.completedTransactions} completed`}
            changeType="neutral"
            icon={ShoppingCart}
          />
          <MetricCard
            title="Growth Rate"
            value={`${data.metrics.growthRate >= 0 ? '+' : ''}${data.metrics.growthRate}%`}
            change="Month over month"
            changeType={data.metrics.growthRate >= 0 ? 'positive' : 'negative'}
            icon={TrendingUp}
          />
          <MetricCard
            title="Completion Rate"
            value={`${data.metrics.totalTransactions > 0 ? Math.round((data.metrics.completedTransactions / data.metrics.totalTransactions) * 100) : 0}%`}
            change={`${data.metrics.completedTransactions} of ${data.metrics.totalTransactions}`}
            changeType="positive"
            icon={CheckCircle}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueChart data={data.monthlyRevenue} />
          <ProductChart data={data.productSales} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DataTable liveTransactions={liveTransactions} />
          </div>
          <RegionChart data={data.regionDistribution} />
        </div>
      </div>
    </div>
  );
}
