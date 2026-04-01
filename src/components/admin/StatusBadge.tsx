import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  disponible: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  vendu: 'border border-red-200 bg-red-50 text-red-700',
  reserve: 'border border-amber-200 bg-amber-50 text-amber-700',
  actif: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  inactif: 'border border-slate-200 bg-slate-100 text-slate-600',
  lu: 'border border-slate-200 bg-slate-100 text-slate-600',
  'non-lu': 'border border-blue-200 bg-blue-50 text-blue-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        statusStyles[normalized] ?? 'bg-slate-100 text-slate-600'
      )}
    >
      {status.replace('-', ' ')}
    </span>
  );
}
