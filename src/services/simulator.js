
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getRouteInfo, haversineKm } from '../utils/geo';
import { randomTripPlan } from '../utils/randomTrip';

export const createRandomTrip = async (location, category) => {
  const plan = randomTripPlan(location);
  const info = await getRouteInfo(plan.from, plan.to);

  const start = info ? info.points[0] : plan.from;
  const end = info ? info.points[info.points.length - 1] : plan.to;
  const straight = haversineKm(
    { lat: start.latitude, lng: start.longitude },
    { lat: end.latitude, lng: end.longitude }
  );
  const distanceKm = Math.max(0.5, Math.round((info ? info.distanceKm : straight * 1.3) * 10) / 10);
  const durationMin = Math.max(3, Math.round(info ? info.durationMin : (distanceKm / 30) * 60));

  const ref = await addDoc(collection(db, 'trips'), {
    driverId: null,
    passengerId: 'simulated-passenger',
    origin: { lat: start.latitude, lng: start.longitude, address: plan.originAddress },
    destination: { lat: end.latitude, lng: end.longitude, address: plan.destinationAddress },
    distanceKm,
    durationMin,
    category,
    tip: plan.tip,
    paymentMethod: plan.paymentMethod,
    paymentStatus: 'pending',
    paymentId: null,
    status: 'requested',
    rating: null,
    createdAt: serverTimestamp(),
    completedAt: null,
  });
  return ref.id;
};
const started = new Set();
export const simulatePassengerPayment = (tripId) => {
  if (started.has(tripId)) return;
  started.add(tripId);

  const ref = doc(db, 'trips', tripId);
  const approve = () =>
    updateDoc(ref, {
      paymentStatus: 'approved',
      paymentId: 'SIM-' + Date.now(),
      status: 'paid',
    });

  setTimeout(async () => {
    try {
      if (Math.random() < 0.2) {
        await updateDoc(ref, { paymentStatus: 'rejected' });
        setTimeout(() => approve().catch(() => {}), 4000);
      } else {
        await approve();
      }
    } catch (e) {
    }
  }, 3000 + Math.random() * 3000);
};
