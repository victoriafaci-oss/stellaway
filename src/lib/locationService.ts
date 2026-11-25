export interface LiveCoordinates {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  timestamp: number;
}

export type GeolocationErrorCode = 'unsupported' | 'denied' | 'unavailable' | 'timeout';

/**
 * Formats decimal latitude/longitude into DMS string (e.g. 40° 25' 12" N, 0° 12' 45" W)
 * useful for reading aloud to emergency services (112 / 062).
 */
export function formatCoordinatesDMS(lat: number, lng: number): string {
  const toDMS = (value: number, posHem: string, negHem: string) => {
    const abs = Math.abs(value);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    const finalSec = sec === 60 ? 59 : sec;
    const hem = value >= 0 ? posHem : negHem;
    return `${deg}° ${String(min).padStart(2, '0')}' ${String(finalSec).padStart(2, '0')}" ${hem}`;
  };

  return `${toDMS(lat, 'N', 'S')}, ${toDMS(lng, 'E', 'W')}`;
}

/**
 * Builds a direct Google Maps route URL using the user's real-time coordinates
 * as origin when available, or letting the user's Google Maps app resolve origin.
 */
export function buildGoogleMapsDirectionsUrl(
  destLat: number,
  destLng: number,
  origin?: { lat: number; lng: number } | null
): string {
  const base = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${destLat},${destLng}`)}`;
  if (origin) {
    return `${base}&origin=${encodeURIComponent(`${origin.lat},${origin.lng}`)}`;
  }
  return base;
}

/**
 * Builds a direct Google Maps pin URL for exact coordinates.
 */
export function buildGoogleMapsPinUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

function mapPositionError(err: GeolocationPositionError): GeolocationErrorCode {
  if (err.code === err.PERMISSION_DENIED) return 'denied';
  if (err.code === err.TIMEOUT) return 'timeout';
  return 'unavailable';
}

/**
 * Starts real-time GPS tracking via navigator.geolocation.watchPosition.
 * Requests device permission if not yet granted and returns a stop/cleanup function.
 */
export function watchLivePosition(
  onUpdate: (coords: LiveCoordinates) => void,
  onError: (code: GeolocationErrorCode) => void
): () => void {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    onError('unsupported');
    return () => {};
  }

  let active = true;
  const options: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 12000,
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (!active) return;
      onUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracyMeters: Number.isFinite(position.coords.accuracy)
          ? Math.round(position.coords.accuracy)
          : undefined,
        timestamp: position.timestamp || Date.now(),
      });
    },
    (err) => {
      if (!active) return;
      onError(mapPositionError(err));
    },
    options
  );

  return () => {
    active = false;
    navigator.geolocation.clearWatch(watchId);
  };
}
