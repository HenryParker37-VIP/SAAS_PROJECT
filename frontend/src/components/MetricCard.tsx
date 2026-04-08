import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
}

export function MetricCard({ title, value, change, changeType = 'neutral', icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
        {change && (
          <p
            className={cn(
              'text-xs font-medium mt-1',
              changeType === 'positive' && 'text-green-500',
              changeType === 'negative' && 'text-red-500',
              changeType === 'neutral' && 'text-muted-foreground',
            )}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
