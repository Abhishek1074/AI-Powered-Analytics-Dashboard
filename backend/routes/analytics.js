const express = require('express');
const { getDashboardData, getFilterOptions } = require('../services/aggregation');
const { generateInsights } = require('../services/claude');

const router = express.Router();

const pickFilters = (src) => ({
  from: src.from,
  to: src.to,
  region: src.region,
  category: src.category,
});

// GET /api/analytics/filters  -> available regions and categories
router.get('/filters', async (req, res, next) => {
  try {
    res.json(await getFilterOptions());
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/dashboard?from=&to=&region=&category=
router.get('/dashboard', async (req, res, next) => {
  try {
    res.json(await getDashboardData(pickFilters(req.query)));
  } catch (err) {
    next(err);
  }
});

// POST /api/analytics/insights  body: { from, to, region, category }
// Aggregates the data in MongoDB, then asks Claude for a written summary.
router.post('/insights', async (req, res, next) => {
  try {
    const filters = pickFilters(req.body || {});
    const data = await getDashboardData(filters);

    if (!data.summary.orders) {
      return res.json({ insights: 'No data matches the selected filters.', generatedAt: new Date() });
    }

    const insights = await generateInsights(data, filters);
    res.json({ insights, generatedAt: new Date() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
