
import { createContext, useContext, useState } from 'react';

const RegistroContext = createContext(null);

// Atajo para usar el almacén
export const useRegistro = () => useContext(RegistroContext);

export function RegistroProvider({ children }) {
  // Datos de la pestaña 1 
  const [tab1, setTab1] = useState({
    photo: null,
    fullName: '',
    documentId: '',
    phone: '',
    birthDate: null,
    gender: '',
    email: '',
    language: '',
    password: '',
    confirmPassword: '',
  });

  // Datos de la pestaña 2
  const [tab2, setTab2] = useState({
    category: '',
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    capacity: '',
    vehiclePhoto: null,
  });

 // errores como correo duplicado o placa 
  const [serverErrors, setServerErrors] = useState({});

  return (
    <RegistroContext.Provider
      value={{ tab1, setTab1, tab2, setTab2, serverErrors, setServerErrors }}
    >
      {children}
    </RegistroContext.Provider>
  );
}
