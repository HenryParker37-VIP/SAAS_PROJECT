import { useToast } from '@/context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toasts() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right-5',
            'bg-card text-card-foreground min-w-[300px]',
            toast.type === 'error' && 'border-destructive/50',
            toast.type === 'success' && 'border-green-500/50',
          )}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-destructive shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-primary shrink-0" />}
          <p className="text-sm flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
