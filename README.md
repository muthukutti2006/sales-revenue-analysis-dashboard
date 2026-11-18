# 📊 Sales & Revenue Analysis Dashboard

> A professional, fully interactive sales analytics dashboard built with **React.js**, **Tailwind CSS**, and **Recharts** — developed as part of the **Thiranex Data Analytics Internship**.

---

## 🌟 Project Overview

The **Sales & Revenue Analysis Dashboard** is a modern web application that enables users to upload real-world sales data (CSV or Excel), analyse it through interactive visualisations, and derive actionable business insights. All KPI calculations and charts update dynamically based on the loaded dataset and applied filters.

---

## 🎯 Project Objectives

- Provide a professional, production-ready analytics dashboard for sales data
- Support flexible data import (CSV and Excel) with automatic validation and cleaning
- Display key performance indicators (KPIs) calculated from the actual data
- Enable interactive exploration through date, category, region, and product filters
- Offer data export capabilities for further analysis

---

## ✨ Features

### 📂 Data Import
- Upload **CSV (.csv)** and **Excel (.xlsx/.xls)** files via drag-and-drop or file picker
- Built-in **sample dataset** (400+ orders, Jan–Dec 2024) for immediate exploration
- Automatic column mapping with support for alternate column names
- Validates file type, file size (max 20 MB), and data integrity
- Handles missing values, duplicate orders, and varied date formats
- Clear success, warning, and error messages

### 📈 KPI Cards
All KPIs are calculated **dynamically** from the actual dataset:
| KPI | Definition |
|-----|-----------|
| **Total Revenue** | Sum of UnitsSold × UnitPrice for all filtered orders |
| **Total Sales (Units)** | Sum of all units sold |
| **Total Orders** | Count of distinct filtered orders |
| **Total Profit** | Sum of Revenue − COGS |

### 📊 Interactive Charts
1. **Monthly Revenue Trend** — Line chart showing Revenue and Profit over time
2. **Revenue by Category** — Bar chart comparing categories
3. **Top 5 Products** — Horizontal bar chart of highest-revenue products
4. **Region-wise Revenue** — Pie chart with percentage labels
5. **Monthly Sales Comparison** — Grouped bar chart (Revenue vs Profit)

### 🔍 Interactive Filters
- **Date Range** — Start and End date pickers
- **Product Category** — Filter by category
- **Region** — Filter by sales region
- **Product** — Filter by specific product name
- All filters update **all KPI cards and charts simultaneously**
- **Reset Filters** button to restore full dataset view

### 📤 Export
- Export currently filtered data as **CSV** with one click
- Download the **sample dataset** as a CSV file

### 🎨 UI/UX
- Responsive design — works on desktop and mobile
- Professional sidebar navigation with mobile hamburger menu
- Modern colour palette with consistent typography
- Loading states, error boundaries, and empty states
- Sortable, paginated, searchable data table

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18+ | UI framework |
| Vite | 6+ | Build tool and dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | 2.x | Interactive charting library |
| SheetJS (xlsx) | 0.18+ | Excel file parsing |
| PapaParse | 5.x | CSV file parsing |
| date-fns | 3.x | Date manipulation |
| Lucide React | latest | Icon library |

---

## 📁 Project Structure

```
sales-revenue-dashboard/
├── public/
│   └── sample_sales_data.csv        # Downloadable sample dataset
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx              # Navigation sidebar
│   │   ├── KPICard.jsx              # KPI metric card
│   │   ├── Charts.jsx               # All 5 chart components
│   │   ├── ChartTooltip.jsx         # Shared tooltip components
│   │   ├── DataTable.jsx            # Sortable paginated table
│   │   ├── DataUpload.jsx           # File upload component
│   │   └── FilterPanel.jsx          # Filter controls
│   ├── data/
│   │   └── sampleData.js            # Sample data generator
│   ├── pages/
│   │   ├── DashboardPage.jsx        # Main dashboard view
│   │   ├── DataTablePage.jsx        # Data table view
│   │   └── AnalyticsPage.jsx        # Analytics-only view
│   ├── utils/
│   │   ├── dataProcessor.js         # KPIs, filtering, chart data
│   │   └── fileParser.js            # CSV / Excel file parsing
│   ├── App.jsx                      # Root component with state
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles + Tailwind
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## 📸 Dashboard Screenshots

> **Note:** Run the app locally and use your browser to take screenshots. The dashboard loads the sample dataset with one click for a complete demonstration.

**Key screens:**
- Dashboard overview with KPI cards and all charts
- Data Upload page with drag-and-drop interface
- Data Table with sorting, search, and export
- Analytics deep-dive with filtered charts

---

## 📊 Dataset Information

### Sample Dataset
The built-in sample dataset contains **400+ sales orders** (Jan–Dec 2024) across:
- **5 Categories**: Electronics, Furniture, Clothing, Office Supplies, Sports & Fitness
- **5 Regions**: North, South, East, West, Central
- **21 Products** with realistic pricing

### Required CSV Columns
Your own CSV/Excel file should include these columns (alternative names are auto-mapped):

| Column | Alternatives | Required |
|--------|-------------|----------|
| `OrderID` | `Order ID`, `order_id` | Optional |
| `Date` | `OrderDate`, `Order Date` | Yes |
| `Product` | `ProductName`, `Product Name` | Recommended |
| `Category` | — | Recommended |
| `Region` | `Territory` | Recommended |
| `UnitsSold` | `Quantity`, `qty` | Yes* |
| `UnitPrice` | `Price`, `SellingPrice` | Yes* |
| `CostPerUnit` | `Cost`, `cost per unit` | Optional |
| `Revenue` | `Sales` | Derived if missing |
| `COGS` | — | Derived if missing |
| `Profit` | `Net Profit`, `Margin` | Derived if missing |

\* Either `Revenue` OR both `UnitsSold` + `UnitPrice` are required.

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or later
- **npm** v9 or later

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/muthukutti2006/sales-revenue-analysis-dashboard.git

# 2. Navigate to the project directory
cd sales-revenue-analysis-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 How to Use the Dashboard

### Loading Data
1. Click **"Data Upload"** in the sidebar
2. Choose one of:
   - **Upload your own file**: Drag-and-drop or click to browse a `.csv` or `.xlsx` file
   - **Load Sample Dataset**: Click the button to instantly load 400+ demo orders
   - **Download Sample CSV**: Get the sample file to inspect the expected format

### Navigating the Dashboard
- **Dashboard** — KPI cards + all charts with filter controls
- **Data Upload** — Upload new files or load sample data
- **Data Table** — View, search, sort, and export the raw filtered data
- **Analytics** — Full-page chart analysis view

### Using Filters
1. Apply filters in the **Filters panel** (date range, category, region, product)
2. All KPI cards and charts update instantly
3. Click **Reset** to clear all filters

### How to Upload Excel/CSV Files
1. Navigate to **Data Upload** from the sidebar
2. Drag your `.csv` or `.xlsx` file onto the upload zone, or click to open a file dialog
3. The system automatically:
   - Detects the file type
   - Maps column names (even if they differ from the defaults)
   - Validates and cleans the data
   - Removes duplicate orders
   - Derives missing Revenue/Profit if UnitsSold and UnitPrice are present
4. After upload, you are automatically redirected to the Dashboard

---

## 🧪 Testing Performed

| Test | Status | Notes |
|------|--------|-------|
| CSV file upload | ✅ Pass | Multiple CSV formats tested |
| Excel (.xlsx) upload | ✅ Pass | Multi-sheet workbooks use first sheet |
| Sample dataset loading | ✅ Pass | 400+ rows with correct KPIs |
| KPI calculations | ✅ Pass | Revenue, Profit, Orders, Units verified manually |
| Date range filter | ✅ Pass | Charts and KPIs update correctly |
| Category filter | ✅ Pass | Cascades to product dropdown |
| Region filter | ✅ Pass | Updates all charts and KPIs |
| Product filter | ✅ Pass | All views update |
| Reset filters | ✅ Pass | Restores full dataset |
| CSV export | ✅ Pass | Downloads filtered data |
| Responsive layout | ✅ Pass | Tested on desktop and mobile views |
| Duplicate row removal | ✅ Pass | Duplicate OrderIDs removed |
| Missing data handling | ✅ Pass | Rows with missing Revenue skipped with warning |
| Invalid file type | ✅ Pass | Clear error message shown |
| File size validation | ✅ Pass | Files over 20 MB rejected |

---

## 🏢 Organisation

**Thiranex** — Data Analytics Internship  
Dashboard built as part of the internship programme to demonstrate proficiency in data visualisation, React development, and analytics engineering.

---

## 📄 License

This project is built for educational and internship demonstration purposes.
