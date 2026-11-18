/**
 * fileParser.js
 * Handles CSV and Excel (.xlsx) file parsing using PapaParse and SheetJS.
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parse a File object (CSV or Excel) and return raw row objects.
 * @param {File} file
 * @returns {Promise<{ rows: object[], fileName: string, fileType: string }>}
 */
export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const ext = fileName.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      parseCSV(file, fileName, resolve, reject);
    } else if (ext === 'xlsx' || ext === 'xls') {
      parseExcel(file, fileName, resolve, reject);
    } else {
      reject(new Error(`Unsupported file type ".${ext}". Please upload a .csv or .xlsx file.`));
    }
  });
}

function parseCSV(file, fileName, resolve, reject) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false, // keep as strings; we parse numbers ourselves
    complete: (results) => {
      if (results.errors && results.errors.length > 0) {
        const fatal = results.errors.filter(e => e.type === 'FieldMismatch' || e.code === 'TooFewFields');
        if (fatal.length > 0) {
          reject(new Error(`CSV parse error: ${fatal[0].message}`));
          return;
        }
      }
      resolve({ rows: results.data, fileName, fileType: 'CSV' });
    },
    error: (err) => reject(new Error(`CSV parse error: ${err.message}`)),
  });
}

function parseExcel(file, fileName, resolve, reject) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        reject(new Error('Excel file contains no sheets.'));
        return;
      }
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false, dateNF: 'yyyy-mm-dd' });
      resolve({ rows, fileName, fileType: 'Excel', sheetName });
    } catch (err) {
      reject(new Error(`Excel parse error: ${err.message}`));
    }
  };
  reader.onerror = () => reject(new Error('Failed to read file.'));
  reader.readAsArrayBuffer(file);
}

/**
 * Export data rows to a CSV file and trigger download.
 * @param {object[]} data
 * @param {string} filename
 */
export function exportToCSV(data, filename = 'filtered_sales_data.csv') {
  if (!data || data.length === 0) return;

  // Remove internal fields
  const exportData = data.map(({ _date, ...rest }) => rest);

  const csv = Papa.unparse(exportData, { header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a sample CSV file for reference.
 */
export function downloadSampleCSV(sampleData) {
  const exportData = sampleData.map(({ _date, ...rest }) => rest);
  const csv = Papa.unparse(exportData, { header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sample_sales_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
