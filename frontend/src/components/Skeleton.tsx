import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-32 mt-3" />
              <Skeleton className="h-3 w-40 mt-2" />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="p-4 flex gap-2 border-b border-border">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
