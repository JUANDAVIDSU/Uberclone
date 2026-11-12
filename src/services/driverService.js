import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { buildDriverDoc, flattenDriver, PROFILE_PATHS } from '../utils/driverDoc';

export const registerDriver = async (data, password) => {
 const q = query(
    collection(db, 'drivers'),
    where('personal.documentId', '==', data.documentId)
  );
  const snap = await getDocs(q);
  if (!snap.empty) throw new Error('DOCUMENT_EXISTS');
  const cred = await createUserWithEmailAndPassword(auth, data.email, password);
await setDoc(
    doc(db, 'drivers', cred.user.uid),
    buildDriverDoc(data, serverTimestamp())
  );

  await signOut(auth);
};

export const loginDriver = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

  
  const snap = await getDoc(doc(db, 'drivers', cred.user.uid));
  if (!snap.exists()) {
    await signOut(auth);
    throw new Error('NO_DRIVER');
  }
  return flattenDriver(cred.user.uid, snap.data());
};

export const getDriver = async (uid) => {
  const snap = await getDoc(doc(db, 'drivers', uid));
  return snap.exists() ? flattenDriver(uid, snap.data()) : null;
};

export const logoutDriver = () => signOut(auth);

export const setAvailability = (uid, available) =>
  updateDoc(doc(db, 'drivers', uid), { 'account.available': available });

export const updateDriverLocation = (uid, coords) =>
  updateDoc(doc(db, 'drivers', uid), {
    location: {
      lat: coords.latitude,
      lng: coords.longitude,
      updatedAt: serverTimestamp(),
    },
  });

export const updateDriverProfile = (uid, data) => {
  const changes = {};
  Object.keys(data).forEach((k) => {
    if (PROFILE_PATHS[k]) changes[PROFILE_PATHS[k]] = data[k];
  });
  return updateDoc(doc(db, 'drivers', uid), changes);
};
