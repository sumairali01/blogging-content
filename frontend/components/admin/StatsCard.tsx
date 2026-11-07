import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: number | string;
  subValue?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'amber' | 'purple';
}

export const StatsCard: React.FC<Props> = ({
  label,
  value,
  subValue,
  icon: Icon,
  color = 'emerald',
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-700 text-white',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      iconBg: 'bg-blue-700 text-white',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      iconBg: 'bg-amber-600 text-white',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
      iconBg: 'bg-purple-700 text-white',
    },
  };

  const selected = colorMap[color];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          {label}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subValue && (
          <span className="text-xs text-slate-500 font-medium block">
            {subValue}
          </span>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${selected.iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
