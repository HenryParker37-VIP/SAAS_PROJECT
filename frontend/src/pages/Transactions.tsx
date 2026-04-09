import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/context/ToastContext';
import { DataTable } from '@/components/DataTable';
import type { Transaction } from '@/lib/api';

export function TransactionsPage() {
  const { addToast } = useToast();
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });

    socket.on('newTransaction', (tx: Transaction) => {
      setLiveTransactions((prev) => [tx, ...prev].slice(0, 5));
      addToast(`New: $${tx.revenue.toLocaleString()} - ${tx.product}`, 'info');
    });

    return () => {
      socket.disconnect();
    };
  }, [addToast]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            View and manage all transactions with advanced filtering.
          </p>
        </div>
        <DataTable liveTransactions={liveTransactions} showAddButton={true} />
      </div>
    </div>
  );
}
