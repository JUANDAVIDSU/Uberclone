import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PRICING, REQUEST_MAX_AGE_SECONDS } from '../config/pricing';
import { calculateFare } from '../utils/calculateFare';
import { nextWallet } from '../utils/wallet';

const withId = (d) => ({ id: d.id, ...d.data() });

const isFresh = (trip) => {
  const created = trip.createdAt?.toDate ? trip.createdAt.toDate().getTime() : null;
  return created == null || Date.now() - created < REQUEST_MAX_AGE_SECONDS * 1000;
};

export const subscribeRequests = (category, callback) => {
  const q = query(collection(db, 'trips'), where('status', '==', 'requested'));
  return onSnapshot(
    q,
    (snap) =>
      callback(snap.docs.map(withId).filter((t) => t.category === category && isFresh(t))),
    () => callback([])
  );
};


export const subscribeTrip = (tripId, callback) =>
  onSnapshot(
    doc(db, 'trips', tripId),
    (snap) => callback(snap.exists() ? withId(snap) : null),
    () => callback(null)
  );

export const getTrip = async (tripId) => {
  const snap = await getDoc(doc(db, 'trips', tripId));
  return snap.exists() ? withId(snap) : null;
};

// Todos los viajes del conductor (se ordenan y paginan en la app para no

export const getDriverTrips = async (uid) => {
  const snap = await getDocs(query(collection(db, 'trips'), where('driverId', '==', uid)));
  return snap.docs.map(withId);
};

export const acceptTrip = async (tripId, driverId) => {
  const ref = doc(db, 'trips', tripId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists() || snap.data().status !== 'requested') throw new Error('TRIP_TAKEN');
    tx.update(ref, {
      status: 'accepted',
      driverId,
      commissionRate: PRICING.commissionRate,
      acceptedAt: serverTimestamp(),
    });
  });
  
  await updateDoc(ref, { status: 'driver_arriving' });
};


export const rejectTrip = async (tripId) => {
  const ref = doc(db, 'trips', tripId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists() && snap.data().status === 'requested') {
      tx.update(ref, { status: 'rejected' });
    }
  });
};

export const setTripStatus = (tripId, status) =>
  updateDoc(doc(db, 'trips', tripId), { status });


export const finishTrip = (trip, routePoints) => {
  const rate = trip.commissionRate ?? PRICING.commissionRate;
  const { fare, commission, driverEarnings } = calculateFare({
    distanceKm: trip.distanceKm,
    durationMin: trip.durationMin,
    category: trip.category,
    tip: trip.tip || 0,
    commissionRate: rate,
  });
  return updateDoc(doc(db, 'trips', trip.id), {
    status: 'completed',
    fare,
    commission,
    driverEarnings,
    commissionRate: rate,
    routePoints: routePoints || [],
    completedAt: serverTimestamp(),
  });
};


const settleTrip = (tripId, tripChanges, requirePaid) =>
  runTransaction(db, async (tx) => {
    const tripRef = doc(db, 'trips', tripId);
    const tripSnap = await tx.get(tripRef);
    if (!tripSnap.exists()) throw new Error('NO_TRIP');
    const trip = tripSnap.data();
    if (trip.walletSettled) return;
    if (requirePaid && trip.status !== 'paid') return;

    const driverRef = doc(db, 'drivers', trip.driverId);
    const driverSnap = await tx.get(driverRef);
    const wallet = nextWallet(driverSnap.data()?.wallet, trip);

    tx.update(tripRef, { ...tripChanges, status: 'paid', walletSettled: true });
    tx.update(driverRef, { wallet: { ...wallet, updatedAt: serverTimestamp() } });
  });


export const payCash = (tripId) => settleTrip(tripId, { paymentStatus: 'cash' }, false);
export const settlePaidTrip = (tripId) => settleTrip(tripId, {}, true);
