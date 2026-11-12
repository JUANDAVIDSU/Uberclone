import { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

import useT from '../hooks/useT';
import RouteMap from '../components/RouteMap';
import FareSummary from '../components/FareSummary';
import { getTrip } from '../services/tripService';
import { tripDate } from '../utils/dates';
import { toCoord } from '../utils/geo';

export default function TripDetailScreen({ route }) {
  const { tripId } = route.params;
  const { t, locale } = useT();
  const [trip, setTrip] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    getTrip(tripId).then(setTrip).catch(() => {});
  }, [tripId]);

  if (!trip) return <ActivityIndicator style={{ marginTop: 40 }} />;

  // Ruta guardada; si no hay, una línea entre origen y destino
  const points =
    trip.routePoints && trip.routePoints.length > 1
      ? trip.routePoints
      : [toCoord(trip.origin), toCoord(trip.destination)];

  const ajustar = () =>
    mapRef.current?.fitToCoordinates(points, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: false,
    });

  const d = tripDate(trip);

  return (
    <ScrollView>
      <RouteMap
        ref={mapRef}
        style={{ height: 260 }}
        route={points}
        origin={trip.origin}
        destination={trip.destination}
        onReady={ajustar}
      />
      <Card mode="outlined" style={{ margin: 16 }}>
        <Card.Content style={{ gap: 4 }}>
          <Text variant="labelLarge">
            {d ? `${d.toLocaleDateString(locale)} ${d.toLocaleTimeString(locale)}` : '-'}
          </Text>
          <Text>{trip.origin.address} → {trip.destination.address}</Text>
          <Text>{t('req.duration')}: {trip.durationMin} min</Text>
          <Text>{t('req.distance')}: {trip.distanceKm.toFixed(1)} km</Text>
          <Text>{t('detail.rating')}: {trip.rating != null ? `${trip.rating}/5` : '—'}</Text>
          <Text>{t('req.method')}: {t('method.' + trip.paymentMethod)}</Text>
          <Text>{t('pay.status')}: {t('pay.' + (trip.paymentStatus || 'pending'))}</Text>
        </Card.Content>
      </Card>
      {trip.fare != null && (
        <Card mode="outlined" style={{ marginHorizontal: 16, marginBottom: 16 }}>
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
      )}
    </ScrollView>
  );
}
