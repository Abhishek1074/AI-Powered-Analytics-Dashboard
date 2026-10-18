import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // Claude responses can take a few seconds
});

// Drop empty filter values so they are not sent as blank query params.
const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null));

export const fetchFilters = () => api.get('/analytics/filters').then((r) => r.data);

export const fetchDashboard = (filters) =>
  api.get('/analytics/dashboard', { params: clean(filters) }).then((r) => r.data);

export const fetchInsights = (filters) =>
  api.post('/analytics/insights', clean(filters)).then((r) => r.data);

export const errorMessage = (err) =>
  err.response?.data?.error || err.message || 'Something went wrong';
