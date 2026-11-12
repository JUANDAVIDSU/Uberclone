
export const buildDriverDoc = (d, stamp) => ({
  account: {
    status: 'pending', 
    available: false,
    language: d.language,
    createdAt: stamp,
  },
  personal: {
    fullName: d.fullName,
    documentId: d.documentId,
    phone: d.phone,
    birthDate: d.birthDate,
    gender: d.gender,
    email: d.email,
    photo: d.photo,
  },
  vehicle: {
    category: d.category,
    plate: d.plate.toUpperCase(),
    brand: d.brand,
    model: d.model,
    year: d.year,
    color: d.color,
    capacity: d.capacity,
    photo: d.vehiclePhoto,
  },
  documents: {
    license: { number: d.licenseNumber, photo: d.licensePhoto, expiry: d.licenseExpiry },
    soat: { photo: d.soatPhoto, expiry: d.soatExpiry },
    technicalReview: { photo: d.rtmPhoto ?? null, expiry: d.rtmExpiry ?? null },
  },
  payments: {
    mercadoPagoEmail: d.mpEmail,
    termsAccepted: !!d.terms,
    commissionRate: d.acceptedCommissionRate,
  },
  wallet: { balance: 0, totalEarned: 0, totalCommissions: 0, tripsPaid: 0 },
});

export const flattenDriver = (uid, raw) => {
  if (!raw.personal) return { uid, ...raw };
  const { account = {}, personal = {}, vehicle = {}, documents = {}, payments = {} } = raw;
  const { license = {}, soat = {}, technicalReview = {} } = documents;
  return {
    uid,
    status: account.status,
    available: account.available,
    language: account.language,
    createdAt: account.createdAt,
    ...personal,
    category: vehicle.category,
    plate: vehicle.plate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    capacity: vehicle.capacity,
    vehiclePhoto: vehicle.photo,
    licenseNumber: license.number,
    licensePhoto: license.photo,
    licenseExpiry: license.expiry,
    soatPhoto: soat.photo,
    soatExpiry: soat.expiry,
    rtmPhoto: technicalReview.photo,
    rtmExpiry: technicalReview.expiry,
    mpEmail: payments.mercadoPagoEmail,
    acceptedCommissionRate: payments.commissionRate,
    wallet: raw.wallet,
    location: raw.location,
  };
};

export const PROFILE_PATHS = {
  fullName: 'personal.fullName',
  phone: 'personal.phone',
  language: 'account.language',
};
