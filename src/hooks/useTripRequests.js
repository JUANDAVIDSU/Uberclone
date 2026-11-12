import { useEffect, useState } from 'react';
import { subscribeRequests } from '../services/tripService';

export default function useTripRequests(enabled, category) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!enabled || !category) {
      setRequests([]);
      return undefined;
    }
    return subscribeRequests(category, setRequests);
  }, [enabled, category]);

  return requests;
}
