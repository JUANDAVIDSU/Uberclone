
import { createContext, useCallback, useContext, useState } from 'react';
import { getDriver, loginDriver, logoutDriver } from '../services/driverService';
import { useRegistro } from './RegistroContext';

const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
  const { setTab1 } = useRegistro();
  const [driver, setDriver] = useState(null);

  const login = useCallback(
    async (email, password) => {
      const data = await loginDriver(email, password);
      setDriver(data);
      if (data.language) setTab1((prev) => ({ ...prev, language: data.language }));
      return data;
    },
    [setTab1]
  );

  const logout = useCallback(async () => {
    await logoutDriver();
    setDriver(null);
  }, []);

  const refreshDriver = useCallback(async () => {
    if (!driver) return;
    const fresh = await getDriver(driver.uid);
    if (fresh) setDriver(fresh);
  }, [driver]);

  return (
    <SessionContext.Provider value={{ driver, setDriver, login, logout, refreshDriver }}>
      {children}
    </SessionContext.Provider>
  );
}
