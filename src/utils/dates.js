import { toDate } from './format';


export const periodStart = (period, now = new Date()) => {
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'today') return day;
  if (period === 'week') {
    const monday = new Date(day);
    monday.setDate(day.getDate() - ((day.getDay() + 6) % 7));
    return monday;
  }
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  return null;
};


export const tripDate = (trip) =>
  toDate(trip.completedAt) || toDate(trip.createdAt);


export const filterTrips = (
  trips,
  { period = 'all', method = 'all', from = null, to = null },
  now = new Date()
) => {
  let start = periodStart(period, now);
  let end = null;
  if (period === 'range') {
    start = from ? new Date(from.getFullYear(), from.getMonth(), from.getDate()) : null;
    end = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1) : null;
  }
  return trips
    .filter((t) => {
      const d = tripDate(t);
      if (start && (!d || d < start)) return false;
      if (end && (!d || d >= end)) return false;
      if (method !== 'all' && t.paymentMethod !== method) return false;
      return true;
    })
    .sort((a, b) => (tripDate(b)?.getTime() || 0) - (tripDate(a)?.getTime() || 0));
};
