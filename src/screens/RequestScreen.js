import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, HelperText, ProgressBar, Text } from 'react-native-paper';

import useT from '../hooks/useT';
import { useSession } from '../context/SessionContext';
import { useDriver } from '../context/DriverContext';
import { acceptTrip, rejectTrip, subscribeTrip } from '../services/tripService';
import { calculateFare } from '../utils/calculateFare';
import { formatCOP } from '../utils/format';
import { REQUEST_SECONDS } from '../config/pricing';

export default function RequestScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { t } = useT();
  const { driver } = useSession();
  const { setActiveTripId } = useDriver();

  const [trip, setTrip] = useState(null);
  const [seconds, setSeconds] = useState(REQUEST_SECONDS);
  const [error, setError] = useState('');
  const handled = useRef(false); // evita aceptar/rechazar dos veces

  // Escucha el viaje en tiempo real (la función devuelta es la limpieza)
  useEffect(() => subscribeTrip(tripId, setTrip), [tripId]);

  // Temporizador: baja cada segundo y se detiene al salir (limpieza)
  useEffect(() => {
    setSeconds(REQUEST_SECONDS);
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [tripId]);

  const rechazar = useCallback(async () => {
    if (handled.current) return;
    handled.current = true;
    try {
      await rejectTrip(tripId);
    } catch (e) {
      // si falla, igual se sale de la tarjeta
    }
    navigation.goBack();
  }, [tripId, navigation]);

  const aceptar = useCallback(async () => {
    if (handled.current) return;
    handled.current = true;
    try {
      await acceptTrip(tripId, driver.uid);
      setActiveTripId(tripId);
      navigation.replace('Viaje');
    } catch (e) {
      // otro conductor lo tomó, o falló la red
      setError(e.message === 'TRIP_TAKEN' ? 'err.tripTaken' : 'err.general');
      handled.current = false;
      if (e.message === 'TRIP_TAKEN') navigation.goBack();
    }
  }, [tripId, driver, navigation, setActiveTripId]);

  // Tiempo agotado: rechazo automático
  useEffect(() => {
    if (seconds === 0) rechazar();
  }, [seconds, rechazar]);

  // Si el viaje deja de estar solicitado (por ejemplo, otro lo tomó), se cierra
  useEffect(() => {
    if (trip && trip.status !== 'requested' && !handled.current) {
      handled.current = true;
      navigation.goBack();
    }
  }, [trip, navigation]);

  if (!trip) return <ActivityIndicator style={{ marginTop: 40 }} />;

  // Estimación con la misma función que usa el cierre del viaje
  const est = calculateFare({
    distanceKm: trip.distanceKm,
    durationMin: trip.durationMin,
    category: trip.category,
    tip: trip.tip || 0,
  });

  // Un dato con su título pequeño arriba
  const item = (label, value, big = false) => (
    <View style={{ flex: 1 }}>
      <Text variant="labelSmall" style={{ color: '#5C5C5C' }}>{label}</Text>
      <Text variant={big ? 'titleLarge' : 'titleSmall'} style={{ fontWeight: '700' }}>{value}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Temporizador */}
      <View style={{ alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 56, fontWeight: '800' }}>{seconds}</Text>
        <ProgressBar
          progress={seconds / REQUEST_SECONDS}
          color="#000000"
          style={{ height: 6, borderRadius: 3, width: '100%', backgroundColor: '#E3E3E3' }}
        />
      </View>

      <Card mode="outlined">
        <Card.Content style={{ gap: 14 }}>
          {item(t('req.origin'), trip.origin.address)}
          {item(t('req.destination'), trip.destination.address)}
          <Divider />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {item(t('req.distance'), `${trip.distanceKm.toFixed(1)} km`)}
            {item(t('req.duration'), `${trip.durationMin} min`)}
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {item(t('f.category'), t('cat.' + trip.category))}
            {item(t('req.method'), t('method.' + trip.paymentMethod))}
          </View>
          <Divider />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {item(t('req.estFare'), formatCOP(est.fare), true)}
            {item(t('req.estNet'), formatCOP(est.driverEarnings), true)}
          </View>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={aceptar} contentStyle={{ height: 52 }} labelStyle={{ fontSize: 16, fontWeight: '700' }}>
        {t('req.accept')}
      </Button>
      <Button mode="outlined" onPress={rechazar} contentStyle={{ height: 52 }} labelStyle={{ fontSize: 16, fontWeight: '700' }}>
        {t('req.reject')}
      </Button>
      <HelperText type="error" visible={!!error}>
        {t(error)}
      </HelperText>
    </ScrollView>
  );
}
