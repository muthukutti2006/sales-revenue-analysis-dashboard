import React from 'react';
import clsx from 'clsx';

export default function KPICard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',  text: 'text-blue-700' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-100 text-green-600', text: 'text-green-700' },
    amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600',text: 'text-purple-700' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="kpi-card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', c.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {subtitle && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{subtitle}</span>
        </div>
      )}
      {trend !== undefined && (
        <div className={clsx(
          'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full self-start',
          trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        )}>
          <span>{trend >= 0 ? '▲' : '▼'}</span>
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
