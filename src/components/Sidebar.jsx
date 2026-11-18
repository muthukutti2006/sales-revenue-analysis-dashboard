import React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  Upload,
  Table,
  TrendingUp,
  X,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload',    label: 'Data Upload',  icon: Upload },
  { id: 'data',      label: 'Data Table',   icon: Table },
  { id: 'charts',    label: 'Analytics',    icon: BarChart2 },
];

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-slate-900 z-30 flex flex-col transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">SalesIQ</p>
              <p className="text-slate-400 text-xs leading-tight">Analytics Dashboard</p>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-4 mb-3">
            Main Menu
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={clsx(
                'sidebar-link w-full text-left',
                activeTab === id && 'active'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">TX</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Thiranex</p>
              <p className="text-slate-400 text-xs">Data Analytics</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
