export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n || 0);

export const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n || 0);

export const formatMonth = (ym) => {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-US', {
    month: 'short',
    year: '2-digit',
  });
};
