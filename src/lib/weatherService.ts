import { WeatherType } from '../types';
import { SupportedLanguage } from './i18nHelpers';

export interface DailyNightForecast {
  dateISO: string;
  condition: WeatherType;
  tempMinC: number;
  tempMaxC: number;
  nightLowCloudsPct: number;
  nightMidCloudsPct: number;
  nightHighCloudsPct: number;
  nightTotalCloudsPct: number;
  nightWindKmH: number;
  nightWindDirection: string;
  precipitationProbMaxPct: number;
  clearWindowHours: string | null; // e.g. "21:00 – 04:00"
  moonPhaseName: string;
  moonIlluminationPct: number;
}

export interface RealSkyWeatherReport {
  locationName: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  timezone?: string;
  updatedAtISO: string;
  condition: WeatherType;
  temperatureC: number;
  humidityPct: number;
  windKmH: number;
  windDirection: string;
  lowCloudsPct: number;
  midCloudsPct: number;
  highCloudsPct: number;
  totalCloudsPct: number;
  visibilityKm: number | null;
  seeingQuality: 'Excelente' | 'Bueno' | 'Regular' | 'Malo' | null;
  seeingArcsec: string | null;
  seeingIndex: number | null;
  transparencyLabel: string | null;
  transparencyIndex: number | null;
  moonPhaseName: string;
  moonIlluminationPct: number;
  bortleClass: number | null;
  sqm: number | null;
  catalogSpotName: string | null;
  forecast7Days: DailyNightForecast[];
  sources: {
    weather: string;
    astro: string | null;
  };
}

export interface GeocodingCandidate {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
}

const COMPASS_DIRS = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSO', 'SO', 'OSO',
  'O', 'ONO', 'NO', 'NNO',
];

export function degreesToCompass(deg?: number | null): string {
  if (typeof deg !== 'number' || !Number.isFinite(deg)) return 'N';
  const normalized = ((deg % 360) + 360) % 360;
  const idx = Math.round(normalized / 22.5) % 16;
  return COMPASS_DIRS[idx];
}

/**
 * Astronomical synodic calculation for Moon Phase & Illumination % at any given date.
 * Reference New Moon: 2000-01-06T18:14:00Z, synodic period = 29.53058867 days.
 */
export function getMoonPhaseForDate(date: Date): {
  phaseName: string;
  illuminationPct: number;
  ageDays: number;
} {
  const SYNODIC_MONTH = 29.53058867;
  const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (date.getTime() - REF_NEW_MOON_MS) / 86400000;
  const ageDays = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseFraction = ageDays / SYNODIC_MONTH;
  const illuminationPct = Math.round(((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'Luna Nueva';
  if (ageDays < 1.84566 || ageDays >= 27.68493) {
    phaseName = 'Luna Nueva';
  } else if (ageDays < 5.53699) {
    phaseName = 'Luna Creciente';
  } else if (ageDays < 9.22831) {
    phaseName = 'Cuarto Creciente';
  } else if (ageDays < 12.91963) {
    phaseName = 'Gibosa Creciente';
  } else if (ageDays < 16.61096) {
    phaseName = 'Luna Llena';
  } else if (ageDays < 20.30228) {
    phaseName = 'Gibosa Menguante';
  } else if (ageDays < 23.99361) {
    phaseName = 'Cuarto Menguante';
  } else {
    phaseName = 'Luna Menguante';
  }

  return { phaseName, illuminationPct, ageDays };
}

export function mapWmoCodeToCondition(
  wmoCode: number | undefined,
  totalCloudsPct: number,
  windKmH: number
): WeatherType {
  if (typeof wmoCode === 'number') {
    if (wmoCode >= 95) return 'storm';
    if ((wmoCode >= 71 && wmoCode <= 77) || wmoCode === 85 || wmoCode === 86) return 'snow';
    if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) return 'rain';
    if (wmoCode === 45 || wmoCode === 48) return 'clouds';
  }
  if (windKmH >= 38) return 'wind';
  if (totalCloudsPct >= 35 || (typeof wmoCode === 'number' && wmoCode >= 2)) return 'clouds';
  return 'clear';
}

export function mapSevenTimerSeeing(index?: number | null): {
  quality: 'Excelente' | 'Bueno' | 'Regular' | 'Malo' | null;
  arcsec: string | null;
} {
  switch (index) {
    case 1:
      return { quality: 'Excelente', arcsec: '< 0.5"' };
    case 2:
      return { quality: 'Excelente', arcsec: '0.5" – 0.75"' };
    case 3:
      return { quality: 'Bueno', arcsec: '0.75" – 1.0"' };
    case 4:
      return { quality: 'Bueno', arcsec: '1.0" – 1.25"' };
    case 5:
      return { quality: 'Regular', arcsec: '1.25" – 1.5"' };
    case 6:
      return { quality: 'Regular', arcsec: '1.5" – 2.0"' };
    case 7:
      return { quality: 'Malo', arcsec: '2.0" – 2.5"' };
    case 8:
      return { quality: 'Malo', arcsec: '> 2.5"' };
    default:
      return { quality: null, arcsec: null };
  }
}

export function mapSevenTimerTransparency(index?: number | null): string | null {
  switch (index) {
    case 1:
      return '< 0.3 mag/airmass';
    case 2:
      return '0.3 – 0.4 mag/airmass';
    case 3:
      return '0.4 – 0.5 mag/airmass';
    case 4:
      return '0.5 – 0.6 mag/airmass';
    case 5:
      return '0.6 – 0.7 mag/airmass';
    case 6:
      return '0.7 – 0.85 mag/airmass';
    case 7:
      return '0.85 – 1.0 mag/airmass';
    case 8:
      return '> 1.0 mag/airmass';
    default:
      return null;
  }
}

export function buildClearOutsideUrl(lat: number, lng: number): string {
  return `https://clearoutside.com/forecast/${lat.toFixed(2)}/${lng.toFixed(2)}`;
}

export function buildWindyUrl(lat: number, lng: number): string {
  return `https://www.windy.com/${lat.toFixed(3)}/${lng.toFixed(3)}`;
}

export function buildOpenMeteoForecastUrl(lat: number, lng: number): string {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    current:
      'temperature_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,wind_direction_10m,weather_code',
    hourly:
      'temperature_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,wind_direction_10m,weather_code,visibility',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max',
    forecast_days: '7',
    timezone: 'auto',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

/**
 * Compute continuous nighttime clear-sky window (e.g., "21:00 – 04:00") from Open-Meteo hourly arrays.
 * Evaluates hours between 20:00 of dateISO and 05:00 of the following day.
 */
function analyzeNightWindowForDay(
  dateISO: string,
  hourlyTimes: string[],
  lowArr: number[],
  midArr: number[],
  highArr: number[],
  totalArr: number[],
  windArr: number[],
  windDirArr: number[],
  wmoArr: number[]
): Omit<DailyNightForecast, 'dateISO' | 'tempMinC' | 'tempMaxC' | 'precipitationProbMaxPct' | 'moonPhaseName' | 'moonIlluminationPct'> {
  const nextDayDate = new Date(`${dateISO}T12:00:00Z`);
  nextDayDate.setUTCDate(nextDayDate.getUTCDate() + 1);
  const nextDateISO = nextDayDate.toISOString().slice(0, 10);

  const nightIndices: number[] = [];
  for (let i = 0; i < hourlyTimes.length; i++) {
    const t = hourlyTimes[i];
    if (!t || t.length < 13) continue;
    const d = t.slice(0, 10);
    const hr = parseInt(t.slice(11, 13), 10);
    if ((d === dateISO && hr >= 20) || (d === nextDateISO && hr <= 5)) {
      nightIndices.push(i);
    }
  }

  if (nightIndices.length === 0) {
    // Fallback to midday entries for that date if nighttime boundary is out of 7-day range
    for (let i = 0; i < hourlyTimes.length; i++) {
      if (hourlyTimes[i]?.startsWith(dateISO)) nightIndices.push(i);
    }
  }

  const avg = (arr: number[], idxs: number[]) => {
    if (idxs.length === 0) return 0;
    const sum = idxs.reduce((acc, idx) => acc + (Number.isFinite(arr[idx]) ? arr[idx] : 0), 0);
    return Math.round(sum / idxs.length);
  };

  const nightLowCloudsPct = avg(lowArr, nightIndices);
  const nightMidCloudsPct = avg(midArr, nightIndices);
  const nightHighCloudsPct = avg(highArr, nightIndices);
  const nightTotalCloudsPct = avg(totalArr, nightIndices);
  const nightWindKmH = avg(windArr, nightIndices);
  const midIdx = nightIndices[Math.floor(nightIndices.length / 2)] ?? 0;
  const nightWindDirection = degreesToCompass(windDirArr[midIdx]);

  // Dominant nighttime WMO code (max severity among night hours)
  let maxWmo = 0;
  for (const idx of nightIndices) {
    const code = wmoArr[idx];
    if (typeof code === 'number' && code > maxWmo) maxWmo = code;
  }

  // Find longest contiguous window of clear sky (total cloud cover <= 25%)
  let bestStart = -1;
  let bestEnd = -1;
  let curStart = -1;
  for (let k = 0; k < nightIndices.length; k++) {
    const idx = nightIndices[k];
    const isClearHour = (totalArr[idx] ?? 100) <= 25 && ((wmoArr[idx] ?? 0) < 51);
    if (isClearHour) {
      if (curStart === -1) curStart = k;
      if (k - curStart >= bestEnd - bestStart || bestStart === -1) {
        bestStart = curStart;
        bestEnd = k;
      }
    } else {
      curStart = -1;
    }
  }

  let clearWindowHours: string | null = null;
  if (bestStart !== -1 && bestEnd !== -1) {
    const startStr = hourlyTimes[nightIndices[bestStart]]?.slice(11, 16) || '21:00';
    const endHourNum = parseInt(hourlyTimes[nightIndices[bestEnd]]?.slice(11, 13) || '04', 10);
    const endStr = `${String((endHourNum + 1) % 24).padStart(2, '0')}:00`;
    clearWindowHours = `${startStr} – ${endStr}`;
  }

  const condition = mapWmoCodeToCondition(maxWmo, nightTotalCloudsPct, nightWindKmH);

  return {
    condition,
    nightLowCloudsPct,
    nightMidCloudsPct,
    nightHighCloudsPct,
    nightTotalCloudsPct,
    nightWindKmH,
    nightWindDirection,
    clearWindowHours,
  };
}

export function assembleReportFromRawApis(params: {
  lat: number;
  lng: number;
  locationName: string;
  region: string;
  country: string;
  elevationMeters?: number;
  bortleClass?: number | null;
  sqm?: number | null;
  catalogSpotName?: string | null;
  openMeteoData: any;
  sevenTimerData?: any | null;
}): RealSkyWeatherReport {
  const { openMeteoData, sevenTimerData } = params;
  const current = openMeteoData?.current || {};
  const hourly = openMeteoData?.hourly || {};
  const daily = openMeteoData?.daily || {};

  const lowCloudsPct = Math.round(Number(current.cloud_cover_low ?? 0));
  const midCloudsPct = Math.round(Number(current.cloud_cover_mid ?? 0));
  const highCloudsPct = Math.round(Number(current.cloud_cover_high ?? 0));
  const totalCloudsPct = Math.round(Number(current.cloud_cover ?? 0));
  const temperatureC = Math.round(Number(current.temperature_2m ?? 0));
  const humidityPct = Math.round(Number(current.relative_humidity_2m ?? 0));
  const windKmH = Math.round(Number(current.wind_speed_10m ?? 0));
  const windDirection = degreesToCompass(current.wind_direction_10m);
  const wmoCode = typeof current.weather_code === 'number' ? current.weather_code : undefined;

  // Match nearest visibility from hourly[0]
  const hourlyVisArr: number[] = Array.isArray(hourly.visibility) ? hourly.visibility : [];
  const visMeters = typeof hourlyVisArr[0] === 'number' ? hourlyVisArr[0] : null;
  const visibilityKm = visMeters !== null ? Math.round((visMeters / 1000) * 10) / 10 : null;

  const firstSeries = Array.isArray(sevenTimerData?.dataseries) ? sevenTimerData.dataseries[0] : null;
  const seeingIndex = typeof firstSeries?.seeing === 'number' ? firstSeries.seeing : null;
  const transparencyIndex = typeof firstSeries?.transparency === 'number' ? firstSeries.transparency : null;
  const seeingMapped = mapSevenTimerSeeing(seeingIndex);
  const transparencyLabel = mapSevenTimerTransparency(transparencyIndex);

  const now = new Date();
  const moonToday = getMoonPhaseForDate(now);

  const hourlyTimes: string[] = Array.isArray(hourly.time) ? hourly.time : [];
  const lowArr: number[] = Array.isArray(hourly.cloud_cover_low) ? hourly.cloud_cover_low : [];
  const midArr: number[] = Array.isArray(hourly.cloud_cover_mid) ? hourly.cloud_cover_mid : [];
  const highArr: number[] = Array.isArray(hourly.cloud_cover_high) ? hourly.cloud_cover_high : [];
  const totalArr: number[] = Array.isArray(hourly.cloud_cover) ? hourly.cloud_cover : [];
  const windArr: number[] = Array.isArray(hourly.wind_speed_10m) ? hourly.wind_speed_10m : [];
  const windDirArr: number[] = Array.isArray(hourly.wind_direction_10m) ? hourly.wind_direction_10m : [];
  const wmoArr: number[] = Array.isArray(hourly.weather_code) ? hourly.weather_code : [];

  const dailyDates: string[] = Array.isArray(daily.time) ? daily.time : [];
  const dailyMin: number[] = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
  const dailyMax: number[] = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
  const dailyPrecip: number[] = Array.isArray(daily.precipitation_probability_max)
    ? daily.precipitation_probability_max
    : [];

  const forecast7Days: DailyNightForecast[] = dailyDates.slice(0, 7).map((dateISO, idx) => {
    const nightStats = analyzeNightWindowForDay(
      dateISO,
      hourlyTimes,
      lowArr,
      midArr,
      highArr,
      totalArr,
      windArr,
      windDirArr,
      wmoArr
    );
    const dayDate = new Date(`${dateISO}T22:00:00Z`);
    const moon = getMoonPhaseForDate(dayDate);

    return {
      dateISO,
      ...nightStats,
      tempMinC: Math.round(Number(dailyMin[idx] ?? temperatureC)),
      tempMaxC: Math.round(Number(dailyMax[idx] ?? temperatureC)),
      precipitationProbMaxPct: Math.round(Number(dailyPrecip[idx] ?? 0)),
      moonPhaseName: moon.phaseName,
      moonIlluminationPct: moon.illuminationPct,
    };
  });

  return {
    locationName: params.locationName,
    region: params.region,
    country: params.country,
    latitude: params.lat,
    longitude: params.lng,
    elevationMeters: params.elevationMeters,
    timezone: openMeteoData?.timezone,
    updatedAtISO: new Date().toISOString(),
    condition: mapWmoCodeToCondition(wmoCode, totalCloudsPct, windKmH),
    temperatureC,
    humidityPct,
    windKmH,
    windDirection,
    lowCloudsPct,
    midCloudsPct,
    highCloudsPct,
    totalCloudsPct,
    visibilityKm,
    seeingQuality: seeingMapped.quality,
    seeingArcsec: seeingMapped.arcsec,
    seeingIndex,
    transparencyLabel,
    transparencyIndex,
    moonPhaseName: moonToday.phaseName,
    moonIlluminationPct: moonToday.illuminationPct,
    bortleClass: params.bortleClass ?? null,
    sqm: params.sqm ?? null,
    catalogSpotName: params.catalogSpotName ?? null,
    forecast7Days,
    sources: {
      weather: 'Open-Meteo',
      astro: seeingMapped.quality ? '7Timer! Astro' : null,
    },
  };
}

export async function searchCitiesGeocoding(
  query: string,
  lang: SupportedLanguage
): Promise<GeocodingCandidate[]> {
  const clean = query.trim();
  if (!clean) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    clean
  )}&count=6&language=${lang}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding service error');
  const data = await res.json();
  if (!Array.isArray(data?.results)) return [];
  return data.results.map((r: any) => ({
    name: String(r.name),
    admin1: r.admin1 ? String(r.admin1) : undefined,
    country: r.country ? String(r.country) : undefined,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    elevation: typeof r.elevation === 'number' ? Math.round(r.elevation) : undefined,
  }));
}

export async function fetchRealSkyWeather(params: {
  lat: number;
  lng: number;
  locationName: string;
  region?: string;
  country?: string;
  elevationMeters?: number;
  bortleClass?: number | null;
  sqm?: number | null;
  catalogSpotName?: string | null;
}): Promise<RealSkyWeatherReport> {
  // 1. Try unified backend endpoint first (fetches Open-Meteo + 7Timer Astro server-side without CORS issues)
  try {
    const qs = new URLSearchParams({
      lat: params.lat.toFixed(5),
      lon: params.lng.toFixed(5),
      name: params.locationName,
      region: params.region || '',
      country: params.country || '',
    });
    const apiRes = await fetch(`/api/sky-conditions?${qs.toString()}`);
    if (apiRes.ok) {
      const ct = apiRes.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await apiRes.json();
        if (json && Array.isArray(json.forecast7Days)) {
          return {
            ...json,
            elevationMeters: params.elevationMeters ?? json.elevationMeters,
            bortleClass: params.bortleClass ?? json.bortleClass ?? null,
            sqm: params.sqm ?? json.sqm ?? null,
            catalogSpotName: params.catalogSpotName ?? json.catalogSpotName ?? null,
          } as RealSkyWeatherReport;
        }
      }
    }
  } catch {
    // Fall back to direct Open-Meteo call below
  }

  // 2. Direct Open-Meteo fallback (always CORS-enabled)
  const omRes = await fetch(buildOpenMeteoForecastUrl(params.lat, params.lng));
  if (!omRes.ok) {
    throw new Error('Weather API unavailable');
  }
  const omData = await omRes.json();

  let sevenTimerData: any = null;
  try {
    const stRes = await fetch(
      `https://www.7timer.info/bin/api.pl?lon=${params.lng.toFixed(3)}&lat=${params.lat.toFixed(
        3
      )}&product=astro&output=json`,
      { signal: AbortSignal.timeout(4500) }
    );
    if (stRes.ok) {
      sevenTimerData = await stRes.json();
    }
  } catch {
    sevenTimerData = null;
  }

  return assembleReportFromRawApis({
    lat: params.lat,
    lng: params.lng,
    locationName: params.locationName,
    region: params.region || '',
    country: params.country || '',
    elevationMeters: params.elevationMeters,
    bortleClass: params.bortleClass ?? null,
    sqm: params.sqm ?? null,
    catalogSpotName: params.catalogSpotName ?? null,
    openMeteoData: omData,
    sevenTimerData,
  });
}

const OFFLINE_WEATHER_STORAGE_KEY = 'stellaway_saved_weather_reports_v1';

export function loadSavedWeatherReports(): RealSkyWeatherReport[] {
  try {
    const raw = localStorage.getItem(OFFLINE_WEATHER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWeatherReportOffline(report: RealSkyWeatherReport): RealSkyWeatherReport[] {
  const existing = loadSavedWeatherReports().filter(
    (r) =>
      !(
        Math.abs(r.latitude - report.latitude) < 0.02 &&
        Math.abs(r.longitude - report.longitude) < 0.02
      )
  );
  const next = [report, ...existing].slice(0, 12);
  try {
    localStorage.setItem(OFFLINE_WEATHER_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}

export function removeWeatherReportOffline(lat: number, lng: number): RealSkyWeatherReport[] {
  const next = loadSavedWeatherReports().filter(
    (r) => !(Math.abs(r.latitude - lat) < 0.02 && Math.abs(r.longitude - lng) < 0.02)
  );
  try {
    localStorage.setItem(OFFLINE_WEATHER_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}

export interface LiveAuroraKpData {
  kpIndex: number;
  timeTagUTC: string;
  source: string;
}

export async function fetchLiveNoaaKpIndex(): Promise<LiveAuroraKpData | null> {
  try {
    const apiRes = await fetch('/api/aurora-kp', { signal: AbortSignal.timeout(4500) });
    if (apiRes.ok) {
      const ct = apiRes.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await apiRes.json();
        if (typeof json?.kpIndex === 'number' && Number.isFinite(json.kpIndex)) {
          return json as LiveAuroraKpData;
        }
      }
    }
  } catch {
    // Fallback to direct NOAA SWPC JSON below
  }

  try {
    const noaaRes = await fetch(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!noaaRes.ok) return null;
    const rows = await noaaRes.json();
    if (!Array.isArray(rows) || rows.length < 2) return null;
    const latest = rows[rows.length - 1];
    const timeTagUTC = Array.isArray(latest) ? String(latest[0] || '') : String(latest?.time_tag || '');
    const kpRaw = Array.isArray(latest) ? Number(latest[1]) : Number(latest?.Kp);
    if (!Number.isFinite(kpRaw)) return null;
    return {
      kpIndex: Number(kpRaw.toFixed(2)),
      timeTagUTC,
      source: 'NOAA Space Weather Prediction Center (SWPC)',
    };
  } catch {
    return null;
  }
}

