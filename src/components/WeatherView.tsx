import React, { useState, useEffect, useRef } from 'react';
import { STARLIGHT_SPOTS } from '../data/stellaData';
import { useLanguage } from '../context/LanguageContext';
import {
  getLocaleTag,
  translateSeeingQuality,
  translateMoonPhase,
  translateWeatherCondition,
} from '../lib/i18nHelpers';
import {
  watchLivePosition,
  buildGoogleMapsPinUrl,
  LiveCoordinates,
  GeolocationErrorCode,
} from '../lib/locationService';
import {
  RealSkyWeatherReport,
  GeocodingCandidate,
  fetchRealSkyWeather,
  searchCitiesGeocoding,
  buildClearOutsideUrl,
  buildWindyUrl,
  loadSavedWeatherReports,
  saveWeatherReportOffline,
  removeWeatherReportOffline,
} from '../lib/weatherService';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestCatalogSpot(lat: number, lng: number) {
  let closest = null as (typeof STARLIGHT_SPOTS)[number] | null;
  let minKm = Infinity;
  for (const spot of STARLIGHT_SPOTS) {
    const d = haversineKm(lat, lng, spot.latitude, spot.longitude);
    if (d < minKm) {
      minKm = d;
      closest = spot;
    }
  }
  return minKm <= 25 ? closest : null;
}

const FEATURED_OBSERVATORIES = STARLIGHT_SPOTS.slice(0, 6);

export const WeatherView: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [candidates, setCandidates] = useState<GeocodingCandidate[]>([]);
  const [report, setReport] = useState<RealSkyWeatherReport | null>(null);
  const [savedReports, setSavedReports] = useState<RealSkyWeatherReport[]>(() => loadSavedWeatherReports());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time GPS state
  const [userCoords, setUserCoords] = useState<LiveCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<GeolocationErrorCode | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadWeatherForPoint = async (opts: {
    lat: number;
    lng: number;
    locationName: string;
    region?: string;
    country?: string;
    elevationMeters?: number;
    bortleClass?: number | null;
    sqm?: number | null;
    catalogSpotName?: string | null;
  }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const matchedCatalog =
        opts.bortleClass != null ? null : findNearestCatalogSpot(opts.lat, opts.lng);
      const data = await fetchRealSkyWeather({
        lat: opts.lat,
        lng: opts.lng,
        locationName: opts.locationName,
        region: opts.region ?? matchedCatalog?.region ?? '',
        country: opts.country ?? matchedCatalog?.country ?? '',
        elevationMeters: opts.elevationMeters ?? matchedCatalog?.elevationMeters,
        bortleClass: opts.bortleClass ?? matchedCatalog?.bortleClass ?? null,
        sqm: opts.sqm ?? matchedCatalog?.sqm ?? null,
        catalogSpotName: opts.catalogSpotName ?? matchedCatalog?.name ?? null,
      });
      setReport(data);
    } catch {
      setErrorMsg(
        t(
          'weatherFetchErr',
          'No se pudo obtener la previsión meteorológica en tiempo real. Comprueba tu conexión o abre un informe guardado offline.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial real weather for the primary Starlight observatory on mount
  useEffect(() => {
    const initial = STARLIGHT_SPOTS[0];
    if (initial) {
      loadWeatherForPoint({
        lat: initial.latitude,
        lng: initial.longitude,
        locationName: initial.name,
        region: initial.region,
        country: initial.country,
        elevationMeters: initial.elevationMeters,
        bortleClass: initial.bortleClass,
        sqm: initial.sqm,
        catalogSpotName: initial.name,
      });
    }
    return () => {
      if (stopWatchRef.current) {
        stopWatchRef.current();
      }
    };
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setCandidates([]);
    setErrorMsg(null);

    // Check if the user entered direct "lat, lng" coordinates
    const coordMatch = q.match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = Number(coordMatch[1]);
      const lng = Number(coordMatch[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        await loadWeatherForPoint({
          lat,
          lng,
          locationName: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const results = await searchCitiesGeocoding(q, language);
      if (results.length === 0) {
        setIsLoading(false);
        setErrorMsg(
          t(
            'weatherNoCityResults',
            'No se encontraron coincidencias para esa ubicación. Prueba con otro municipio o introduce coordenadas exactas.'
          )
        );
        return;
      }
      setCandidates(results);
      const top = results[0];
      await loadWeatherForPoint({
        lat: top.latitude,
        lng: top.longitude,
        locationName: top.name,
        region: top.admin1 || '',
        country: top.country || '',
        elevationMeters: top.elevation,
      });
    } catch {
      setIsLoading(false);
      setErrorMsg(
        t('weatherFetchErr', 'No se pudo obtener la previsión meteorológica en tiempo real.')
      );
    }
  };

  const handleUseMyGps = () => {
    if (stopWatchRef.current) {
      stopWatchRef.current();
      stopWatchRef.current = null;
    }
    setIsLocating(true);
    setGpsError(null);
    setCandidates([]);

    let fetchedInitialGps = false;
    stopWatchRef.current = watchLivePosition(
      (coords) => {
        setUserCoords(coords);
        setIsLocating(false);
        setGpsError(null);
        if (!fetchedInitialGps) {
          fetchedInitialGps = true;
          loadWeatherForPoint({
            lat: coords.lat,
            lng: coords.lng,
            locationName: `${t('weatherMyGpsLoc', 'Mi ubicación GPS')} (${coords.lat.toFixed(3)}°, ${coords.lng.toFixed(3)}°)`,
          });
        }
      },
      (errCode) => {
        setIsLocating(false);
        setGpsError(errCode);
      }
    );
  };

  const isCurrentReportSaved = Boolean(
    report &&
      savedReports.some(
        (r) =>
          Math.abs(r.latitude - report.latitude) < 0.02 &&
          Math.abs(r.longitude - report.longitude) < 0.02
      )
  );

  const handleToggleSaveOffline = () => {
    if (!report) return;
    if (isCurrentReportSaved) {
      setSavedReports(removeWeatherReportOffline(report.latitude, report.longitude));
    } else {
      setSavedReports(saveWeatherReportOffline(report));
    }
  };

  // Canvas Background strictly tied to current real weather condition
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const activeCond = report?.condition || 'clear';
    const particlesCount =
      activeCond === 'rain' ? 110 : activeCond === 'snow' ? 75 : activeCond === 'clear' ? 120 : 40;
    const particles: Array<{ x: number; y: number; speed: number; length?: number; radius?: number; opacity: number }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed:
          activeCond === 'rain'
            ? 12 + Math.random() * 8
            : activeCond === 'snow'
            ? 1 + Math.random() * 2
            : 0.2 + Math.random() * 0.6,
        length: activeCond === 'rain' ? 14 + Math.random() * 14 : undefined,
        radius: activeCond === 'snow' ? 2 + Math.random() * 2.5 : Math.random() * 1.6,
        opacity: Math.random(),
      });
    }

    let windAngle = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (activeCond === 'clear') {
        bgGrad.addColorStop(0, '#0a1026');
        bgGrad.addColorStop(1, '#1a1238');
      } else if (activeCond === 'rain' || activeCond === 'storm') {
        bgGrad.addColorStop(0, '#09111e');
        bgGrad.addColorStop(1, '#131d2e');
      } else {
        bgGrad.addColorStop(0, '#101528');
        bgGrad.addColorStop(1, '#1f193b');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (activeCond === 'clear') {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius || 1.4, 0, Math.PI * 2);
          p.opacity = Math.max(0.2, Math.min(1, p.opacity + (Math.random() - 0.5) * 0.04));
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
        });
      } else if (activeCond === 'rain' || activeCond === 'storm') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.lineWidth = 1.4;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + (p.length || 15));
          ctx.stroke();
          p.y += p.speed;
          p.x -= 1;
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        });
      } else if (activeCond === 'snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius || 2, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(p.y * 0.02) * 0.5;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        });
      } else if (activeCond === 'wind') {
        windAngle += 0.04;
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)';
        ctx.lineWidth = 1;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 36, p.y + Math.sin(windAngle + p.x) * 3);
          ctx.stroke();
          p.x += p.speed * 7;
          if (p.x > width) {
            p.x = -40;
            p.y = Math.random() * height;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [report?.condition]);

  const localeTag = getLocaleTag(language);

  const formatDayHeader = (dateISO: string, index: number) => {
    if (index === 0) return t('weatherTodayLabel', 'Hoy');
    if (index === 1) return t('weatherTomorrowLabel', 'Mañana');
    try {
      const d = new Date(`${dateISO}T12:00:00Z`);
      return d.toLocaleDateString(localeTag, { weekday: 'short', day: 'numeric', month: 'short' });
    } catch {
      return dateISO;
    }
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-20 md:pt-12 pb-28 md:pb-16">
      {/* Header */}
      <header className="py-6 md:py-8 max-w-4xl">
        <p className="text-xs font-semibold text-[#7DD3FC] uppercase tracking-wider mb-2">
          {t('weatherTag', 'Open-Meteo + 7Timer! Astro · Tiempo Real y 7 Días')}
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('weatherTitle', 'Previsión Meteorológica Astronómica Real')}
        </h1>
        <p className="text-sm sm:text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t(
            'weatherSubtitle',
            'Consulta en tiempo real y a 7 días vista las nubes por capas atmosféricas, viento, humedad, fase lunar, seeing y transparencia para cualquier ciudad, enclave o tu GPS.'
          )}
        </p>
      </header>

      {/* Real-Time Search & GPS Panel */}
      <section className="glass-panel rounded-2xl p-4 sm:p-6 border border-[#38BDF8]/30 bg-[#0d1528]/90 mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#7DD3FC] text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'searchWeatherPlaceholder',
                'Busca una ciudad, pueblo o coordenadas (ej. 40.22, -0.35)...'
              )}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#7DD3FC] font-['Plus_Jakarta_Sans'] text-sm"
              id="input-weather-search"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-3 bg-[#FEE685] hover:bg-white disabled:opacity-60 text-black font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            id="btn-weather-search"
          >
            <span className="material-symbols-outlined text-lg">
              {isLoading ? 'sync' : 'cloud_sync'}
            </span>
            <span>{isLoading ? t('searchingWeather', 'Consultando tiempo real...') : t('getRealtimeWeather', 'Obtener Tiempo Real')}</span>
          </button>

          <button
            type="button"
            onClick={handleUseMyGps}
            disabled={isLocating}
            className="px-5 py-3 bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-60 text-white font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            id="btn-weather-gps"
          >
            <span className="material-symbols-outlined text-lg">
              {isLocating ? 'sync' : 'my_location'}
            </span>
            <span>{isLocating ? t('spotsGpsDetectingBtn', 'Localizando...') : t('weatherUseGpsBtn', 'Mi GPS Real')}</span>
          </button>
        </form>

        {/* GPS Error Notice */}
        {gpsError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-400/40 text-xs text-rose-200 flex items-center justify-between gap-3">
            <span>
              {gpsError === 'denied'
                ? t('gpsErrDenied', 'Permiso GPS denegado. Activa la ubicación en tu navegador/móvil para obtener tus coordenadas reales.')
                : gpsError === 'unsupported'
                ? t('gpsErrUnsupported', 'Tu navegador no soporta geolocalización GPS.')
                : t('gpsErrUnavailable', 'No se pudo obtener señal GPS todavía. Comprueba la ubicación del dispositivo.')}
            </span>
            <button
              type="button"
              onClick={handleUseMyGps}
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              {t('gpsRetryBtn', 'Activar GPS')}
            </button>
          </div>
        )}

        {/* Geocoding disambiguation candidates */}
        {candidates.length > 1 && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-xs text-white/60 block">
              {t('weatherSelectMatchLabel', 'Coincidencias encontradas (selecciona la exacta):')}
            </span>
            <div className="flex flex-wrap gap-2">
              {candidates.map((cand, idx) => (
                <button
                  key={`${cand.latitude}-${cand.longitude}-${idx}`}
                  type="button"
                  onClick={() =>
                    loadWeatherForPoint({
                      lat: cand.latitude,
                      lng: cand.longitude,
                      locationName: cand.name,
                      region: cand.admin1 || '',
                      country: cand.country || '',
                      elevationMeters: cand.elevation,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    report &&
                    Math.abs(report.latitude - cand.latitude) < 0.01 &&
                    Math.abs(report.longitude - cand.longitude) < 0.01
                      ? 'bg-[#FEE685] text-black border-[#FEE685] font-bold'
                      : 'bg-white/5 hover:bg-white/15 text-white/85 border-white/15'
                  }`}
                >
                  {cand.name}
                  {cand.admin1 ? `, ${cand.admin1}` : ''}
                  {cand.country ? ` (${cand.country})` : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Certified Starlight Enclaves Quick Selectors (All trigger real live API fetches) */}
        <div className="pt-3 border-t border-white/10">
          <span className="text-xs text-white/60 block mb-2">
            {t('weatherQuickPresets', 'Enclaves Starlight (consulta en vivo):')}
          </span>
          <div className="flex flex-wrap gap-2">
            {FEATURED_OBSERVATORIES.map((spot) => {
              const active =
                report &&
                Math.abs(report.latitude - spot.latitude) < 0.02 &&
                Math.abs(report.longitude - spot.longitude) < 0.02;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => {
                    setCandidates([]);
                    setSearchQuery(spot.name);
                    loadWeatherForPoint({
                      lat: spot.latitude,
                      lng: spot.longitude,
                      locationName: spot.name,
                      region: spot.region,
                      country: spot.country,
                      elevationMeters: spot.elevationMeters,
                      bortleClass: spot.bortleClass,
                      sqm: spot.sqm,
                      catalogSpotName: spot.name,
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FEE685] text-black border-[#FEE685] font-bold'
                      : 'bg-white/5 hover:bg-white/15 text-white/85 border-white/15'
                  }`}
                >
                  {spot.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved Offline Weather Reports */}
        {savedReports.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <span className="text-xs text-emerald-300 font-semibold block mb-2">
              {t('weatherOfflineSavedList', 'Previsiones guardadas en el dispositivo (disponibles sin cobertura):')}
            </span>
            <div className="flex flex-wrap gap-2">
              {savedReports.map((saved) => (
                <button
                  key={`${saved.latitude}-${saved.longitude}`}
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setReport(saved);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-400/30 cursor-pointer"
                >
                  {saved.locationName} · {saved.temperatureC}°C
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {errorMsg && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-950/60 border border-rose-400/40 text-sm text-rose-100">
          {errorMsg}
        </div>
      )}

      {/* Main Live Stage */}
      {report && (
        <>
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#0a1026] shadow-2xl mb-8 flex flex-col justify-between p-5 sm:p-7 gap-6 border border-white/12">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Top Location & Live Temperature Banner */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-black/55 backdrop-blur-md p-5 rounded-2xl border border-white/15">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 text-xs text-[#7DD3FC] font-['JetBrains_Mono'] flex-wrap">
                  <span>{report.sources.weather}</span>
                  {report.sources.astro && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{report.sources.astro}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>
                    {report.latitude.toFixed(4)}°, {report.longitude.toFixed(4)}°
                  </span>
                  {typeof report.elevationMeters === 'number' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{report.elevationMeters} m</span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] truncate">
                  {report.locationName}
                </h2>

                <p className="text-xs text-slate-300">
                  {[report.region, report.country].filter(Boolean).join(' · ') ||
                    translateWeatherCondition(report.condition, language)}
                  {' · '}
                  {t('weatherUpdatedLabel', 'Actualizado')}:{' '}
                  {new Date(report.updatedAtISO).toLocaleTimeString(localeTag, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggleSaveOffline}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCurrentReportSaved
                      ? 'bg-[#FEE685] text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isCurrentReportSaved ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  <span>{isCurrentReportSaved ? t('weatherSavedBtn') : t('weatherSaveBtn')}</span>
                </button>

                <div className="text-left sm:text-right">
                  <span className="block text-[11px] text-white/70 uppercase font-['JetBrains_Mono']">
                    {t('weatherTempLabel')}
                  </span>
                  <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                    {report.temperatureC}°C
                  </span>
                </div>

                <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-center min-w-[130px]">
                  <span className="block text-[10px] text-white/75 uppercase font-bold tracking-wider">
                    {t('weatherSeeingLabel')}
                  </span>
                  {report.seeingQuality ? (
                    <span
                      className={`text-sm font-extrabold block ${
                        report.seeingQuality === 'Excelente'
                          ? 'text-emerald-400'
                          : report.seeingQuality === 'Bueno'
                          ? 'text-[#FEE685]'
                          : 'text-amber-400'
                      }`}
                    >
                      {translateSeeingQuality(report.seeingQuality, language)}
                      {report.seeingArcsec ? ` (${report.seeingArcsec})` : ''}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 font-semibold block">
                      {t('weatherSeeingUnavailable', 'No disponible (7Timer)')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Real-Time Telemetry Row */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-pastel-gold p-4 rounded-2xl border border-[#7DD3FC]/40 backdrop-blur-md">
                <span className="text-xs text-[#BAE6FD] uppercase font-['JetBrains_Mono'] font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#7DD3FC]">air</span>
                  {t('weatherWindLabel')} / {t('weatherHumidityShort', 'Humedad')}
                </span>
                <span className="text-lg font-extrabold text-white font-['JetBrains_Mono'] block">
                  {report.windKmH} km/h ({report.windDirection}) · {report.humidityPct}%
                </span>
              </div>

              <div className="card-pastel-gold p-4 rounded-2xl border border-[#7DD3FC]/40 backdrop-blur-md">
                <span className="text-xs text-[#BAE6FD] uppercase font-['JetBrains_Mono'] font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#7DD3FC]">visibility</span>
                  {t('weatherTranspLabel')}
                </span>
                <span className="text-base font-extrabold text-white font-['JetBrains_Mono'] block">
                  {report.transparencyLabel ||
                    (report.visibilityKm !== null
                      ? `${t('weatherVisPrefix', 'Visibilidad')}: ${report.visibilityKm} km`
                      : t('weatherSeeingUnavailable', 'No disponible'))}
                </span>
              </div>

              <div className="card-pastel-gold p-4 rounded-2xl border border-[#7DD3FC]/40 backdrop-blur-md">
                <span className="text-xs text-[#BAE6FD] uppercase font-['JetBrains_Mono'] font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#7DD3FC]">brightness_3</span>
                  {t('weatherMoonLabel')}
                </span>
                <span className="text-lg font-extrabold text-white block font-['Plus_Jakarta_Sans']">
                  {translateMoonPhase(report.moonPhaseName, language)} ({report.moonIlluminationPct}%)
                </span>
              </div>

              <div className="card-pastel-gold p-4 rounded-2xl border border-[#7DD3FC]/40 backdrop-blur-md">
                <span className="text-xs text-[#BAE6FD] uppercase font-['JetBrains_Mono'] font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#7DD3FC]">dark_mode</span>
                  {t('weatherBortleLabel')}
                </span>
                {report.bortleClass !== null && report.sqm !== null ? (
                  <span className="text-base font-extrabold text-white font-['JetBrains_Mono'] block">
                    {t('weatherBortleClassPrefix')} {report.bortleClass} (SQM {report.sqm})
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-200 block leading-snug">
                    {t('weatherBortleCatalogOnly', 'Solo medido en enclaves catalogados Starlight/DarkSky')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Direct Links to External 7-Day Astronomy Portals & Maps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <a
              href={buildClearOutsideUrl(report.latitude, report.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#0b2545] hover:bg-[#113562] border border-[#38BDF8]/50 text-white flex items-center justify-between gap-3 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-[#7DD3FC] block">
                  {t('weatherClearOutsideBadge', 'Web Astronómica · 7 Días Vista')}
                </span>
                <span className="text-sm font-extrabold block">
                  {t('weatherOpenClearOutsideBtn', 'Abrir en Clear Outside (7 días)')}
                </span>
              </div>
              <span className="material-symbols-outlined text-xl text-[#FEE685]">open_in_new</span>
            </a>

            <a
              href={buildWindyUrl(report.latitude, report.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#0d1f3a] hover:bg-[#152d52] border border-[#38BDF8]/40 text-white flex items-center justify-between gap-3 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-[#7DD3FC] block">
                  {t('weatherWindyBadge', 'Radar & Capas en Vivo')}
                </span>
                <span className="text-sm font-extrabold block">
                  {t('weatherOpenWindyBtn', 'Abrir en Windy (Viento y Nubes)')}
                </span>
              </div>
              <span className="material-symbols-outlined text-xl text-[#7DD3FC]">open_in_new</span>
            </a>

            <a
              href={buildGoogleMapsPinUrl(report.latitude, report.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#0d1f3a] hover:bg-[#152d52] border border-white/20 text-white flex items-center justify-between gap-3 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  {t('weatherGmapsCoordLabel', 'Coordenadas Exactas')}
                </span>
                <span className="text-sm font-extrabold block">
                  {t('weatherOpenExactGmapsBtn', 'Ver punto en Google Maps')}
                </span>
              </div>
              <span className="material-symbols-outlined text-xl text-emerald-300">location_on</span>
            </a>
          </div>

          {/* Real Cloud Layers Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card-pastel-gold rounded-3xl p-6 border border-[#7DD3FC]/50 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {t('weatherLowCloudsTitle')}
                </span>
                <span className="text-sm font-extrabold text-[#7DD3FC] font-['JetBrains_Mono']">
                  {report.lowCloudsPct}%
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#082F49]/80 overflow-hidden border border-[#38BDF8]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#0369A1] to-[#059669] transition-all duration-500"
                  style={{ width: `${report.lowCloudsPct}%` }}
                />
              </div>
              <p className="text-xs text-[#E0F2FE] font-medium mt-3">{t('weatherLowCloudsDesc')}</p>
            </div>

            <div className="card-pastel-gold rounded-3xl p-6 border border-[#7DD3FC]/50 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {t('weatherMidCloudsTitle')}
                </span>
                <span className="text-sm font-extrabold text-[#7DD3FC] font-['JetBrains_Mono']">
                  {report.midCloudsPct}%
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#082F49]/80 overflow-hidden border border-[#38BDF8]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#0369A1] to-[#D97706] transition-all duration-500"
                  style={{ width: `${report.midCloudsPct}%` }}
                />
              </div>
              <p className="text-xs text-[#E0F2FE] font-medium mt-3">{t('weatherMidCloudsDesc')}</p>
            </div>

            <div className="card-pastel-gold rounded-3xl p-6 border border-[#7DD3FC]/50 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {t('weatherHighCloudsTitle')}
                </span>
                <span className="text-sm font-extrabold text-[#7DD3FC] font-['JetBrains_Mono']">
                  {report.highCloudsPct}%
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#082F49]/80 overflow-hidden border border-[#38BDF8]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#0369A1] to-[#7C3AED] transition-all duration-500"
                  style={{ width: `${report.highCloudsPct}%` }}
                />
              </div>
              <p className="text-xs text-[#E0F2FE] font-medium mt-3">{t('weatherHighCloudsDesc')}</p>
            </div>
          </div>

          {/* 7-Day Nighttime Clear Window Forecast */}
          <section className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/15 bg-[#0a1122]/90 mb-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {t('weather7DaysTitle', 'Previsión Nocturna a 7 Días · Ventana Despejada por Capas')}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {t(
                    'weather7DaysDesc',
                    'Análisis nocturno real (20:00 – 05:00 hora local) de nubes bajas, medias y altas, viento, lluvia e iluminación lunar.'
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
              {report.forecast7Days.map((day, idx) => {
                const isClearNight = day.nightTotalCloudsPct <= 25;
                const isPartialNight = day.nightTotalCloudsPct > 25 && day.nightTotalCloudsPct <= 60;
                return (
                  <div
                    key={day.dateISO}
                    className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 ${
                      isClearNight
                        ? 'bg-emerald-950/35 border-emerald-400/40'
                        : isPartialNight
                        ? 'bg-amber-950/25 border-amber-400/30'
                        : 'bg-slate-900/60 border-white/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-white uppercase block">
                        {formatDayHeader(day.dateISO, idx)}
                      </span>
                      <span className="text-[11px] font-['JetBrains_Mono'] text-slate-400 block">
                        {day.dateISO}
                      </span>
                      <span
                        className={`text-xs font-bold block pt-1 ${
                          isClearNight
                            ? 'text-emerald-300'
                            : isPartialNight
                            ? 'text-amber-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {translateWeatherCondition(day.condition, language)} · {day.nightTotalCloudsPct}%
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-['JetBrains_Mono'] text-slate-200 border-y border-white/10 py-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('weatherLayerLowShort', 'Bajas')}:</span>
                        <span>{day.nightLowCloudsPct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('weatherLayerMidShort', 'Medias')}:</span>
                        <span>{day.nightMidCloudsPct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('weatherLayerHighShort', 'Altas')}:</span>
                        <span>{day.nightHighCloudsPct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('weatherWindShort', 'Viento')}:</span>
                        <span>{day.nightWindKmH} km/h</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-white font-bold font-['JetBrains_Mono']">
                        <span>
                          {day.tempMinC}° / {day.tempMaxC}°C
                        </span>
                        <span className="text-sky-300">{day.precipitationProbMaxPct}% ☔</span>
                      </div>
                      <p className="text-slate-300 leading-tight">
                        {translateMoonPhase(day.moonPhaseName, language)} ({day.moonIlluminationPct}%)
                      </p>
                      <p
                        className={`font-['JetBrains_Mono'] font-bold ${
                          day.clearWindowHours ? 'text-emerald-300' : 'text-slate-400'
                        }`}
                      >
                        {day.clearWindowHours
                          ? `${t('weatherWindowShort', 'Ventana')}: ${day.clearWindowHours}`
                          : t('weatherNoWindowShort', 'Sin ventana <25%')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Real Stargazing Recommendation Box */}
          <div className="card-pastel-gold rounded-3xl p-6 md:p-8 border border-[#7DD3FC]/50 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#082F49]/80 text-[#7DD3FC] border border-[#38BDF8]/50 flex items-center justify-center shrink-0 font-extrabold shadow-md">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white mb-1 font-['Plus_Jakarta_Sans']">
                  {t('weatherRecTitlePrefix')} {report.locationName}
                </h3>
                <p className="text-sm md:text-base text-[#E0F2FE] font-medium leading-relaxed font-['Plus_Jakarta_Sans']">
                  {report.totalCloudsPct < 25 && report.windKmH < 30
                    ? `${t('weatherRealClearSummary', 'Condiciones favorables ahora: cobertura nubosa total del')} ${report.totalCloudsPct}% (${report.lowCloudsPct}% ${t('weatherLayerLowShort', 'bajas')}, ${report.midCloudsPct}% ${t('weatherLayerMidShort', 'medias')}, ${report.highCloudsPct}% ${t('weatherLayerHighShort', 'altas')}) ${t('weatherAndWind', 'y viento de')} ${report.windKmH} km/h. ${
                        report.forecast7Days[0]?.clearWindowHours
                          ? `${t('weatherTonightWindowPrefix', 'Ventana despejada esta noche')}: ${report.forecast7Days[0].clearWindowHours}.`
                          : ''
                      }`
                    : `${t('weatherRealCloudySummary', 'Nubosidad o viento a vigilar ahora:')} ${report.totalCloudsPct}% ${t('weatherCloudsLabelShort', 'de nubes totales')} ${t('weatherAndWind', 'y viento de')} ${report.windKmH} km/h. ${
                        report.forecast7Days[0]?.clearWindowHours
                          ? `${t('weatherTonightWindowPrefix', 'Mejor ventana prevista esta noche')}: ${report.forecast7Days[0].clearWindowHours}.`
                          : t('weatherCheck7DaysHint', 'Revisa la tabla de 7 días o Clear Outside para localizar el próximo claro nocturno.')
                      }`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
