import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';

import useT from '../hooks/useT';
import FareSummary from '../components/FareSummary';
import { useDriver } from '../context/DriverContext';
import { payCash, settlePaidTrip, subscribeTrip } from '../services/tripService';
import { simulatePassengerPayment } from '../services/simulator';
import { SIMULATION } from '../config/pricing';

export default function PaymentScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { t } = useT();
  const { setActiveTripId } = useDriver();

  const [trip, setTrip] = useState(null);
  const [busy, setBusy] = useState(false);

  // El conductor ve el cambio de estado del pago en tiempo real
  useEffect(() => subscribeTrip(tripId, setTrip), [tripId]);

  // Modo simulación: el pasajero paga con la pasarela a los pocos segundos
  useEffect(() => {
    if (
      SIMULATION.enabled &&
      trip &&
      trip.paymentMethod !== 'cash' &&
      trip.status === 'completed' &&
      trip.paymentStatus === 'pending'
    ) {
      simulatePassengerPayment(tripId);
    }
  }, [trip, tripId]);

  // Cuando la pasarela confirma el pago, el viaje se suma al saldo (una sola vez)
  useEffect(() => {
    if (trip && trip.status === 'paid' && !trip.walletSettled) {
      settlePaidTrip(tripId).catch(() => {});
    }
  }, [trip, tripId]);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const volver = () => {
    setActiveTripId(null);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  if (!trip) return <ActivityIndicator style={{ marginTop: 40 }} />;

  const efectivo = trip.paymentMethod === 'cash';
  const pagado = trip.status === 'paid';
  const estado = trip.paymentStatus || 'pending';

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Card mode="outlined">
        <Card.Content>
          <FareSummary
            fare={trip.fare}
            commission={trip.commission}
            tip={trip.tip}
            driverEarnings={trip.driverEarnings}
            rate={trip.commissionRate}
          />
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Content>
          <Text variant="labelLarge">{t('req.method')}</Text>
          <Text>{t('method.' + trip.paymentMethod)}</Text>
          <Text variant="labelLarge" style={{ marginTop: 8 }}>{t('pay.status')}</Text>
          <Text variant="titleMedium">{t('pay.' + estado)}</Text>
        </Card.Content>
      </Card>

      {pagado ? (
        <Button mode="contained" onPress={volver}>
          {t('pay.backHome')}
        </Button>
      ) : efectivo ? (
        <Button mode="contained" onPress={() => run(() => payCash(tripId))} disabled={busy}>
          {t('pay.confirmCash')}
        </Button>
      ) : (
        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 12 }}>
          {estado === 'rejected' ? (
            <Text style={{ textAlign: 'center' }}>{t('pay.rejectedMsg')}</Text>
          ) : (
            <>
              <ActivityIndicator />
              <Text style={{ textAlign: 'center' }}>{t('pay.waiting')}</Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}
