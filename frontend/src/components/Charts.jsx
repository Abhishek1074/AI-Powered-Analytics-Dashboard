import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { chartColors } from '../theme.js';
import { formatCurrency, formatMonth } from '../utils/format.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const money = (ctx) => ` ${formatCurrency(ctx.parsed.y ?? ctx.parsed)}`;

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const moneyAxis = {
  beginAtZero: true,
  ticks: { callback: (v) => formatCurrency(v) },
  grid: { color: '#eef0f4' },
};

export function RevenueTrendChart({ data }) {
  return (
    <Line
      data={{
        labels: data.map((d) => formatMonth(d.month)),
        datasets: [
          {
            label: 'Revenue',
            data: data.map((d) => d.revenue),
            borderColor: chartColors[0],
            backgroundColor: 'rgba(79, 70, 229, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      }}
      options={{
        ...baseOptions,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: money } } },
        scales: { y: moneyAxis, x: { grid: { display: false } } },
      }}
    />
  );
}

export function CategoryBarChart({ data }) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Revenue',
            data: data.map((d) => d.revenue),
            backgroundColor: chartColors.slice(0, data.length),
            borderRadius: 6,
          },
        ],
      }}
      options={{
        ...baseOptions,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: money } } },
        scales: { y: moneyAxis, x: { grid: { display: false } } },
      }}
    />
  );
}

export function RegionDoughnutChart({ data }) {
  return (
    <Doughnut
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.revenue),
            backgroundColor: chartColors.slice(0, data.length),
            borderWidth: 2,
          },
        ],
      }}
      options={{
        ...baseOptions,
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}` } },
        },
      }}
    />
  );
}

export function TopProductsChart({ data }) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Revenue',
            data: data.map((d) => d.revenue),
            backgroundColor: chartColors[1],
            borderRadius: 6,
          },
        ],
      }}
      options={{
        ...baseOptions,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ` ${formatCurrency(ctx.parsed.x)}` } },
        },
        scales: {
          x: { beginAtZero: true, ticks: { callback: (v) => formatCurrency(v) }, grid: { color: '#eef0f4' } },
          y: { grid: { display: false } },
        },
      }}
    />
  );
}
