
import { useEffect, useRef } from 'react';
import { SIMULATION } from '../config/pricing';
import { createRandomTrip } from '../services/simulator';
import { randomDelaySeconds } from '../utils/randomTrip';

export default function useRequestSimulator(enabled, location, category) {
  const locRef = useRef(location); 
  locRef.current = location;
  const hasLocation = !!location;

  useEffect(() => {
    if (!SIMULATION.enabled || !enabled || !hasLocation || !category) return undefined;

    let cancelled = false;
    const seconds = randomDelaySeconds(SIMULATION.minSeconds, SIMULATION.maxSeconds);
    const timer = setTimeout(async () => {
      if (cancelled || !locRef.current) return;
      try {
        await createRandomTrip(locRef.current, category);
      } catch (e) {
      }
    }, seconds * 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, hasLocation, category]);
}
