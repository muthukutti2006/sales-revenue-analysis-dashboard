/**
 * sampleData.js
 * Realistic sample sales dataset for the Sales & Revenue Analysis Dashboard.
 * Fields: Date, OrderID, Product, Category, Region, UnitsSold, UnitPrice, COGS (Cost of Goods Sold)
 *
 * Revenue  = UnitsSold × UnitPrice
 * COGS     = UnitsSold × CostPerUnit
 * Profit   = Revenue − COGS
 */

const categories = {
  Electronics: {
    products: [
      { name: 'Laptop Pro 15"', unitPrice: 1299, costRatio: 0.62 },
      { name: 'Wireless Headphones', unitPrice: 249, costRatio: 0.55 },
      { name: '4K Smart TV 55"', unitPrice: 799, costRatio: 0.65 },
      { name: 'Smartphone X12', unitPrice: 899, costRatio: 0.60 },
      { name: 'Tablet Ultra', unitPrice: 549, costRatio: 0.58 },
      { name: 'Bluetooth Speaker', unitPrice: 129, costRatio: 0.50 },
    ],
  },
  Furniture: {
    products: [
      { name: 'Ergonomic Office Chair', unitPrice: 449, costRatio: 0.58 },
      { name: 'Standing Desk', unitPrice: 599, costRatio: 0.60 },
      { name: 'Bookshelf 5-Tier', unitPrice: 189, costRatio: 0.52 },
      { name: 'Sofa 3-Seater', unitPrice: 999, costRatio: 0.63 },
      { name: 'Dining Table Set', unitPrice: 749, costRatio: 0.61 },
    ],
  },
  Clothing: {
    products: [
      { name: 'Men\'s Formal Suit', unitPrice: 299, costRatio: 0.45 },
      { name: 'Women\'s Winter Jacket', unitPrice: 189, costRatio: 0.42 },
      { name: 'Running Shoes', unitPrice: 119, costRatio: 0.48 },
      { name: 'Casual T-Shirt Pack', unitPrice: 49, costRatio: 0.38 },
      { name: 'Denim Jeans', unitPrice: 79, costRatio: 0.40 },
    ],
  },
  'Office Supplies': {
    products: [
      { name: 'Premium Notebook Set', unitPrice: 29, costRatio: 0.40 },
      { name: 'Ergonomic Mouse', unitPrice: 59, costRatio: 0.50 },
      { name: 'Mechanical Keyboard', unitPrice: 149, costRatio: 0.55 },
      { name: 'Monitor Stand', unitPrice: 89, costRatio: 0.52 },
      { name: 'Desk Lamp LED', unitPrice: 69, costRatio: 0.48 },
    ],
  },
  'Sports & Fitness': {
    products: [
      { name: 'Treadmill Home Pro', unitPrice: 1199, costRatio: 0.65 },
      { name: 'Yoga Mat Premium', unitPrice: 59, costRatio: 0.42 },
      { name: 'Dumbbell Set 20kg', unitPrice: 189, costRatio: 0.55 },
      { name: 'Cycling Helmet', unitPrice: 99, costRatio: 0.50 },
      { name: 'Protein Powder 2kg', unitPrice: 69, costRatio: 0.45 },
    ],
  },
};

const regions = ['North', 'South', 'East', 'West', 'Central'];

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateSampleData() {
  const rand = seededRand(42);
  const rows = [];
  let orderId = 10001;

  const categoryNames = Object.keys(categories);

  // Generate ~400 rows over 12 months (Jan–Dec 2024)
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    const ordersThisMonth = 28 + Math.floor(rand() * 20); // 28–47 orders/month

    for (let o = 0; o < ordersThisMonth; o++) {
      const day = 1 + Math.floor(rand() * daysInMonth);
      const dateStr = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const catName = categoryNames[Math.floor(rand() * categoryNames.length)];
      const catProducts = categories[catName].products;
      const product = catProducts[Math.floor(rand() * catProducts.length)];
      const region = regions[Math.floor(rand() * regions.length)];
      const unitsSold = 1 + Math.floor(rand() * 15);
      const unitPrice = product.unitPrice * (0.9 + rand() * 0.2); // ±10% price variation
      const costPerUnit = unitPrice * product.costRatio;

      rows.push({
        OrderID: `ORD-${orderId++}`,
        Date: dateStr,
        Product: product.name,
        Category: catName,
        Region: region,
        UnitsSold: unitsSold,
        UnitPrice: parseFloat(unitPrice.toFixed(2)),
        CostPerUnit: parseFloat(costPerUnit.toFixed(2)),
        Revenue: parseFloat((unitsSold * unitPrice).toFixed(2)),
        COGS: parseFloat((unitsSold * costPerUnit).toFixed(2)),
        Profit: parseFloat((unitsSold * (unitPrice - costPerUnit)).toFixed(2)),
      });
    }
  }

  return rows;
}

export const SAMPLE_COLUMNS = [
  'OrderID', 'Date', 'Product', 'Category', 'Region',
  'UnitsSold', 'UnitPrice', 'CostPerUnit', 'Revenue', 'COGS', 'Profit',
];
