import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle, Download, Info } from 'lucide-react';
import { parseFile, downloadSampleCSV } from '../utils/fileParser';
import { validateAndCleanData } from '../utils/dataProcessor';
import { generateSampleData } from '../data/sampleData';
import clsx from 'clsx';

const MAX_FILE_SIZE_MB = 20;

export default function DataUpload({ onDataLoaded }) {
  const [status, setStatus]     = useState(null); // 'loading' | 'success' | 'error'
  const [messages, setMessages] = useState({ errors: [], warnings: [], info: '' });
  const [isDragging, setDragging] = useState(false);

  async function handleFile(file) {
    if (!file) return;

    // Size check
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setStatus('error');
      setMessages({ errors: [`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`], warnings: [], info: '' });
      return;
    }

    setStatus('loading');
    setMessages({ errors: [], warnings: [], info: '' });

    try {
      const { rows, fileName, fileType } = await parseFile(file);
      const { data, errors, warnings } = validateAndCleanData(rows);

      if (errors.length > 0) {
        setStatus('error');
        setMessages({ errors, warnings, info: '' });
        return;
      }

      setStatus('success');
      setMessages({
        errors: [],
        warnings,
        info: `✓ Loaded ${data.length.toLocaleString()} rows from "${fileName}" (${fileType})`,
      });
      onDataLoaded(data, fileName);
    } catch (err) {
      setStatus('error');
      setMessages({ errors: [err.message], warnings: [], info: '' });
    }
  }

  function loadSampleData() {
    setStatus('loading');
    setTimeout(() => {
      const raw = generateSampleData();
      // Sample data is already clean — wrap into expected shape
      const data = raw.map(r => ({ ...r, _date: new Date(r.Date) }));
      setStatus('success');
      setMessages({
        errors: [],
        warnings: [],
        info: `✓ Sample dataset loaded: ${data.length.toLocaleString()} orders (Jan–Dec 2024)`,
      });
      onDataLoaded(data, 'sample_sales_data.csv');
    }, 300);
  }

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Upload</h1>
        <p className="text-gray-500 text-sm mt-1">Upload your sales data in CSV or Excel format to begin analysis.</p>
      </div>

      {/* Drop Zone */}
      <label
        htmlFor="file-input"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={clsx(
          'flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-colors duration-200',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50',
          status === 'loading' && 'pointer-events-none opacity-60'
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Upload className="w-8 h-8 text-blue-500" />
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-semibold">
            {status === 'loading' ? 'Processing file…' : 'Drop your file here, or click to browse'}
          </p>
          <p className="text-gray-400 text-sm mt-1">Supports .csv and .xlsx files up to {MAX_FILE_SIZE_MB} MB</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> CSV</span>
          <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx)</span>
        </div>
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </label>

      {/* Status Messages */}
      {status === 'success' && messages.info && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 text-sm font-medium">{messages.info}</p>
            {messages.warnings.map((w, i) => (
              <p key={i} className="text-yellow-700 text-xs mt-1">⚠ {w}</p>
            ))}
          </div>
        </div>
      )}

      {status === 'error' && messages.errors.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            {messages.errors.map((e, i) => (
              <p key={i} className="text-red-700 text-sm font-medium">{e}</p>
            ))}
            {messages.warnings.map((w, i) => (
              <p key={i} className="text-yellow-600 text-xs mt-1">⚠ {w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={loadSampleData} className="btn-primary justify-center py-3">
          <FileSpreadsheet className="w-4 h-4" />
          Load Sample Dataset
        </button>
        <button
          onClick={() => downloadSampleCSV(generateSampleData())}
          className="btn-secondary justify-center py-3"
        >
          <Download className="w-4 h-4" />
          Download Sample CSV
        </button>
      </div>

      {/* Expected Columns Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-800 text-sm font-semibold mb-2">Expected Dataset Columns</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-blue-700">
              {[
                ['OrderID', 'Unique order identifier'],
                ['Date',    'Order date (various formats supported)'],
                ['Product', 'Product name'],
                ['Category','Product category'],
                ['Region',  'Sales region'],
                ['UnitsSold','Number of units sold'],
                ['UnitPrice','Selling price per unit'],
                ['CostPerUnit','Cost per unit (optional)'],
                ['Revenue', 'Or derived from UnitsSold × UnitPrice'],
                ['Profit',  'Or derived from Revenue − COGS'],
              ].map(([col, desc]) => (
                <div key={col} className="flex gap-1.5">
                  <span className="font-mono font-semibold text-blue-800 min-w-20">{col}</span>
                  <span className="text-blue-600">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
