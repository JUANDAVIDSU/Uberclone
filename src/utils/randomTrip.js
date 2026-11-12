
const STREET_TYPES = ['Calle', 'Carrera', 'Avenida', 'Transversal', 'Diagonal'];
const METHODS = ['cash', 'cash', 'mercadopago', 'mercadopago', 'stripe']; // más efectivo y Mercado Pago
const TIPS = [0, 0, 0, 1000, 2000, 3000];

const between = (rng, min, max) => min + rng() * (max - min);
const pick = (rng, list) => list[Math.floor(rng() * list.length)];

export const offsetPoint = (p, km, bearing) => ({
  latitude: p.latitude + (km * Math.cos(bearing)) / 111,
  longitude:
    p.longitude + (km * Math.sin(bearing)) / (111 * Math.cos((p.latitude * Math.PI) / 180)),
});

export const randomAddress = (rng = Math.random) =>
  `${pick(rng, STREET_TYPES)} ${Math.floor(between(rng, 1, 120))} #${Math.floor(
    between(rng, 1, 90)
  )}-${Math.floor(between(rng, 1, 99))}`;

export const randomTripPlan = (location, rng = Math.random) => {
  const from = offsetPoint(location, between(rng, 0.4, 1.8), between(rng, 0, 2 * Math.PI));
  const to = offsetPoint(from, between(rng, 1.5, 7), between(rng, 0, 2 * Math.PI));
  return {
    from,
    to,
    originAddress: randomAddress(rng),
    destinationAddress: randomAddress(rng),
    tip: pick(rng, TIPS),
    paymentMethod: pick(rng, METHODS),
  };
};

export const randomDelaySeconds = (min, max, rng = Math.random) => between(rng, min, max);
