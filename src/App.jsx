import React, { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import DataTablePage from './pages/DataTablePage';
import AnalyticsPage from './pages/AnalyticsPage';
import DataUpload from './components/DataUpload';

const DEFAULT_FILTERS = {
  startDate: '',
  endDate: '',
  category: 'All',
  region: 'All',
  product: 'All',
};

export default function App() {
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [data, setData]             = useState([]);
  const [fileName, setFileName]     = useState('');
  const [filters, setFilters]       = useState(DEFAULT_FILTERS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDataLoaded = useCallback((newData, name) => {
    setData(newData);
    setFileName(name);
    setFilters(DEFAULT_FILTERS);
    setActiveTab('dashboard');
  }, []);

  const tabLabel = {
    dashboard: 'Dashboard',
    upload:    'Data Upload',
    data:      'Data Table',
    charts:    'Analytics',
  }[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content — offset for sidebar on large screens */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{tabLabel}</h2>
              {fileName && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Dataset: <span className="font-medium text-gray-500">{fileName}</span>
                  {data.length > 0 && <span> · {data.length.toLocaleString()} rows</span>}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data.length === 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                No data loaded
              </span>
            )}
            {data.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {data.length.toLocaleString()} rows loaded
              </span>
            )}
            <button
              onClick={() => setActiveTab('upload')}
              className="btn-primary text-sm"
            >
              Upload Data
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <DashboardPage data={data} filters={filters} setFilters={setFilters} />
          )}
          {activeTab === 'upload' && (
            <DataUpload onDataLoaded={handleDataLoaded} />
          )}
          {activeTab === 'data' && (
            <DataTablePage data={data} filters={filters} setFilters={setFilters} />
          )}
          {activeTab === 'charts' && (
            <AnalyticsPage data={data} filters={filters} setFilters={setFilters} />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Sales &amp; Revenue Analysis Dashboard · Thiranex Data Analytics Internship · 2024
          </p>
        </footer>
      </div>
    </div>
  );
}
