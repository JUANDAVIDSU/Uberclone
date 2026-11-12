import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

import useT from '../hooks/useT';
import RouteMap from '../components/RouteMap';
import { useDriver } from '../context/DriverContext';
import { finishTrip, setTripStatus, subscribeTrip } from '../services/tripService';
import { downsample, getRoute, toCoord } from '../utils/geo';

export default function TripScreen({ navigation }) {
  const { t } = useT();
  const { activeTripId, setActiveTripId, location } = useDriver();

  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState([]);
  const [busy, setBusy] = useState(false);

  const mapRef = useRef(null);
  const locRef = useRef(location); // última ubicación, sin disparar el efecto de la ruta
  locRef.current = location;
  const legRoute = useRef([]); // ruta del tramo con el pasajero (se guarda al finalizar)
  const ready = !!location;

  // Escucha el viaje (limpieza: deja de escuchar al salir)
  useEffect(() => {
    if (!activeTripId) return undefined;
    return subscribeTrip(activeTripId, setTrip);
  }, [activeTripId]);

  // Si el viaje se canceló desde otro lado, se vuelve al inicio
  useEffect(() => {
    if (trip && trip.status === 'cancelled') {
      setActiveTripId(null);
      navigation.goBack();
    }
  }, [trip, navigation, setActiveTripId]);

  // Ruta del tramo actual (se pide una vez por tramo)
  useEffect(() => {
    if (!trip || !ready) return undefined;
    const stage = trip.status;
    if (stage !== 'driver_arriving' && stage !== 'in_progress') return undefined;

    let active = true;
    const from = stage === 'driver_arriving' ? locRef.current : toCoord(trip.origin);
    const to = toCoord(stage === 'driver_arriving' ? trip.origin : trip.destination);

    getRoute(from, to).then((points) => {
      if (!active) return;
      setRoute(points);
      if (stage === 'in_progress') legRoute.current = points;
      if (mapRef.current && points.length > 1) {
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true,
        });
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id, trip?.status, ready]);

  const abordo = async () => {
    setBusy(true);
    try {
      await setTripStatus(trip.id, 'in_progress');
    } finally {
      setBusy(false);
    }
  };

  const finalizar = async () => {
    setBusy(true);
    try {
      await finishTrip(trip, downsample(legRoute.current));
      navigation.replace('Cobro', { tripId: trip.id });
    } finally {
      setBusy(false);
    }
  };

  const cancelar = async () => {
    setBusy(true);
    try {
      await setTripStatus(trip.id, 'cancelled');
      setActiveTripId(null);
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  if (!trip) return <ActivityIndicator style={{ marginTop: 40 }} />;

  const enRecogida = trip.status === 'driver_arriving';

  return (
    <View style={{ flex: 1 }}>
      <RouteMap
        ref={mapRef}
        style={{ flex: 1 }}
        route={route}
        origin={trip.origin}
        destination={trip.destination}
        showUser
      />
      <View style={{ padding: 16, gap: 8 }}>
        <Text variant="titleMedium">
          {enRecogida ? t('trip.toPickup') : t('trip.toDestination')}
        </Text>
        <Text>{enRecogida ? trip.origin.address : trip.destination.address}</Text>

        {enRecogida ? (
          <>
            <Button mode="contained" onPress={abordo} disabled={busy}>
              {t('trip.onboard')}
            </Button>
            <Button mode="outlined" onPress={cancelar} disabled={busy}>
              {t('trip.cancel')}
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={finalizar} disabled={busy}>
            {t('trip.finish')}
          </Button>
        )}
      </View>
    </View>
  );
}
