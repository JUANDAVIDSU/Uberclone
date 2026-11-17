export const formatCOP = (n) => {
  const v = Math.round(n || 0);
  return (v < 0 ? '-' : '') + '$' + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const toDate = (ts) => {
  if (!ts) return null;
  if (typeof ts.toDate === 'function') return ts.toDate();
  return ts instanceof Date ? ts : null;
};
