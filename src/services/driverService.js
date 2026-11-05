import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const registerDriver = async (data, password) => {
  //ya hay un conductor con ese documento de identidad
  const q = query(
    collection(db, 'drivers'),
    where('documentId', '==', data.documentId)
  );
  const snap = await getDocs(q);
  if (!snap.empty) throw new Error('DOCUMENT_EXISTS');

  // crear la cuenta en Authentication.
  // Si el correo ya existe manda el aviso
  const cred = await createUserWithEmailAndPassword(auth, data.email, password);

  // PASO 3 guardar los datos en Firestore
  await setDoc(doc(db, 'drivers', cred.user.uid), {
    ...data,
    plate: data.plate.toUpperCase(),
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};
