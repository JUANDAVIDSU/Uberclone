import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSession } from './SessionContext';
import useDriverLocation from '../hooks/useDriverLocation';
import { setAvailability } from '../services/driverService';
import { loadAvailable, saveAvailable } from '../utils/storage';

const DriverContext = createContext(null);

export const useDriver = () => useContext(DriverContext);

export function DriverProvider({ children }) {
  const { driver } = useSession();
  const uid = driver?.uid;

  const [available, setAvailableState] = useState(false);
  const [activeTripId, setActiveTripId] = useState(null); 
  const { location, permission } = useDriverLocation(available, uid);

  const setAvailable = useCallback(
    async (value) => {
      if (!uid) return;
      setAvailableState(value);
      try {
        await setAvailability(uid, value);
      } catch (e) {
        setAvailableState(!value);
        return;
      }
      saveAvailable(uid, value);
    },
    [uid]
  );

  useEffect(() => {
    if (!uid) {
      setAvailableState(false);
      setActiveTripId(null);
      return undefined;
    }
    let active = true;
    loadAvailable(uid).then((last) => {
      if (active && last && driver.status === 'approved') {
        setAvailableState(true);
        setAvailability(uid, true).catch(() => {});
      }
    });
    return () => {
      active = false;
    };
  },
   [uid]);

  return (
    <DriverContext.Provider
      value={{ available, setAvailable, location, permission, activeTripId, setActiveTripId }}
    >
      {children}
    </DriverContext.Provider>
  );
}
