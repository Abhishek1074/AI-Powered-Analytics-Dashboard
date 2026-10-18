# AI-Powered Analytics Dashboard: Frontend

React + Vite + Material UI + Chart.js dashboard. It reads aggregated data from the backend REST API and shows Claude-written summaries.

## Setup

```bash
npm install
cp .env.example .env     # VITE_API_URL points at the backend
npm run dev              # http://localhost:5173
```

Start the backend first (see `../backend/README.md`).

## Structure

```
src/
  api/client.js          axios wrapper for the REST API
  components/
    FilterBar.jsx        date, region, category filters (MUI)
    KpiCard.jsx          KPI tiles
    ChartCard.jsx        card wrapper with loading and empty states
    Charts.jsx           Chart.js line, bar, doughnut charts
    InsightsPanel.jsx    "Generate summary" button + Claude output
  theme.js               MUI theme and chart palette
  App.jsx                page layout and data loading
```
