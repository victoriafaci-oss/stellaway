import { useState, useEffect } from 'react';
import { StarlightSpot, CelestialEvent } from '../types';

const SPOTS_STORAGE_KEY = 'stellaway_offline_spots';
const EVENTS_STORAGE_KEY = 'stellaway_offline_events';
const CHANGE_EVENT_NAME = 'stellaway_offline_changed';

// Safe getter for localStorage
function safeGetJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

// Safe setter for localStorage
function safeSetJSON<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT_NAME));
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
    return false;
  }
}

// Spots management
export function getSavedSpots(): StarlightSpot[] {
  return safeGetJSON<StarlightSpot[]>(SPOTS_STORAGE_KEY, []);
}

export function isSpotSaved(spotId: string): boolean {
  const spots = getSavedSpots();
  return spots.some((s) => s.id === spotId);
}

export function saveSpot(spot: StarlightSpot): boolean {
  const spots = getSavedSpots();
  const exists = spots.some((s) => s.id === spot.id);
  if (exists) return true;
  const updated = [spot, ...spots];
  return safeSetJSON(SPOTS_STORAGE_KEY, updated);
}

export function removeSpot(spotId: string): boolean {
  const spots = getSavedSpots();
  const updated = spots.filter((s) => s.id !== spotId);
  return safeSetJSON(SPOTS_STORAGE_KEY, updated);
}

export function toggleSaveSpot(spot: StarlightSpot): boolean {
  if (isSpotSaved(spot.id)) {
    removeSpot(spot.id);
    return false;
  } else {
    saveSpot(spot);
    return true;
  }
}

// Events management
export function getSavedEvents(): CelestialEvent[] {
  return safeGetJSON<CelestialEvent[]>(EVENTS_STORAGE_KEY, []);
}

export function isEventSaved(eventId: string): boolean {
  const events = getSavedEvents();
  return events.some((e) => e.id === eventId);
}

export function saveEvent(event: CelestialEvent): boolean {
  const events = getSavedEvents();
  const exists = events.some((e) => e.id === event.id);
  if (exists) return true;
  const updated = [event, ...events];
  return safeSetJSON(EVENTS_STORAGE_KEY, updated);
}

export function removeEvent(eventId: string): boolean {
  const events = getSavedEvents();
  const updated = events.filter((e) => e.id !== eventId);
  return safeSetJSON(EVENTS_STORAGE_KEY, updated);
}

export function toggleSaveEvent(event: CelestialEvent): boolean {
  if (isEventSaved(event.id)) {
    removeEvent(event.id);
    return false;
  } else {
    saveEvent(event);
    return true;
  }
}

// Storage stats calculation
export function getOfflineStorageStats(): {
  spotsCount: number;
  eventsCount: number;
  totalItems: number;
  approxKB: number;
} {
  const spots = getSavedSpots();
  const events = getSavedEvents();
  const rawSpots = JSON.stringify(spots);
  const rawEvents = JSON.stringify(events);
  const totalBytes = new Blob([rawSpots, rawEvents]).size;
  const approxKB = parseFloat((totalBytes / 1024).toFixed(2));

  return {
    spotsCount: spots.length,
    eventsCount: events.length,
    totalItems: spots.length + events.length,
    approxKB
  };
}

// Clear all offline data
export function clearAllOfflineData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SPOTS_STORAGE_KEY);
  localStorage.removeItem(EVENTS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT_NAME));
}

// React Hook for reactive offline storage and network status
export function useOfflineStorage() {
  const [savedSpots, setSavedSpots] = useState<StarlightSpot[]>(() => getSavedSpots());
  const [savedEvents, setSavedEvents] = useState<CelestialEvent[]>(() => getSavedEvents());
  const [stats, setStats] = useState(() => getOfflineStorageStats());
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setSavedSpots(getSavedSpots());
      setSavedEvents(getSavedEvents());
      setStats(getOfflineStorageStats());
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener(CHANGE_EVENT_NAME, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener(CHANGE_EVENT_NAME, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    savedSpots,
    savedEvents,
    stats,
    isOnline,
    isSpotSaved: (id: string) => savedSpots.some((s) => s.id === id),
    toggleSaveSpot,
    saveSpot,
    removeSpot,
    isEventSaved: (id: string) => savedEvents.some((e) => e.id === id),
    toggleSaveEvent,
    saveEvent,
    removeEvent,
    clearAllOfflineData
  };
}
