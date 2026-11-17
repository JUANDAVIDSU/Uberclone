import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { updateDriverLocation } from '../services/driverService';
import { LOCATION_INTERVAL_MS } from '../config/pricing';

const toCoords = (pos) => ({
  latitude: pos.coords.latitude,
  longitude: pos.coords.longitude,
});

export default function useDriverLocation(enabled, uid) {
  const [location, setLocation] = useState(null);
  const [permission, setPermission] = useState(null); // 'granted' | 'denied'

  useEffect(() => {
    if (!uid) return undefined;
    let active = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!active) return;
        setPermission(status);
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({});
        if (active) setLocation(toCoords(pos));
      } catch (e) {
        if (active) setPermission('denied');
      }
    })();
    return () => {
      active = false;
    };
  }, [uid]);

  useEffect(() => {
    if (!enabled || !uid || permission !== 'granted') return undefined;
    let cancelled = false;
    let subscription = null;
    let lastSave = 0;

    (async () => {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: LOCATION_INTERVAL_MS,
          distanceInterval: 5,
        },
        (pos) => {
          const coords = toCoords(pos);
          setLocation(coords);
          const now = Date.now();
          if (now - lastSave >= LOCATION_INTERVAL_MS) {
            lastSave = now;
            updateDriverLocation(uid, coords).catch(() => {});
          }
        }
      );
      if (cancelled) sub.remove();
      else subscription = sub;
    })();

    return () => {
      cancelled = true;
      if (subscription) subscription.remove();
    };
  }, [enabled, uid, permission]);

  return { location, permission };
}
