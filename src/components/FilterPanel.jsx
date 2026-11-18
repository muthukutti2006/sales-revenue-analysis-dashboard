import React from 'react';
import { FilterX, ChevronDown } from 'lucide-react';
import { getUniqueValues } from '../utils/dataProcessor';

export default function FilterPanel({ data, filters, setFilters }) {
  const categories = getUniqueValues(data, 'Category');
  const regions    = getUniqueValues(data, 'Region');
  const products   = getUniqueValues(data, 'Product');

  const hasActiveFilters =
    filters.startDate || filters.endDate ||
    (filters.category && filters.category !== 'All') ||
    (filters.region   && filters.region   !== 'All') ||
    (filters.product  && filters.product  !== 'All');

  function resetFilters() {
    setFilters({ startDate: '', endDate: '', category: 'All', region: 'All', product: 'All' });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn-danger text-xs py-1.5 px-3"
          >
            <FilterX className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date range */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
            className="filter-select"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
            className="filter-select"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value, product: 'All' }))}
              className="filter-select pr-8 appearance-none"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Region</label>
          <div className="relative">
            <select
              value={filters.region}
              onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
              className="filter-select pr-8 appearance-none"
            >
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Product */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Product</label>
          <div className="relative">
            <select
              value={filters.product}
              onChange={e => setFilters(f => ({ ...f, product: e.target.value }))}
              className="filter-select pr-8 appearance-none"
            >
              {products.map(p => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
