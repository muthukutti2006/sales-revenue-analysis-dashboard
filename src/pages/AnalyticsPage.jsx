import React, { useMemo } from 'react';
import { filterData } from '../utils/dataProcessor';
import {
  MonthlyRevenueTrendChart,
  CategoryBarChart,
  Top5ProductsChart,
  RegionPieChart,
  MonthlySalesComparisonChart,
} from '../components/Charts';
import FilterPanel from '../components/FilterPanel';

export default function AnalyticsPage({ data, filters, setFilters }) {
  const filteredData = useMemo(() => filterData(data, filters), [data, filters]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <p className="text-gray-500">No data loaded. Upload a file first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">In-depth visualisations of your sales data.</p>
      </div>

      <FilterPanel data={data} filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlyRevenueTrendChart data={filteredData} />
        <CategoryBarChart        data={filteredData} />
        <Top5ProductsChart       data={filteredData} />
        <RegionPieChart          data={filteredData} />
      </div>

      <MonthlySalesComparisonChart data={filteredData} />
    </div>
  );
}
