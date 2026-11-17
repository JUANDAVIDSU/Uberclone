export const haversineKm = (a, b) => {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export const toCoord = (p) => ({ latitude: p.lat, longitude: p.lng });

export const decodePolyline = (encoded) => {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coords = [];
  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coords;
};

export const downsample = (points, max = 150) => {
  if (!points || points.length <= max) return points || [];
  const step = Math.ceil(points.length / max);
  return points.filter((_, i) => i % step === 0 || i === points.length - 1);
};

const fetchJson = async (url, ms = 8000) => {
  const res = await Promise.race([
    fetch(url),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
  return res.json();
};

const googleRoute = async (from, to, key) => {
  const data = await fetchJson(
    'https://maps.googleapis.com/maps/api/directions/json' +
      `?origin=${from.latitude},${from.longitude}` +
      `&destination=${to.latitude},${to.longitude}&key=${key}`
  );
  if (data.status !== 'OK' || !data.routes?.length) return null;
  const route = data.routes[0];
  const leg = route.legs[0];
  return {
    points: decodePolyline(route.overview_polyline.points),
    distanceKm: leg.distance.value / 1000,
    durationMin: leg.duration.value / 60,
  };
};

const osrmRoute = async (from, to) => {
  const data = await fetchJson(
    'https://router.project-osrm.org/route/v1/driving/' +
      `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
      '?overview=full&geometries=geojson'
  );
  if (data.code !== 'Ok' || !data.routes?.length) return null;
  const route = data.routes[0];
  return {
    points: route.geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
};

export const getRouteInfo = async (from, to) => {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY;
  if (key) {
    try {
      const g = await googleRoute(from, to, key);
      if (g) return g;
    } catch (e) {
    }
  }
  try {
    return await osrmRoute(from, to);
  } catch (e) {
    return null;
  }
};

export const getRoute = async (from, to) => {
  const info = await getRouteInfo(from, to);
  return info ? info.points : [from, to];
};
