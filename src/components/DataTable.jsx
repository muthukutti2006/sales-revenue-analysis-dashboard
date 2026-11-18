import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Download, ArrowUpDown, Search,
} from 'lucide-react';
import { exportToCSV } from '../utils/fileParser';
import { formatCurrency } from '../utils/dataProcessor';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function DataTable({ data }) {
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(25);
  const [search, setSearch]       = useState('');
  const [sortField, setSortField] = useState('Date');
  const [sortDir, setSortDir]     = useState('desc');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-400 text-sm">No data to display. Upload a file or load the sample dataset.</p>
      </div>
    );
  }

  // Search
  const searched = data.filter(row =>
    Object.values(row).some(v =>
      v !== null && v !== undefined && String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sort
  const sorted = [...searched].sort((a, b) => {
    const av = a[sortField], bv = b[sortField];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * pageSize;
  const pageData   = sorted.slice(start, start + pageSize);

  const columns = [
    { key: 'OrderID',   label: 'Order ID' },
    { key: 'Date',      label: 'Date' },
    { key: 'Product',   label: 'Product' },
    { key: 'Category',  label: 'Category' },
    { key: 'Region',    label: 'Region' },
    { key: 'UnitsSold', label: 'Units Sold' },
    { key: 'UnitPrice', label: 'Unit Price' },
    { key: 'Revenue',   label: 'Revenue' },
    { key: 'COGS',      label: 'COGS' },
    { key: 'Profit',    label: 'Profit' },
  ];

  function toggleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  }

  const numericCols = new Set(['UnitsSold', 'UnitPrice', 'Revenue', 'COGS', 'Profit']);

  function cellValue(key, val) {
    if (val === null || val === undefined) return <span className="text-gray-300">—</span>;
    if (numericCols.has(key) && key !== 'UnitsSold') {
      const formatted = formatCurrency(val);
      const isNeg = val < 0;
      return <span className={isNeg ? 'text-red-500' : ''}>{formatted}</span>;
    }
    return String(val);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="filter-select pl-9"
          />
        </div>
        <select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="filter-select w-32"
        >
          {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <button
          onClick={() => exportToCSV(data)}
          className="btn-primary text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <span className="text-xs text-gray-400">{sorted.length} record{sorted.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="table-header cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <ArrowUpDown className={`w-3 h-3 ${sortField === col.key ? 'text-blue-500' : 'text-gray-300'}`} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={row.OrderID + i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="table-cell">
                    {cellValue(col.key, row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Showing {sorted.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, sorted.length)} of {sorted.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage <= 1}
            onClick={() => setPage(p => p - 1)}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p;
            if (totalPages <= 7) p = i + 1;
            else if (safePage <= 4) p = i + 1;
            else if (safePage >= totalPages - 3) p = totalPages - 6 + i;
            else p = safePage - 3 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium border ${safePage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            );
          })}
          <button
            disabled={safePage >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
