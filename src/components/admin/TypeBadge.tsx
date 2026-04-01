interface TypeBadgeProps {
  type: string;
}

const typeStyles: Record<string, string> = {
  villa: 'bg-purple-50 text-purple-700',
  maison: 'bg-blue-50 text-blue-700',
  appartement: 'bg-indigo-50 text-indigo-700',
  local: 'bg-orange-50 text-orange-700',
  terrain: 'bg-green-50 text-green-700',
};

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        typeStyles[type.toLowerCase()] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {type}
    </span>
  );
}
