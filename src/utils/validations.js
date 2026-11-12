import { TECNOMECANICA_DESDE_ANOS } from '../config/pricing';

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLACA = /^[A-Z]{3}\d{3}$/;

const edad = (fecha) => {
  const hoy = new Date();
  let e = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) e--;
  return e;
};

// datos del conductor
export const validateTab1 = (d) => {
  const e = {};

  if (!d.photo) e.photo = 'err.photo';

  if (!d.fullName?.trim()) e.fullName = 'err.required';
  else if (d.fullName.length > 50) e.fullName = 'err.max50';
  else if (!SOLO_LETRAS.test(d.fullName)) e.fullName = 'err.onlyLetters';

  if (!/^\d{6,10}$/.test(d.documentId || '')) e.documentId = 'err.doc';

  if (!/^\d{10}$/.test(d.phone || '')) e.phone = 'err.phone';

  if (!d.birthDate) e.birthDate = 'err.birth';
  else if (edad(d.birthDate) < 18) e.birthDate = 'err.adult';

  if (!d.gender) e.gender = 'err.gender';
  if (!EMAIL.test(d.email || '')) e.email = 'err.email';
  if (!d.language) e.language = 'err.language';

  if ((d.password || '').length < 6) e.password = 'err.passMin';
  if (d.password !== d.confirmPassword) e.confirmPassword = 'err.passMatch';

  return e;
};

// vehiculo
export const validateTab2 = (d) => {
  const e = {};

  if (!d.category) e.category = 'err.category';

  if (!PLACA.test((d.plate || '').toUpperCase())) e.plate = 'err.plate';

  if (!d.brand?.trim()) e.brand = 'err.required';
  else if (d.brand.length > 30) e.brand = 'err.max30';

  if (!d.model?.trim()) e.model = 'err.required';
  else if (d.model.length > 30) e.model = 'err.max30';

  if (!/^\d{4}$/.test(d.year || '') || Number(d.year) > new Date().getFullYear())
    e.year = 'err.year';

    if (!d.color?.trim()) e.color = 'err.required';
    else if (d.color.length > 20) e.color = 'err.max20';
    else if (!SOLO_LETRAS.test(d.color)) e.color = 'err.onlyLetters';

  const cap = Number(d.capacity);
  if (!/^\d+$/.test(d.capacity || '') || cap < 1) e.capacity = 'err.capacity';
  else if (d.category === 'xl' && cap < 6) e.capacity = 'err.xlMin';

  if (!d.vehiclePhoto) e.vehiclePhoto = 'err.vehiclePhoto';

  return e;
};

// ¿La revisión técnico-mecánica aplica según el año del vehículo?
export const rtmApplies = (year) => {
  if (!/^\d{4}$/.test(year || '')) return false;
  return new Date().getFullYear() - Number(year) >= TECNOMECANICA_DESDE_ANOS;
};

// La fecha de vencimiento debe ser posterior a hoy (se compara sin la hora)
const esFutura = (fecha) => {
  const f = new Date(fecha);
  f.setHours(0, 0, 0, 0);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return f > hoy;
};

// pestaña 3: documentos y pagos (recibe los datos de la pestaña 3 y el año del vehículo)
export const validateTab3 = (d, vehicleYear) => {
  const e = {};

  if (!/^\d{5,15}$/.test(d.licenseNumber || '')) e.licenseNumber = 'err.license';
  if (!d.licensePhoto) e.licensePhoto = 'err.photoRequired';
  if (!d.licenseExpiry) e.licenseExpiry = 'err.expiryRequired';
  else if (!esFutura(d.licenseExpiry)) e.licenseExpiry = 'err.expired';

  if (!d.soatPhoto) e.soatPhoto = 'err.photoRequired';
  if (!d.soatExpiry) e.soatExpiry = 'err.expiryRequired';
  else if (!esFutura(d.soatExpiry)) e.soatExpiry = 'err.expired';

  // Revisión técnico-mecánica: solo si aplica según el año del vehículo
  if (rtmApplies(vehicleYear)) {
    if (!d.rtmPhoto) e.rtmPhoto = 'err.photoRequired';
    if (!d.rtmExpiry) e.rtmExpiry = 'err.expiryRequired';
    else if (!esFutura(d.rtmExpiry)) e.rtmExpiry = 'err.expired';
  }

  if (!EMAIL.test(d.mpEmail || '')) e.mpEmail = 'err.email';
  if (!d.terms) e.terms = 'err.terms';

  return e;
};

// perfil: datos editables del conductor (nombre y celular)
export const validateProfile = (d) => {
  const e = {};
  if (!d.fullName?.trim()) e.fullName = 'err.required';
  else if (d.fullName.length > 50) e.fullName = 'err.max50';
  else if (!SOLO_LETRAS.test(d.fullName)) e.fullName = 'err.onlyLetters';
  if (!/^\d{10}$/.test(d.phone || '')) e.phone = 'err.phone';
  return e;
};
