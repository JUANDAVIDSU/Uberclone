import { PRICING } from '../config/pricing';

export const calculateFare = ({
  distanceKm,
  durationMin,
  category,
  tip = 0,
  commissionRate = PRICING.commissionRate, 
}) => {
  const multiplier = PRICING.multipliers[category] ?? 1;
  const raw =
    (PRICING.baseFare +
      distanceKm * PRICING.perKm +
      durationMin * PRICING.perMinute) *
    multiplier;

  const fare = Math.round(Math.max(PRICING.minimumFare, raw) / 100) * 100;
  const commission = Math.round(fare * commissionRate);
  const driverEarnings = fare - commission + tip;

  return { fare, commission, driverEarnings };
};
