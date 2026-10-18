const Sale = require('../models/Sale');

/**
 * Build a Mongo match stage from the query filters.
 * Supported: from, to (ISO dates), region, category.
 */
function buildMatch({ from, to, region, category } = {}) {
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }
  if (region && region !== 'All') match.region = region;
  if (category && category !== 'All') match.category = category;
  return match;
}

async function getSummary(filters) {
  const match = buildMatch(filters);
  const [row] = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$revenue' },
        totalUnits: { $sum: '$units' },
        orders: { $sum: 1 },
      },
    },
  ]);
  const totals = row || { totalRevenue: 0, totalUnits: 0, orders: 0 };
  return {
    totalRevenue: totals.totalRevenue,
    totalUnits: totals.totalUnits,
    orders: totals.orders,
    avgOrderValue: totals.orders ? totals.totalRevenue / totals.orders : 0,
  };
}

async function getRevenueByMonth(filters) {
  const match = buildMatch(filters);
  const rows = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        revenue: { $sum: '$revenue' },
        units: { $sum: '$units' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return rows.map((r) => ({ month: r._id, revenue: r.revenue, units: r.units }));
}

async function getRevenueBy(field, filters, limit = 10) {
  const match = buildMatch(filters);
  const rows = await Sale.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, revenue: { $sum: '$revenue' }, units: { $sum: '$units' } } },
    { $sort: { revenue: -1 } },
    { $limit: limit },
  ]);
  return rows.map((r) => ({ label: r._id, revenue: r.revenue, units: r.units }));
}

async function getFilterOptions() {
  const [regions, categories] = await Promise.all([
    Sale.distinct('region'),
    Sale.distinct('category'),
  ]);
  return { regions: regions.sort(), categories: categories.sort() };
}

/** Everything the dashboard (and Claude) needs in one object. */
async function getDashboardData(filters) {
  const [summary, monthly, byCategory, byRegion, byChannel, topProducts] = await Promise.all([
    getSummary(filters),
    getRevenueByMonth(filters),
    getRevenueBy('category', filters),
    getRevenueBy('region', filters),
    getRevenueBy('channel', filters),
    getRevenueBy('product', filters, 5),
  ]);
  return { summary, monthly, byCategory, byRegion, byChannel, topProducts };
}

module.exports = { getDashboardData, getFilterOptions, buildMatch };
