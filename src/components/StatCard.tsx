import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'amber' | 'rose';
  sublabel?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    accent: 'bg-blue-500',
  ring: 'ring-blue-100',
  sub: 'text-blue-600',
  border: 'border-blue-100',
  hover: 'hover:border-blue-300',
  shadow: 'shadow-blue-100/50',
  badge: 'bg-blue-100 text-blue-700',
  progress: 'bg-blue-500',
  progressTrack: 'bg-blue-100',
  dot: 'bg-blue-500',
    gradient: 'from-blue-50 to-white',
  iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  valueText: 'text-blue-900',
  labelText: 'text-blue-600/70',
  sublabelText: 'text-blue-500',
  borderHover: 'hover:border-blue-200',
  shadowHover: 'hover:shadow-blue-200/40',
  accentBar: 'bg-blue-500',
    statText: 'text-blue-700',
    statBg: 'bg-blue-50',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    accent: 'bg-emerald-500',
    ring: 'ring-emerald-100',
    sub: 'text-emerald-600',
    border: 'border-emerald-100',
    hover: 'hover:border-emerald-300',
    shadow: 'shadow-emerald-100/50',
    badge: 'bg-emerald-100 text-emerald-700',
    progress: 'bg-emerald-500',
    progressTrack: 'bg-emerald-100',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-50 to-white',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    valueText: 'text-emerald-900',
    labelText: 'text-emerald-600/70',
    sublabelText: 'text-emerald-500',
    borderHover: 'hover:border-emerald-200',
    shadowHover: 'hover:shadow-emerald-200/40',
    accentBar: 'bg-emerald-500',
    statText: 'text-emerald-700',
    statBg: 'bg-emerald-50',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    accent: 'bg-amber-500',
    ring: 'ring-amber-100',
    sub: 'text-amber-600',
    border: 'border-amber-100',
    hover: 'hover:border-amber-300',
    shadow: 'shadow-amber-100/50',
    badge: 'bg-amber-100 text-amber-700',
    progress: 'bg-amber-500',
    progressTrack: 'bg-amber-100',
    dot: 'bg-amber-500',
    gradient: 'from-amber-50 to-white',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    valueText: 'text-amber-900',
    labelText: 'text-amber-600/70',
    sublabelText: 'text-amber-500',
    borderHover: 'hover:border-amber-200',
    shadowHover: 'hover:shadow-amber-200/40',
    accentBar: 'bg-amber-500',
    statText: 'text-amber-700',
    statBg: 'bg-amber-50',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    accent: 'bg-rose-500',
    ring: 'ring-rose-100',
    sub: 'text-rose-600',
    border: 'border-rose-100',
    hover: 'hover:border-rose-300',
    shadow: 'shadow-rose-100/50',
    badge: 'bg-rose-100 text-rose-700',
    progress: 'bg-rose-500',
    progressTrack: 'bg-rose-100',
    dot: 'bg-rose-500',
    gradient: 'from-rose-50 to-white',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
    valueText: 'text-rose-900',
    labelText: 'text-rose-600/70',
    sublabelText: 'text-rose-500',
    borderHover: 'hover:border-rose-200',
    shadowHover: 'hover:shadow-rose-200/40',
    accentBar: 'bg-rose-500',
    statText: 'text-rose-700',
    statBg: 'bg-rose-50',
  },
};

export default function StatCard({ label, value, icon: Icon, color, sublabel }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl border ${c.border} ${c.borderHover} shadow-sm ${c.shadowHover} hover:shadow-md transition-all duration-300 p-5 group`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${c.accentBar} opacity-80`} />
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${c.valueText}`}>{value}</p>
        </div>
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl ${c.iconBg} ${c.iconText} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {sublabel && (
        <p className={`text-xs font-medium ${c.sublabelText} flex items-center gap-1`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${c.dot}`} />
          {sublabel}
        </p>
      )}
    </div>
  );
}
