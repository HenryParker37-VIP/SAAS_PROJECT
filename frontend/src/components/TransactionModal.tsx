import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { Transaction, TransactionFormData } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null; // null = create mode, Transaction = edit mode
}

const PRODUCTS = ['Analytics Pro', 'Cloud Storage', 'API Gateway', 'Auth Service', 'Data Pipeline'];
const REGIONS = ['North America', 'Europe', 'Asia'];
const STATUSES: Array<'completed' | 'pending' | 'failed'> = ['completed', 'pending', 'failed'];

const emptyForm: TransactionFormData = {
  date: new Date().toISOString().split('T')[0],
  product: 'Analytics Pro',
  revenue: 0,
  region: 'North America',
  status: 'completed',
  description: '',
  customerName: '',
  quantity: 1,
};

export function TransactionModal({ isOpen, onClose, onSuccess, transaction }: TransactionModalProps) {
  const { addToast } = useToast();
  const [form, setForm] = useState<TransactionFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        date: new Date(transaction.date).toISOString().split('T')[0],
        product: transaction.product,
        revenue: transaction.revenue,
        region: transaction.region,
        status: transaction.status,
        description: transaction.description,
        customerName: transaction.customerName,
        quantity: transaction.quantity,
      });
    } else {
      setForm(emptyForm);
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customerName.trim()) {
      addToast('Customer name is required', 'error');
      return;
    }
    if (!form.description.trim()) {
      addToast('Description is required', 'error');
      return;
    }
    if (form.revenue <= 0) {
      addToast('Revenue must be greater than 0', 'error');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await api.updateTransaction(transaction._id, form);
        addToast('Transaction updated successfully', 'success');
      } else {
        await api.createTransaction(form);
        addToast('Transaction created successfully', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save transaction', 'error');
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof TransactionFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Customer Name</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              placeholder="e.g. Alice Johnson"
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Date & Revenue row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Revenue ($)</label>
              <input
                type="number"
                value={form.revenue || ''}
                onChange={(e) => update('revenue', Number(e.target.value))}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Product & Region row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Product</label>
              <select
                value={form.product}
                onChange={(e) => update('product', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Region</label>
              <select
                value={form.region}
                onChange={(e) => update('region', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Quantity row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as TransactionFormData['status'])}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => update('quantity', Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="e.g. Enterprise license renewal"
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
