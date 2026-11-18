/**
 * dataProcessor.js
 * Core data processing utilities for the Sales & Revenue Analysis Dashboard.
 *
 * Definitions:
 *   Revenue  = UnitsSold × UnitPrice
 *   COGS     = UnitsSold × CostPerUnit
 *   Profit   = Revenue − COGS
 *   Sales    = Total number of UnitsSold across all orders
 */

import { parse, isValid, startOfDay, endOfDay } from 'date-fns';

/** ─── FIELD NORMALISATION ──────────────────────────────────────── */
const FIELD_ALIASES = {
  orderid:     'OrderID',
  order_id:    'OrderID',
  'order id':  'OrderID',
  date:        'Date',
  orderdate:   'Date',
  'order date':'Date',
  product:     'Product',
  productname: 'Product',
  'product name': 'Product',
  category:    'Category',
  region:      'Region',
  territory:   'Region',
  unitssold:   'UnitsSold',
  'units sold':'UnitsSold',
  quantity:    'UnitsSold',
  qty:         'UnitsSold',
  unitprice:   'UnitPrice',
  'unit price':'UnitPrice',
  price:       'UnitPrice',
  sellingprice:'UnitPrice',
  costperunit: 'CostPerUnit',
  'cost per unit': 'CostPerUnit',
  cost:        'CostPerUnit',
  cogs:        'COGS',
  revenue:     'Revenue',
  sales:       'Revenue',
  profit:      'Profit',
  'net profit':'Profit',
  margin:      'Profit',
};

function normaliseKey(raw) {
  return (raw || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

function mapColumns(row) {
  const mapped = {};
  for (const [key, val] of Object.entries(row)) {
    const norm = normaliseKey(key);
    const canonical = FIELD_ALIASES[norm] || key;
    mapped[canonical] = val;
  }
  return mapped;
}

/** ─── DATE PARSING ─────────────────────────────────────────────── */
const DATE_FORMATS = [
  'yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'MM-dd-yyyy',
  'dd-MM-yyyy', 'yyyy/MM/dd', 'MMM dd yyyy', 'dd MMM yyyy',
  'MMMM dd yyyy', 'MM/dd/yy', 'dd/MM/yy', 'yyyy-MM-dd HH:mm:ss',
];

function parseDate(raw) {
  if (!raw) return null;
  const str = raw.toString().trim();
  // Handle Excel serial dates
  if (/^\d{4,6}$/.test(str)) {
    const serial = parseInt(str, 10);
    if (serial > 20000 && serial < 60000) {
      const date = new Date((serial - 25569) * 86400 * 1000);
      if (isValid(date)) return date;
    }
  }
  for (const fmt of DATE_FORMATS) {
    try {
      const d = parse(str, fmt, new Date());
      if (isValid(d)) return d;
    } catch (_) { /* continue */ }
  }
  // Native Date fallback
  const native = new Date(str);
  return isValid(native) ? native : null;
}

/** ─── NUMERIC PARSING ──────────────────────────────────────────── */
function parseNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(val.toString().replace(/[$,\s]/g, ''));
  return isNaN(n) ? null : n;
}

/** ─── VALIDATION & CLEANING ────────────────────────────────────── */
export function validateAndCleanData(rawRows) {
  const errors = [];
  const warnings = [];
  const cleaned = [];
  const seen = new Set();

  if (!rawRows || rawRows.length === 0) {
    return { data: [], errors: ['No data rows found in the file.'], warnings };
  }

  // Map columns first
  const mappedRows = rawRows.map(mapColumns);

  // Check required columns
  const firstRow = mappedRows[0];
  const hasDate = 'Date' in firstRow;
  const hasRevenue = 'Revenue' in firstRow;
  const hasUnitsSold = 'UnitsSold' in firstRow;
  const hasUnitPrice = 'UnitPrice' in firstRow;

  if (!hasDate) warnings.push('No "Date" column found – date filters will be unavailable.');
  if (!hasRevenue && !(hasUnitsSold && hasUnitPrice)) {
    errors.push('Dataset must have a "Revenue" column, or both "UnitsSold" and "UnitPrice" columns.');
    return { data: [], errors, warnings };
  }

  let dupCount = 0;
  let missingCount = 0;

  mappedRows.forEach((row, idx) => {
    const lineNo = idx + 2; // 1-indexed with header

    // ── Date
    const rawDate = row.Date;
    const parsedDate = rawDate ? parseDate(rawDate) : null;
    if (rawDate && !parsedDate) {
      warnings.push(`Row ${lineNo}: Unrecognised date "${rawDate}" – row skipped.`);
      return;
    }

    // ── Numeric fields
    let revenue = parseNum(row.Revenue);
    const unitsSold = parseNum(row.UnitsSold);
    const unitPrice = parseNum(row.UnitPrice);
    const costPerUnit = parseNum(row.CostPerUnit);
    let cogs = parseNum(row.COGS);
    let profit = parseNum(row.Profit);

    // Derive Revenue if missing
    if (revenue === null && unitsSold !== null && unitPrice !== null) {
      revenue = +(unitsSold * unitPrice).toFixed(2);
    }

    if (revenue === null) {
      warnings.push(`Row ${lineNo}: Cannot determine Revenue – row skipped.`);
      missingCount++;
      return;
    }

    // Derive COGS
    if (cogs === null && unitsSold !== null && costPerUnit !== null) {
      cogs = +(unitsSold * costPerUnit).toFixed(2);
    }

    // Derive Profit
    if (profit === null && revenue !== null && cogs !== null) {
      profit = +(revenue - cogs).toFixed(2);
    }

    // Duplicate detection (OrderID-based)
    const orderId = (row.OrderID || '').toString().trim();
    if (orderId) {
      if (seen.has(orderId)) {
        dupCount++;
        return;
      }
      seen.add(orderId);
    }

    cleaned.push({
      OrderID:     orderId || `ROW-${lineNo}`,
      Date:        parsedDate ? parsedDate.toISOString().split('T')[0] : null,
      _date:       parsedDate,
      Product:     (row.Product || 'Unknown').toString().trim(),
      Category:    (row.Category || 'Uncategorised').toString().trim(),
      Region:      (row.Region || 'Unknown').toString().trim(),
      UnitsSold:   unitsSold ?? 0,
      UnitPrice:   unitPrice ?? revenue,
      CostPerUnit: costPerUnit ?? (cogs && unitsSold ? +(cogs / unitsSold).toFixed(2) : null),
      Revenue:     revenue,
      COGS:        cogs ?? 0,
      Profit:      profit ?? 0,
    });
  });

  if (dupCount > 0) warnings.push(`${dupCount} duplicate order(s) removed.`);
  if (missingCount > 0) warnings.push(`${missingCount} row(s) skipped due to missing revenue data.`);
  if (cleaned.length === 0) {
    errors.push('No valid rows could be extracted from the file. Check column names and data format.');
  }

  return { data: cleaned, errors, warnings };
}

/** ─── FILTER ───────────────────────────────────────────────────── */
export function filterData(data, filters) {
  const { startDate, endDate, category, region, product } = filters;

  return data.filter(row => {
    // Date filter
    if (startDate || endDate) {
      if (!row._date) return false;
      const d = row._date;
      if (startDate && d < startOfDay(new Date(startDate))) return false;
      if (endDate && d > endOfDay(new Date(endDate))) return false;
    }
    // Category filter
    if (category && category !== 'All' && row.Category !== category) return false;
    // Region filter
    if (region && region !== 'All' && row.Region !== region) return false;
    // Product filter
    if (product && product !== 'All' && row.Product !== product) return false;
    return true;
  });
}

/** ─── KPI CALCULATIONS ─────────────────────────────────────────── */
export function calculateKPIs(data) {
  const totalRevenue = data.reduce((s, r) => s + (r.Revenue || 0), 0);
  const totalCOGS    = data.reduce((s, r) => s + (r.COGS || 0), 0);
  const totalProfit  = data.reduce((s, r) => s + (r.Profit || 0), 0);
  const totalSales   = data.reduce((s, r) => s + (r.UnitsSold || 0), 0);
  const totalOrders  = data.length;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    totalRevenue: +totalRevenue.toFixed(2),
    totalSales:   +totalSales.toFixed(0),
    totalOrders,
    totalProfit:  +totalProfit.toFixed(2),
    profitMargin: +profitMargin.toFixed(1),
  };
}

/** ─── CHART DATA ───────────────────────────────────────────────── */

// Monthly Revenue Trend (Line Chart)
export function getMonthlyRevenueTrend(data) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const map = {};
  data.forEach(row => {
    if (!row._date) return;
    const key = `${row._date.getFullYear()}-${row._date.getMonth()}`;
    if (!map[key]) map[key] = { label: MONTHS[row._date.getMonth()], revenue: 0, profit: 0, year: row._date.getFullYear(), month: row._date.getMonth() };
    map[key].revenue += row.Revenue || 0;
    map[key].profit  += row.Profit  || 0;
  });
  return Object.values(map)
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(d => ({ name: d.label, Revenue: +d.revenue.toFixed(2), Profit: +d.profit.toFixed(2) }));
}

// Sales by Category (Bar Chart)
export function getCategoryBreakdown(data) {
  const map = {};
  data.forEach(row => {
    const cat = row.Category || 'Unknown';
    if (!map[cat]) map[cat] = { name: cat, Revenue: 0, Profit: 0, Orders: 0 };
    map[cat].Revenue += row.Revenue || 0;
    map[cat].Profit  += row.Profit  || 0;
    map[cat].Orders  += 1;
  });
  return Object.values(map)
    .sort((a, b) => b.Revenue - a.Revenue)
    .map(d => ({ ...d, Revenue: +d.Revenue.toFixed(2), Profit: +d.Profit.toFixed(2) }));
}

// Top 5 Performing Products (Bar Chart)
export function getTop5Products(data) {
  const map = {};
  data.forEach(row => {
    const p = row.Product || 'Unknown';
    if (!map[p]) map[p] = { name: p, Revenue: 0, UnitsSold: 0 };
    map[p].Revenue   += row.Revenue   || 0;
    map[p].UnitsSold += row.UnitsSold || 0;
  });
  return Object.values(map)
    .sort((a, b) => b.Revenue - a.Revenue)
    .slice(0, 5)
    .map(d => ({ name: d.name, Revenue: +d.Revenue.toFixed(2), UnitsSold: d.UnitsSold }));
}

// Region-wise Revenue (Pie Chart)
export function getRegionRevenue(data) {
  const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
  const map = {};
  data.forEach(row => {
    const r = row.Region || 'Unknown';
    if (!map[r]) map[r] = 0;
    map[r] += row.Revenue || 0;
  });
  return Object.entries(map)
    .sort(([,a],[,b]) => b - a)
    .map(([name, value], i) => ({ name, value: +value.toFixed(2), fill: COLORS[i % COLORS.length] }));
}

// Monthly Sales Comparison (Grouped Bar Chart – Revenue vs Profit)
export function getMonthlySalesComparison(data) {
  return getMonthlyRevenueTrend(data);
}

/** ─── UNIQUE VALUES for filter dropdowns ───────────────────────── */
export function getUniqueValues(data, field) {
  return ['All', ...new Set(data.map(r => r[field]).filter(Boolean))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
}

/** ─── FORMAT HELPERS ───────────────────────────────────────────── */
export function formatCurrency(value) {
  if (value === null || value === undefined) return '$0';
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000)     return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString();
}
