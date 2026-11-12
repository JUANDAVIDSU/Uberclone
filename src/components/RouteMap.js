
import { forwardRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { DEFAULT_REGION } from '../config/pricing';
import { toCoord } from '../utils/geo';

const RouteMap = forwardRef(function RouteMap(
  { route, origin, destination, style, showUser = false, onReady },
  ref
) {
  const initialRegion = origin
    ? { ...toCoord(origin), latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : DEFAULT_REGION;

  return (
    <MapView
      ref={ref}
      style={style}
      initialRegion={initialRegion}
      showsUserLocation={showUser}
      onMapReady={onReady}
    >
      {origin && <Marker coordinate={toCoord(origin)} title={origin.address} pinColor="green" />}
      {destination && <Marker coordinate={toCoord(destination)} title={destination.address} />}
      {route && route.length > 1 && (
        <Polyline coordinates={route} strokeWidth={4} strokeColor="#1976d2" />
      )}
    </MapView>
  );
});

export default RouteMap;
