import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  colorClass?: string;
  loading?: boolean;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  trendDirection = 'neutral',
  colorClass = 'bg-[#0D354E]/10 text-[#0D354E]',
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-20 rounded bg-slate-200" />
          <div className="mt-4 h-3 w-32 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trendDirection === 'up' ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : trendDirection === 'down' ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-600" />
          ) : null}
          <span
            className={cn(
              'font-semibold',
              trendDirection === 'up'
                ? 'text-emerald-600'
                : trendDirection === 'down'
                  ? 'text-red-600'
                  : 'text-slate-500'
            )}
          >
            {trend}
          </span>
          {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
