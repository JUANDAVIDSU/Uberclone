
import { createContext, useContext, useEffect, useState } from 'react';
import { loadLanguage } from '../utils/storage';

const RegistroContext = createContext(null);

export const useRegistro = () => useContext(RegistroContext);

const INITIAL_TAB1 = {
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
};

const INITIAL_TAB2 = {
  category: '',
  plate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  capacity: '',
  vehiclePhoto: null,
};

const INITIAL_TAB3 = {
  licenseNumber: '',
  licensePhoto: null,
  licenseExpiry: null,
  soatPhoto: null,
  soatExpiry: null,
  rtmPhoto: null,
  rtmExpiry: null,
  mpEmail: '',
  terms: false,
};

export function RegistroProvider({ children }) {
  const [tab1, setTab1] = useState(INITIAL_TAB1); 
  const [tab2, setTab2] = useState(INITIAL_TAB2); 
  const [tab3, setTab3] = useState(INITIAL_TAB3); 

  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    loadLanguage().then((saved) => {
      if (saved === 'es' || saved === 'en') {
        setTab1((prev) => (prev.language ? prev : { ...prev, language: saved }));
      }
    });
  }, []);

  const reset = () => {
    setTab1({ ...INITIAL_TAB1, language: tab1.language });
    setTab2(INITIAL_TAB2);
    setTab3(INITIAL_TAB3);
    setServerErrors({});
  };

  return (
    <RegistroContext.Provider
      value={{
        tab1, setTab1,
        tab2, setTab2,
        tab3, setTab3,
        serverErrors, setServerErrors,
        reset,
      }}
    >
      {children}
    </RegistroContext.Provider>
  );
}
