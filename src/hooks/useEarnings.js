
import { useMemo } from 'react';
import { computeEarnings } from '../utils/earnings';

export default function useEarnings(trips) {
  return useMemo(() => computeEarnings(trips), [trips]);
}
