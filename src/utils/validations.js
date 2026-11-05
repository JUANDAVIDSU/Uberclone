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

  if (!d.color) e.color = 'err.color';

  const cap = Number(d.capacity);
  if (!/^\d+$/.test(d.capacity || '') || cap < 1) e.capacity = 'err.capacity';
  else if (d.category === 'xl' && cap < 6) e.capacity = 'err.xlMin';

  if (!d.vehiclePhoto) e.vehiclePhoto = 'err.vehiclePhoto';

  return e;
};
