import React from 'react';
import { formatCurrency } from '../utils/dataProcessor';

/** Shared tooltip for all Recharts charts */
export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-gray-600 text-xs">{entry.name}:</span>
          <span className="font-semibold text-gray-800 text-xs">
            {typeof entry.value === 'number' && entry.name !== 'UnitsSold' && entry.name !== 'Orders'
              ? formatCurrency(entry.value)
              : entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Pie chart custom label */
export function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}
