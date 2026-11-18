import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  getMonthlyRevenueTrend,
  getCategoryBreakdown,
  getTop5Products,
  getRegionRevenue,
  getMonthlySalesComparison,
  formatCurrency,
} from '../utils/dataProcessor';
import { CustomTooltip, PieLabel } from './ChartTooltip';

const CHART_COLORS = {
  revenue: '#3b82f6',
  profit:  '#10b981',
  sales:   '#f59e0b',
  orders:  '#8b5cf6',
};

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

function SectionTitle({ children }) {
  return <h3 className="text-base font-semibold text-gray-800 mb-4">{children}</h3>;
}

/** 1. Monthly Revenue Trend — Line Chart */
export function MonthlyRevenueTrendChart({ data }) {
  const chartData = useMemo(() => getMonthlyRevenueTrend(data), [data]);
  if (chartData.length === 0) return <EmptyChart />;
  return (
    <div className="chart-container">
      <SectionTitle>Monthly Revenue Trend</SectionTitle>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fontSize: 11, fill: '#6b7280' }} width={70} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Revenue" stroke={CHART_COLORS.revenue} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Profit"  stroke={CHART_COLORS.profit}  strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 2. Sales by Category — Bar Chart */
export function CategoryBarChart({ data }) {
  const chartData = useMemo(() => getCategoryBreakdown(data), [data]);
  if (chartData.length === 0) return <EmptyChart />;
  return (
    <div className="chart-container">
      <SectionTitle>Revenue by Category</SectionTitle>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-15} textAnchor="end" height={45} />
          <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fontSize: 11, fill: '#6b7280' }} width={70} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Revenue" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
            ))}
          </Bar>
          <Bar dataKey="Profit" fill={CHART_COLORS.profit} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 3. Top 5 Products — Horizontal Bar Chart */
export function Top5ProductsChart({ data }) {
  const chartData = useMemo(() => getTop5Products(data), [data]);
  if (chartData.length === 0) return <EmptyChart />;

  // Shorten product names for display
  const display = chartData.map(d => ({
    ...d,
    shortName: d.name.length > 20 ? d.name.substring(0, 18) + '…' : d.name,
  }));

  return (
    <div className="chart-container">
      <SectionTitle>Top 5 Products by Revenue</SectionTitle>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart layout="vertical" data={display} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tickFormatter={v => formatCurrency(v)} tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis type="category" dataKey="shortName" tick={{ fontSize: 11, fill: '#6b7280' }} width={120} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Revenue" radius={[0, 6, 6, 0]}>
            {display.map((_, i) => (
              <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 4. Region-wise Revenue — Pie Chart */
export function RegionPieChart({ data }) {
  const chartData = useMemo(() => getRegionRevenue(data), [data]);
  if (chartData.length === 0) return <EmptyChart />;
  return (
    <div className="chart-container">
      <SectionTitle>Revenue by Region</SectionTitle>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            label={PieLabel}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="custom-tooltip">
                  <p className="font-semibold text-gray-800">{d.name}</p>
                  <p className="text-blue-600 font-bold">{formatCurrency(d.value)}</p>
                </div>
              );
            }}
          />
          <Legend
            formatter={(value, entry) => (
              <span style={{ color: '#374151', fontSize: 12 }}>
                {value} ({formatCurrency(entry.payload.value)})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 5. Monthly Sales Comparison — Grouped Bar Chart */
export function MonthlySalesComparisonChart({ data }) {
  const chartData = useMemo(() => getMonthlySalesComparison(data), [data]);
  if (chartData.length === 0) return <EmptyChart />;
  return (
    <div className="chart-container">
      <SectionTitle>Monthly Sales Comparison (Revenue vs Profit)</SectionTitle>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fontSize: 11, fill: '#6b7280' }} width={70} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Revenue" fill={CHART_COLORS.revenue} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Profit"  fill={CHART_COLORS.profit}  radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="chart-container flex items-center justify-center h-48">
      <p className="text-gray-400 text-sm">No data available for this chart</p>
    </div>
  );
}
