import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { Button, Switch, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import useT from '../hooks/useT';
import useTripRequests from '../hooks/useTripRequests';
import useRequestSimulator from '../hooks/useRequestSimulator';
import { useSession } from '../context/SessionContext';
import { useDriver } from '../context/DriverContext';
import { DEFAULT_REGION, SIMULATION } from '../config/pricing';

export default function HomeScreen({ navigation }) {
  const { t } = useT();
  const { driver, refreshDriver } = useSession();
  const { available, setAvailable, location, permission, activeTripId } = useDriver();

  const mapRef = useRef(null);
  const centered = useRef(false);
  const shownTrip = useRef(null);

  const aprobado = driver?.status === 'approved';

  // Al volver a esta pantalla se leen de nuevo los datos (por si lo aprobaron)
  useFocusEffect(
    useCallback(() => {
      refreshDriver();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // Centra el mapa la primera vez que hay ubicación
  useEffect(() => {
    if (location && !centered.current && mapRef.current) {
      centered.current = true;
      mapRef.current.animateToRegion({ ...location, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 600);
    }
  }, [location]);

  // Solicitudes en tiempo real (solo disponible y sin un viaje en curso)
  const requests = useTripRequests(available && !activeTripId, driver?.category);

  // Modo simulación: mientras espera y no hay solicitudes, se inventa una cada pocos segundos
  useRequestSimulator(
    available && !activeTripId && requests.length === 0,
    location,
    driver?.category
  );

  // Llega una solicitud nueva: se abre la tarjeta con el temporizador
  useEffect(() => {
    if (requests.length > 0 && shownTrip.current !== requests[0].id) {
      shownTrip.current = requests[0].id;
      navigation.navigate('Solicitud', { tripId: requests[0].id });
    }
  }, [requests, navigation]);

  if (!driver) return null;

  const mensaje = !aprobado
    ? t('home.pendingMsg')
    : permission === 'denied'
    ? t('home.noPermission')
    : '';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={permission === 'granted'}
      />

      {/* Panel inferior */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          marginTop: -28,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 20,
          gap: 12,
        }}
      >
        <View
          style={{ alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E3E3E3' }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="labelMedium" style={{ color: '#5C5C5C' }}>
              {t('home.hello').replace('{name}', driver.fullName?.split(' ')[0] || '')}
            </Text>
            <Text variant="headlineSmall" style={{ fontWeight: '800' }}>
              {available ? t('home.available') : t('home.unavailable')}
            </Text>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            disabled={!aprobado || permission !== 'granted' || !!activeTripId}
          />
        </View>

        {!!mensaje && (
          <View style={{ backgroundColor: '#F4F4F4', borderRadius: 12, padding: 12 }}>
            <Text variant="bodySmall">{mensaje}</Text>
          </View>
        )}

        {activeTripId && (
          <Button mode="contained" onPress={() => navigation.navigate('Viaje')} contentStyle={{ height: 48 }}>
            {t('home.continue')}
          </Button>
        )}

        {/* Mientras no haya solicitudes, el conductor espera */}
        {available && !activeTripId && (
          <View style={{ gap: 2 }}>
            <Text variant="bodySmall" style={{ color: '#5C5C5C' }}>
              {t('home.waiting')}
            </Text>
            {SIMULATION.enabled && (
              <Text variant="labelSmall" style={{ color: '#9A9A9A' }}>
                {t('home.simulation')}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
