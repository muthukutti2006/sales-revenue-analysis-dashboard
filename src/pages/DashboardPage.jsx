import React, { useMemo } from 'react';
import {
  DollarSign, ShoppingCart, Package, TrendingUp,
} from 'lucide-react';
import KPICard from '../components/KPICard';
import FilterPanel from '../components/FilterPanel';
import {
  MonthlyRevenueTrendChart,
  CategoryBarChart,
  Top5ProductsChart,
  RegionPieChart,
  MonthlySalesComparisonChart,
} from '../components/Charts';
import {
  calculateKPIs,
  filterData,
  formatCurrency,
  formatNumber,
} from '../utils/dataProcessor';

export default function DashboardPage({ data, filters, setFilters }) {
  const filteredData = useMemo(() => filterData(data, filters), [data, filters]);
  const kpi = useMemo(() => calculateKPIs(filteredData), [filteredData]);

  const noData = !data || data.length === 0;

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-blue-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg">No data loaded yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Go to <strong>Data Upload</strong> to upload a file or load the sample dataset.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Showing {filteredData.length.toLocaleString()} of {data.length.toLocaleString()} records
        </p>
      </div>

      {/* Filters */}
      <FilterPanel data={data} filters={filters} setFilters={setFilters} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpi.totalRevenue)}
          subtitle={`${filteredData.length} orders`}
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title="Total Sales (Units)"
          value={formatNumber(kpi.totalSales)}
          subtitle="Units sold"
          icon={Package}
          color="amber"
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(kpi.totalOrders)}
          subtitle="Order count"
          icon={ShoppingCart}
          color="purple"
        />
        <KPICard
          title="Total Profit"
          value={formatCurrency(kpi.totalProfit)}
          subtitle={`${kpi.profitMargin}% profit margin`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlyRevenueTrendChart data={filteredData} />
        <CategoryBarChart        data={filteredData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Top5ProductsChart            data={filteredData} />
        <RegionPieChart               data={filteredData} />
      </div>

      {/* Charts Row 3 */}
      <MonthlySalesComparisonChart data={filteredData} />
    </div>
  );
}
