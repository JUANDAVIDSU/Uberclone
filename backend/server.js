require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('Falta FIREBASE_SERVICE_ACCOUNT en backend/.env');
}
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'AUTH_REQUIRED' });
    const decoded = await admin.auth().verifyIdToken(header.slice(7));
    req.uid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/withdrawals', authenticate, async (req, res) => {
  try {
    const snap = await db.collection('withdrawalRequests')
      .where('driverId', '==', req.uid).limit(30).get();
    const withdrawals = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id, amount: data.amount, status: data.status,
        createdAt: data.createdAt?.toDate?.().toISOString() || null,
      };
    }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    res.json({ withdrawals });
  } catch (e) {
    res.status(500).json({ error: 'WITHDRAWALS_READ_FAILED' });
  }
});

app.post('/withdrawals', authenticate, async (req, res) => {
  try {
    const driverRef = db.collection('drivers').doc(req.uid);
    const withdrawalRef = db.collection('withdrawalRequests').doc();
    let amount = 0;
    let mercadoPagoEmail = '';

    await db.runTransaction(async (tx) => {
      const driverSnap = await tx.get(driverRef);
      if (!driverSnap.exists) throw new Error('DRIVER_NOT_FOUND');
      const driver = driverSnap.data();
      if (driver.account?.status !== 'approved') throw new Error('DRIVER_NOT_APPROVED');

      mercadoPagoEmail = String(driver.payments?.mercadoPagoEmail || '').trim();
      if (!mercadoPagoEmail) throw new Error('MP_EMAIL_MISSING');

      const wallet = driver.wallet || {};
      const balance = Number(wallet.balance || 0);
      const reserved = Number(wallet.reservedBalance || 0);
      amount = Math.floor(balance - reserved);
      if (!Number.isFinite(amount) || amount < 1000) throw new Error('INSUFFICIENT_BALANCE');

      tx.update(driverRef, {
        'wallet.reservedBalance': reserved + amount,
        'wallet.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
      });
      tx.set(withdrawalRef, {
        driverId: req.uid,
        amount,
        currency: 'COP',
        mercadoPagoEmail,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.status(201).json({ id: withdrawalRef.id, amount, status: 'pending' });
  } catch (e) {
    const known = ['DRIVER_NOT_FOUND', 'DRIVER_NOT_APPROVED', 'MP_EMAIL_MISSING', 'INSUFFICIENT_BALANCE'];
    res.status(400).json({ error: known.includes(e.message) ? e.message : 'WITHDRAWAL_CREATE_FAILED' });
  }
});

// Endpoint privado para el administrador: marcar como pagado o rechazar.
// El dinero se envía manualmente desde la cuenta de Mercado Pago antes de marcar "paid".
app.post('/admin/withdrawals/:id/status', async (req, res) => {
  if (!process.env.ADMIN_API_SECRET ||
      req.headers['x-admin-secret'] !== process.env.ADMIN_API_SECRET) {
    return res.status(401).json({ error: 'ADMIN_UNAUTHORIZED' });
  }
  const { status, transferReference = '' } = req.body || {};
  if (!['paid', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'INVALID_STATUS' });
  }

  try {
    const withdrawalRef = db.collection('withdrawalRequests').doc(req.params.id);
    await db.runTransaction(async (tx) => {
      const withdrawalSnap = await tx.get(withdrawalRef);
      if (!withdrawalSnap.exists) throw new Error('WITHDRAWAL_NOT_FOUND');
      const withdrawal = withdrawalSnap.data();
      if (withdrawal.status !== 'pending') throw new Error('WITHDRAWAL_ALREADY_PROCESSED');

      const driverRef = db.collection('drivers').doc(withdrawal.driverId);
      const driverSnap = await tx.get(driverRef);
      if (!driverSnap.exists) throw new Error('DRIVER_NOT_FOUND');

      const wallet = driverSnap.data().wallet || {};
      const reserved = Number(wallet.reservedBalance || 0);
      const balance = Number(wallet.balance || 0);
      if (reserved < withdrawal.amount) throw new Error('RESERVED_BALANCE_INVALID');

      const changes = {
        'wallet.reservedBalance': reserved - withdrawal.amount,
        'wallet.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
      };
      if (status === 'paid') changes['wallet.balance'] = balance - withdrawal.amount;

      tx.update(driverRef, changes);
      tx.update(withdrawalRef, {
        status,
        transferReference: String(transferReference).slice(0, 120),
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    res.json({ ok: true, status });
  } catch (e) {
    const code = ['WITHDRAWAL_NOT_FOUND', 'WITHDRAWAL_ALREADY_PROCESSED', 'DRIVER_NOT_FOUND', 'RESERVED_BALANCE_INVALID'].includes(e.message)
      ? e.message : 'WITHDRAWAL_PROCESS_FAILED';
    res.status(400).json({ error: code });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Withdrawal API listening on ${port}`));
