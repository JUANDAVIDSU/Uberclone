export const nextWallet = (wallet, trip) => {
  const w = wallet || {};
  const cash = trip.paymentMethod === 'cash';
  return {
    balance: (w.balance || 0) + (cash ? -(trip.commission || 0) : trip.driverEarnings || 0),
    totalEarned: (w.totalEarned || 0) + (trip.driverEarnings || 0),
    totalCommissions: (w.totalCommissions || 0) + (trip.commission || 0),
    tripsPaid: (w.tripsPaid || 0) + 1,
  };
};
