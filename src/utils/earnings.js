
import { periodStart, tripDate } from './dates';

const sumPeriod = (list) => {
  const count = list.length;
  const sum = (k) => list.reduce((acc, t) => acc + (t[k] || 0), 0);
  const net = sum('driverEarnings');
  return {
    count,
    billed: sum('fare'), 
    commissions: sum('commission'),
    tips: sum('tip'), 
    net,
    average: count ? Math.round(net / count) : 0, 
  };
};

export const computeEarnings = (trips, now = new Date()) => {
  const paid = trips.filter((t) => t.status === 'paid');
  const since = (period) => {
    const start = periodStart(period, now);
    return paid.filter((t) => {
      const d = tripDate(t);
      return d && d >= start;
    });
  };

  const balance = paid.reduce(
    (acc, t) =>
      acc + (t.paymentMethod === 'cash' ? -(t.commission || 0) : t.driverEarnings || 0),
    0
  );

  return {
    today: sumPeriod(since('today')),
    week: sumPeriod(since('week')),
    month: sumPeriod(since('month')),
    balance,
  };
};
