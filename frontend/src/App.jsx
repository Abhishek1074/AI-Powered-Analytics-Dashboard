import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Stack, Alert } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { fetchDashboard, fetchFilters, errorMessage } from './api/client.js';
import { formatCurrency, formatNumber } from './utils/format.js';
import KpiCard from './components/KpiCard.jsx';
import ChartCard from './components/ChartCard.jsx';
import FilterBar, { EMPTY_FILTERS } from './components/FilterBar.jsx';
import InsightsPanel from './components/InsightsPanel.jsx';
import {
  RevenueTrendChart,
  CategoryBarChart,
  RegionDoughnutChart,
  TopProductsChart,
} from './components/Charts.jsx';

export default function App() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [options, setOptions] = useState({ regions: [], categories: [] });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFilters()
      .then(setOptions)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchDashboard(filters)
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const s = data?.summary;
  const hasData = !!s && s.orders > 0;

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <InsightsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1">
            AI Analytics Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <FilterBar filters={filters} options={options} onChange={setFilters} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Total revenue"
                value={formatCurrency(s?.totalRevenue)}
                icon={<AttachMoneyIcon />}
                color="primary.main"
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Orders"
                value={formatNumber(s?.orders)}
                icon={<ShoppingCartIcon />}
                color="secondary.main"
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Units sold"
                value={formatNumber(s?.totalUnits)}
                icon={<Inventory2Icon />}
                color="success.main"
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Avg. order value"
                value={formatCurrency(s?.avgOrderValue)}
                icon={<ReceiptLongIcon />}
                color="warning.main"
                loading={loading}
              />
            </Grid>
          </Grid>

          <InsightsPanel filters={filters} disabled={loading || !hasData} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <ChartCard title="Revenue over time" loading={loading} empty={!hasData}>
                {data && <RevenueTrendChart data={data.monthly} />}
              </ChartCard>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <ChartCard title="Revenue by region" loading={loading} empty={!hasData}>
                {data && <RegionDoughnutChart data={data.byRegion} />}
              </ChartCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title="Revenue by category" loading={loading} empty={!hasData}>
                {data && <CategoryBarChart data={data.byCategory} />}
              </ChartCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title="Top 5 products" loading={loading} empty={!hasData}>
                {data && <TopProductsChart data={data.topProducts} />}
              </ChartCard>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
