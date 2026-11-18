import React, { useMemo } from 'react';
import { filterData } from '../utils/dataProcessor';
import DataTable from '../components/DataTable';
import FilterPanel from '../components/FilterPanel';
import { exportToCSV } from '../utils/fileParser';
import { Download } from 'lucide-react';

export default function DataTablePage({ data, filters, setFilters }) {
  const filteredData = useMemo(() => filterData(data, filters), [data, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Table</h1>
          <p className="text-gray-500 text-sm mt-1">View, search, sort and export your filtered data.</p>
        </div>
        {filteredData.length > 0 && (
          <button
            onClick={() => exportToCSV(filteredData)}
            className="btn-primary"
          >
            <Download className="w-4 h-4" />
            Export Filtered CSV
          </button>
        )}
      </div>

      {data.length > 0 && (
        <FilterPanel data={data} filters={filters} setFilters={setFilters} />
      )}

      <DataTable data={filteredData} />
    </div>
  );
}
