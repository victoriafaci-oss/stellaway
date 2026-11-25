import React, { useState, useEffect, useRef } from 'react';
import { AURORAS_DATA, AuroraSpot } from '../data/aurorasData';
import { useLanguage } from '../context/LanguageContext';
import { getRegionImage } from '../lib/regionImages';
import {
  watchLivePosition,
  buildGoogleMapsDirectionsUrl,
  LiveCoordinates,
} from '../lib/locationService';
import {
  fetchLiveNoaaKpIndex,
  buildClearOutsideUrl,
  buildWindyUrl,
  LiveAuroraKpData,
} from '../lib/weatherService';
import {
  translateCountry,
  translateAuroraFrequency,
  translateBortleText,
  translateRegionInfo,
  matchesMultilingualSearch,
} from '../lib/locationI18n';

interface AurorasViewProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
}

const AURORA_LEGENDARY_ENCLAVES: Record<string, string[]> = {
  Noruega: ['Tromsø', 'Alta', 'Lofoten', 'Senja', 'Svalbard', 'Nordkapp'],
  Suecia: ['Abisko', 'Kiruna', 'Jukkasjärvi', 'Porjus', 'Luleå'],
  Finlandia: ['Rovaniemi', 'Inari', 'Saariselkä', 'Levi', 'Utsjoki'],
  Islandia: ['Thingvellir', 'Kirkjufell', 'Vík', 'Jökulsárlón', 'Akureyri'],
  Canadá: ['Yellowknife', 'Whitehorse', 'Churchill', 'Banff', 'Dawson City'],
  'Estados Unidos': ['Fairbanks', 'Coldfoot', 'Denali', 'Anchorage'],
  'Nueva Zelanda': ['Rakiura / Stewart Island', 'Lake Tekapo', 'Queenstown', 'Dunedin'],
  Australia: ['Tasmania / Hobart', 'Cradle Mountain', 'Bruny Island'],
  Chile: ['Punta Arenas', 'Torres del Paine', 'Puerto Williams', 'Cabo de Hornos'],
  Argentina: ['Ushuaia', 'Canal Beagle', 'Tolhuin', 'Paso Garibaldi'],
  Rusia: ['Múrmansk', 'Teriberka', 'Península de Kola'],
  Antártida: ['Base O\'Higgins', 'Península Antártica', 'Isla Decepción'],
  'Islas Georgias del Sur': ['Grytviken', 'Bahía Cumberland'],
  'Islas Malvinas': ['Puerto Argentino / Stanley'],
  boreal: ['Tromsø', 'Abisko', 'Rovaniemi', 'Kirkjufell', 'Yellowknife', 'Fairbanks', 'Múrmansk'],
  austral: ['Rakiura (N. Zelanda)', 'Tasmania (Australia)', 'Ushuaia (Argentina)', 'Punta Arenas (Chile)', 'Antártida', 'Georgias del Sur'],
  global: ['Tromsø (Noruega)', 'Abisko (Suecia)', 'Rovaniemi (Finlandia)', 'Kirkjufell (Islandia)', 'Yellowknife (Canadá)', 'Fairbanks (Alaska)', 'Rakiura (N. Zelanda)', 'Ushuaia (Argentina)']
};

export const AurorasView: React.FC<AurorasViewProps> = ({ onGoBack, onGoHome }) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHemisphere, setSelectedHemisphere] = useState<'todos' | 'norte' | 'sur'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedCountry, setSelectedCountry] = useState<string>('todos');
  const [selectedSpot, setSelectedSpot] = useState<AuroraSpot | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Geolocation & Distance Calculation State
  const [userCoords, setUserCoords] = useState<LiveCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [liveKp, setLiveKp] = useState<LiveAuroraKpData | null>(null);
  const [kpLoading, setKpLoading] = useState<boolean>(true);
  const stopWatchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchLiveNoaaKpIndex()
      .then((data) => {
        if (mounted) setLiveKp(data);
      })
      .finally(() => {
        if (mounted) setKpLoading(false);
      });
    return () => {
      mounted = false;
      if (stopWatchRef.current) {
        stopWatchRef.current();
      }
    };
  }, []);

  // Haversine distance formula
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const handleDetectLocation = () => {
    if (stopWatchRef.current) {
      stopWatchRef.current();
      stopWatchRef.current = null;
    }

    setIsLocating(true);
    setGeoMessage(t('auLocatingMsg'));

    stopWatchRef.current = watchLivePosition(
      (coords) => {
        setUserCoords(coords);
        setSortByDistance(true);
        setGeoMessage(
          `${t('auGeoDetectedPrefix')} ${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°${
            coords.accuracyMeters ? ` (±${coords.accuracyMeters} m)` : ''
          }`
        );
        setIsLocating(false);
      },
      (errCode) => {
        setIsLocating(false);
        setSortByDistance(false);
        setUserCoords(null);
        if (errCode === 'denied') {
          setGeoMessage(t('gpsErrDenied', 'Permiso GPS denegado. Activa la ubicación en tu navegador/móvil para obtener tus coordenadas reales.'));
        } else if (errCode === 'unsupported') {
          setGeoMessage(t('auGeoNoSupport'));
        } else {
          setGeoMessage(t('gpsErrUnavailable', 'No se pudo obtener señal GPS todavía. Comprueba la ubicación del dispositivo.'));
        }
      }
    );
  };

  // Distinct countries list
  const countries = ['todos', ...Array.from(new Set(AURORAS_DATA.map((s) => s.country)))];

  // Filtering
  let filteredSpots = AURORAS_DATA.filter((spot) => {
    if (selectedHemisphere !== 'todos' && spot.hemisphere !== selectedHemisphere) {
      return false;
    }
    if (selectedCategory !== 'todos' && spot.frequencyCategory !== selectedCategory) {
      return false;
    }
    if (selectedCountry !== 'todos' && spot.country !== selectedCountry) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    return matchesMultilingualSearch(searchQuery, [
      spot.name,
      spot.region,
      spot.country,
      translateCountry(spot.country, language),
      spot.frequencyLabel,
      translateAuroraFrequency(spot.frequencyLabel, language),
      spot.description,
      ...spot.highlights,
    ]);
  });

  // Sort by distance if enabled
  if (sortByDistance && userCoords) {
    filteredSpots = [...filteredSpots].sort((a, b) => {
      const distA = calculateDistanceKm(userCoords.lat, userCoords.lng, a.latitude, a.longitude);
      const distB = calculateDistanceKm(userCoords.lat, userCoords.lng, b.latitude, b.longitude);
      return distA - distB;
    });
  }

  // Convert lat/lng to percentage for world map
  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const clampedLat = Math.max(-80, Math.min(85, lat));
    const y = ((85 - clampedLat) / 165) * 100;
    return { left: `${Math.max(3, Math.min(97, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` };
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10 pb-28 md:pb-16 animate-fadeIn">
      {/* Header */}
      <header className="py-4 md:py-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>{t('auHeaderBadge')}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('auHeaderTitle')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t('auHeaderDesc')}
        </p>
      </header>

      {/* Aurora Science & Guide Banner */}
      <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-sky-950/70 via-[#0b1b33]/85 to-blue-950/70 border border-[#38BDF8]/40 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/30 to-blue-500/30 text-sky-300 border border-sky-400/50 flex items-center justify-center shrink-0 text-2xl shadow-md">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-300 font-['JetBrains_Mono']">
                {t('auSciBadge')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 text-[10px] font-bold border border-sky-400/30">
                {t('auSciPill')}
              </span>
            </div>
            <p className="text-xs text-white/90 mt-0.5 max-w-2xl leading-relaxed">
              {t('auSciDesc')}
            </p>
            {/* Live NOAA SWPC Kp Telemetry */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
              {kpLoading ? (
                <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-sky-400/30 text-sky-200 font-mono font-bold">
                  NOAA SWPC Kp...
                </span>
              ) : liveKp ? (
                <>
                  <span
                    className={`px-2.5 py-1 rounded-xl border font-mono font-black ${
                      liveKp.kpIndex >= 5
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                        : liveKp.kpIndex >= 3
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-sky-500/20 border-sky-400/40 text-sky-200'
                    }`}
                  >
                    ● NOAA Kp {liveKp.kpIndex.toFixed(1)} / 9
                    {liveKp.kpIndex >= 5 ? ' · Tormenta Geomagnética' : liveKp.kpIndex >= 3 ? ' · Actividad Moderada' : ' · Calma'}
                  </span>
                  {liveKp.timeTagUTC && (
                    <span className="text-white/60 font-mono">
                      UTC: {liveKp.timeTagUTC}
                    </span>
                  )}
                </>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 text-white/70 font-mono">
                  NOAA SWPC Kp: no disponible
                </span>
              )}
              <a
                href="https://www.swpc.noaa.gov/products/aurora-30-minute-forecast"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sky-200 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>NOAA Óvalo 30 min</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={isLocating}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shrink-0 border shadow-md ${
            sortByDistance
              ? 'bg-[#0284C7] text-white border-[#7DD3FC] shadow-lg shadow-sky-950/40'
              : 'bg-[#082F49]/80 hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white border-[#38BDF8]/60'
          }`}
        >
          <span className="material-symbols-outlined text-sm">my_location</span>
          <span>{isLocating ? t('auLocatingBtn') : sortByDistance ? t('auSortedBtn') : t('auSortBtn')}</span>
        </button>
      </div>

      {geoMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-[#082F49]/90 border border-[#38BDF8] text-[#BAE6FD] text-xs text-center animate-fadeIn font-bold">
          {geoMessage}
        </div>
      )}

      {/* Filter and View Controls Bar */}
      <div className="mb-6 space-y-3 bg-[#0B061A]/80 p-4 rounded-3xl border border-[#38BDF8]/40 shadow-xl backdrop-blur-md">
        {/* Search Input & View Switch */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#7DD3FC] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('auSearchPlaceholder')}
              className="w-full bg-[#170E28] border border-[#38BDF8]/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#7DD3FC] font-bold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-white/50 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white border-[#7DD3FC] shadow-lg shadow-sky-950/40'
                  : 'bg-[#082F49]/60 hover:bg-[#0284C7]/50 text-[#BAE6FD] hover:text-white border-[#38BDF8]/40'
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              <span>{t('auGridTab')}</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white border-[#7DD3FC] shadow-lg shadow-sky-950/40'
                  : 'bg-[#082F49]/60 hover:bg-[#0284C7]/50 text-[#BAE6FD] hover:text-white border-[#38BDF8]/40'
              }`}
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>{t('auMapTab')}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Buttons: Hemispheres & Frequency */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#7DD3FC] font-['JetBrains_Mono']">
            {t('auHemisphereLabel')}
          </span>

          <button
            onClick={() => setSelectedHemisphere('todos')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedHemisphere === 'todos'
                ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white border-[#7DD3FC] font-black shadow-md shadow-sky-500/25'
                : 'bg-[#082F49]/60 hover:bg-[#082F49] text-[#BAE6FD] hover:text-white border-[#38BDF8]/40'
            }`}
          >
            {t('auAllCount')} ({AURORAS_DATA.length})
          </button>

          <button
            onClick={() => setSelectedHemisphere('norte')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              selectedHemisphere === 'norte'
                ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white border-[#7DD3FC] font-black shadow-md shadow-sky-500/25'
                : 'bg-[#082F49]/60 hover:bg-[#082F49] text-[#BAE6FD] hover:text-white border-[#38BDF8]/40'
            }`}
          >
            <span>🌌 {t('auNorthPill')}</span>
            <span className="text-[10px] opacity-80">
              ({AURORAS_DATA.filter((s) => s.hemisphere === 'norte').length})
            </span>
          </button>

          <button
            onClick={() => setSelectedHemisphere('sur')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              selectedHemisphere === 'sur'
                ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white border-[#7DD3FC] font-black shadow-md shadow-sky-500/25'
                : 'bg-[#082F49]/60 hover:bg-[#082F49] text-[#BAE6FD] hover:text-white border-[#38BDF8]/40'
            }`}
          >
            <span>✨ {t('auSouthPill')}</span>
            <span className="text-[10px] opacity-80">
              ({AURORAS_DATA.filter((s) => s.hemisphere === 'sur').length})
            </span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1 hidden sm:block" />

          {/* Frequency Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl text-[#F0F9FF] text-xs font-bold focus:outline-none focus:border-[#7DD3FC] cursor-pointer"
          >
            <option value="todos">{t('auFreqAll')}</option>
            <option value="nucleo">{t('auFreqCore')}</option>
            <option value="frecuente">{t('auFreqFrequent')}</option>
            <option value="ocasional">{t('auFreqOccasional')}</option>
          </select>

          {/* Country Select */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-1 bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl text-[#F0F9FF] text-xs font-bold focus:outline-none focus:border-[#7DD3FC] cursor-pointer"
          >
            <option value="todos">{t('auAllCountries')}</option>
            {countries.filter((c) => c !== 'todos').map((c) => (
              <option key={c} value={c}>
                {translateCountry(c, language)}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Tag Pills: Enclaves Legendarios Aurorales */}
        {(() => {
          const detectedCountry = (() => {
            if (selectedCountry !== 'todos') {
              const match = Object.keys(AURORA_LEGENDARY_ENCLAVES).find(
                (c) => c.toLowerCase() === selectedCountry.toLowerCase()
              );
              if (match) return match;
            }
            const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (q.includes('noruega') || q.includes('norway') || q.includes('norvege') || q.includes('norwegen') || q.includes('norvegia') || q.includes('troms') || q.includes('lofot') || q.includes('svalbard') || q.includes('senja') || q.includes('alta') || q.includes('nordkapp')) return 'Noruega';
            if (q.includes('suecia') || q.includes('sweden') || q.includes('suede') || q.includes('schweden') || q.includes('svezia') || q.includes('abisko') || q.includes('kiruna') || q.includes('jukkasjarvi') || q.includes('porjus')) return 'Suecia';
            if (q.includes('finlandia') || q.includes('finland') || q.includes('finlande') || q.includes('finnland') || q.includes('laponia') || q.includes('lapland') || q.includes('lapponia') || q.includes('rovaniemi') || q.includes('inari') || q.includes('saariselka')) return 'Finlandia';
            if (q.includes('islandia') || q.includes('iceland') || q.includes('islande') || q.includes('islanda') || q.includes('reykjavik') || q.includes('thingvellir') || q.includes('vik') || q.includes('kirkjufell')) return 'Islandia';
            if (q.includes('canada') || q.includes('kanada') || q.includes('yellowknife') || q.includes('whitehorse') || q.includes('yukon') || q.includes('churchill')) return 'Canadá';
            if (q.includes('alaska') || q.includes('fairbanks') || q.includes('eeuu') || q.includes('usa') || q.includes('united states') || q.includes('estados unidos') || q.includes('denali')) return 'Estados Unidos';
            if (q.includes('rusia') || q.includes('russia') || q.includes('russie') || q.includes('russland') || q.includes('murmansk') || q.includes('teriberka') || q.includes('kola')) return 'Rusia';
            if (q.includes('nueva zelanda') || q.includes('new zealand') || q.includes('nouvelle-zelande') || q.includes('neuseeland') || q.includes('rakiura') || q.includes('stewart') || q.includes('tekapo')) return 'Nueva Zelanda';
            if (q.includes('australia') || q.includes('australie') || q.includes('australien') || q.includes('tasmania') || q.includes('hobart') || q.includes('cradle')) return 'Australia';
            if (q.includes('chile') || q.includes('chili') || q.includes('cile') || q.includes('patagonia') || q.includes('punta arenas') || q.includes('paine')) return 'Chile';
            if (q.includes('argentina') || q.includes('argentine') || q.includes('argentinien') || q.includes('tierra del fuego') || q.includes('ushuaia')) return 'Argentina';
            if (q.includes('antartida') || q.includes('antarctica') || q.includes('antarctique') || q.includes('antartide') || q.includes('antarktis') || q.includes('ohiggins')) return 'Antártida';
            if (q.includes('georgia')) return 'Islas Georgias del Sur';
            if (q.includes('malvina') || q.includes('falkland') || q.includes('malouines')) return 'Islas Malvinas';
            if (selectedHemisphere === 'sur') return 'austral';
            if (selectedHemisphere === 'norte') return 'boreal';
            return 'global';
          })();

          const enclaves = AURORA_LEGENDARY_ENCLAVES[detectedCountry] || (selectedHemisphere === 'sur' ? AURORA_LEGENDARY_ENCLAVES.austral : (selectedHemisphere === 'norte' ? AURORA_LEGENDARY_ENCLAVES.boreal : AURORA_LEGENDARY_ENCLAVES.global));

          return (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
              <span className="text-[#BAE6FD]/80 text-[11px] font-semibold">
                {t('auLegendaryEnclaves')}{detectedCountry !== 'global' && detectedCountry !== 'boreal' && detectedCountry !== 'austral' ? ` (${translateCountry(detectedCountry, language)})` : ''}:
              </span>
              {enclaves.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const clean = tag.replace(/\s*\([^)]*\)/g, '').trim();
                    setSearchQuery(clean);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                    searchQuery.toLowerCase().includes(tag.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim())
                      ? 'bg-[#38BDF8] text-black border-[#7DD3FC] font-extrabold shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                  }`}
                >
                  🌌 {tag}
                </button>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Territorial / Regional Hero Banner for Auroras */}
      {(() => {
        let activeCountry: string | undefined = selectedCountry !== 'todos' ? selectedCountry : undefined;
        let activeRegion: string | undefined = searchQuery || undefined;

        if (!activeCountry && searchQuery) {
          const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (q.includes('noruega') || q.includes('norway') || q.includes('norvege') || q.includes('norwegen') || q.includes('norvegia') || q.includes('troms') || q.includes('lofot') || q.includes('svalbard') || q.includes('senja') || q.includes('alta') || q.includes('nordkapp')) activeCountry = 'Noruega';
          else if (q.includes('suecia') || q.includes('sweden') || q.includes('suede') || q.includes('schweden') || q.includes('svezia') || q.includes('abisko') || q.includes('kiruna') || q.includes('jukkasjarvi') || q.includes('porjus')) activeCountry = 'Suecia';
          else if (q.includes('finlandia') || q.includes('finland') || q.includes('finlande') || q.includes('finnland') || q.includes('laponia') || q.includes('lapland') || q.includes('lapponia') || q.includes('rovaniemi') || q.includes('inari') || q.includes('saariselka')) activeCountry = 'Finlandia';
          else if (q.includes('islandia') || q.includes('iceland') || q.includes('islande') || q.includes('islanda') || q.includes('reykjavik') || q.includes('thingvellir') || q.includes('vik') || q.includes('kirkjufell')) activeCountry = 'Islandia';
          else if (q.includes('canada') || q.includes('kanada') || q.includes('yellowknife') || q.includes('whitehorse') || q.includes('yukon') || q.includes('churchill')) activeCountry = 'Canadá';
          else if (q.includes('alaska') || q.includes('fairbanks') || q.includes('eeuu') || q.includes('usa') || q.includes('united states') || q.includes('estados unidos') || q.includes('denali')) activeCountry = 'Estados Unidos';
          else if (q.includes('rusia') || q.includes('russia') || q.includes('russie') || q.includes('russland') || q.includes('murmansk') || q.includes('teriberka') || q.includes('kola')) activeCountry = 'Rusia';
          else if (q.includes('nueva zelanda') || q.includes('new zealand') || q.includes('nouvelle-zelande') || q.includes('neuseeland') || q.includes('rakiura') || q.includes('stewart') || q.includes('tekapo')) activeCountry = 'Nueva Zelanda';
          else if (q.includes('australia') || q.includes('australie') || q.includes('australien') || q.includes('tasmania') || q.includes('hobart') || q.includes('cradle')) activeCountry = 'Australia';
          else if (q.includes('chile') || q.includes('chili') || q.includes('cile') || q.includes('patagonia') || q.includes('punta arenas') || q.includes('paine')) activeCountry = 'Chile';
          else if (q.includes('argentina') || q.includes('argentine') || q.includes('argentinien') || q.includes('tierra del fuego') || q.includes('ushuaia')) activeCountry = 'Argentina';
          else if (q.includes('antartida') || q.includes('antarctica') || q.includes('antarctique') || q.includes('antartide') || q.includes('antarktis') || q.includes('ohiggins')) activeCountry = 'Antártida';
          else if (q.includes('georgia')) activeCountry = 'Islas Georgias del Sur';
          else if (q.includes('malvina') || q.includes('falkland') || q.includes('malouines')) activeCountry = 'Islas Malvinas';
          else if (filteredSpots.length > 0) activeCountry = filteredSpots[0].country;
        }

        if (!activeCountry) {
          if (filteredSpots.length > 0) {
            activeCountry = filteredSpots[0].country;
            if (!activeRegion) {
              activeRegion = filteredSpots[0].region;
            }
          } else {
            activeCountry = selectedHemisphere === 'sur' ? 'Nueva Zelanda' : 'Noruega';
          }
        }

        const rawRegionInfo = getRegionImage({
          country: activeCountry,
          region: activeRegion,
          category: selectedHemisphere === 'sur' ? 'Aurora Austral' : 'Aurora Boreal',
          hemisphere: selectedHemisphere !== 'todos' ? selectedHemisphere : undefined,
          isAurora: true,
        });
        const activeRegionInfo = rawRegionInfo ? translateRegionInfo(rawRegionInfo, language) : null;
        if (!activeRegionInfo) return null;
        return (
          <div className="rounded-3xl overflow-hidden border border-[#38BDF8]/40 shadow-2xl bg-gradient-to-br from-[#0b1b33] via-[#09152b] to-[#040b17] mb-8 relative">
            <div className="relative h-60 sm:h-72 w-full overflow-hidden">
              <img
                src={activeRegionInfo.imageUrl}
                alt={activeRegionInfo.nombre_localizacion_principal}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040b17] via-[#040b17]/50 to-transparent" />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-400/40 text-[11px] font-extrabold text-sky-300 shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-sky-300">image</span>
                {t('auRepImgLabel')}: {activeRegionInfo.region || activeRegionInfo.pais}
              </div>
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-xs uppercase font-extrabold text-[#7DD3FC] tracking-wider block font-['JetBrains_Mono']">
                  {activeRegionInfo.pais} {activeRegionInfo.region ? `• ${activeRegionInfo.region}` : ''}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans'] drop-shadow-md">
                  {activeRegionInfo.nombre_localizacion_principal}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 line-clamp-2 max-w-3xl drop-shadow">
                  {activeRegionInfo.descripcion_imagen_generica}
                </p>
              </div>
            </div>
            <div className="px-5 py-3 bg-black/60 border-t border-sky-400/20 flex flex-wrap items-center justify-between text-xs text-sky-200 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#38BDF8]">verified</span>
                {t('auTerritoryHint')}
              </span>
              <span className="font-['JetBrains_Mono'] font-bold text-amber-300 bg-black/50 px-2.5 py-0.5 rounded-lg border border-white/10">
                {filteredSpots.length} {t('auCatalogedSuffix')}
              </span>
            </div>
          </div>
        );
      })()}

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <div className="mb-8 rounded-3xl bg-[#080315] border-2 border-[#38BDF8]/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-black text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7DD3FC]">public</span>
                {t('auMapTitle')}
              </h3>
              <p className="text-xs text-white/70">
                {t('auMapLegend')}
              </p>
            </div>
            <span className="text-xs font-bold text-[#7DD3FC] bg-[#082F49]/80 px-3 py-1 rounded-full border border-[#38BDF8]/50 self-start sm:self-auto shadow-sm">
              {filteredSpots.length} {t('auMapCountSuffix')}
            </span>
          </div>

          {/* Simulated SVG World Map Projection Container */}
          <div className="relative w-full aspect-[2/1] min-h-[300px] bg-gradient-to-b from-[#021020] via-[#051829] to-[#010811] rounded-2xl border border-white/10 overflow-hidden shadow-inner">
            {/* Arctic Oval Indicator Line */}
            <div className="absolute top-[12%] left-0 right-0 h-0.5 border-t border-dashed border-[#38BDF8]/50 z-0" title={t('auBorealMapTip')}>
              <span className="text-[9px] font-mono font-bold text-[#7DD3FC]/80 ml-3">
                {t('auBorealOval')} (~65° - 75° N)
              </span>
            </div>

            {/* Antarctic Oval Indicator Line */}
            <div className="absolute bottom-[16%] left-0 right-0 h-0.5 border-t border-dashed border-violet-400/40 z-0" title={t('auAustralMapTip')}>
              <span className="text-[9px] font-mono font-bold text-violet-400/70 ml-3">
                {t('auAustralOval')} (~60° - 75° S)
              </span>
            </div>

            {/* Equator Guide */}
            <div className="absolute top-[52%] left-0 right-0 h-[1px] bg-white/10 z-0" />

            {/* Interactive Pins */}
            {filteredSpots.map((spot) => {
              const pos = getMapPosition(spot.latitude, spot.longitude);
              const isBoreal = spot.hemisphere === 'norte';

              return (
                <button
                  key={`pin-${spot.id}`}
                  onClick={() => setSelectedSpot(spot)}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 transition-transform hover:scale-125 focus:outline-none"
                  title={`${spot.name} (${translateCountry(spot.country, language)}) - ${translateAuroraFrequency(spot.frequencyLabel, language)}`}
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border shadow-lg ${
                        isBoreal
                          ? 'bg-[#38BDF8] border-white shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse'
                          : 'bg-violet-400 border-white shadow-[0_0_12px_rgba(167,139,250,0.9)] animate-pulse'
                      }`}
                    />
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 pointer-events-none whitespace-nowrap bg-black/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/20 shadow-xl backdrop-blur-md">
                      <span className={isBoreal ? 'text-[#7DD3FC]' : 'text-violet-300'}>
                        {isBoreal ? `● ${t('auBorealBadge')}: ` : `● ${t('auAustralBadge')}: `}
                      </span>
                      {spot.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/75">
            <div className="px-3 py-2 rounded-xl bg-sky-950/50 border border-sky-400/25">{t('auBorealMapTip')}</div>
            <div className="px-3 py-2 rounded-xl bg-violet-950/40 border border-violet-400/25">{t('auAustralMapTip')}</div>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.map((spot) => {
          const isBoreal = spot.hemisphere === 'norte';
          const distance = userCoords
            ? calculateDistanceKm(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude)
            : null;
          const localizedCountry = translateCountry(spot.country, language);
          const localizedFrequency = translateAuroraFrequency(spot.frequencyLabel, language);
          const localizedBortleShort = translateBortleText(spot.bortle.split(' - ')[0], language);

          return (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#130B22] to-[#0A0614] border border-[#38BDF8]/40 hover:border-[#7DD3FC] transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Technical Telemetry Header (No individual photo) */}
                <div className="p-5 pb-3 bg-gradient-to-br from-[#0c1e3a] via-[#09152b] to-[#040b17] border-b border-[#38BDF8]/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-md ${
                        isBoreal
                          ? 'bg-[#0284C7]/90 text-white border-[#7DD3FC]'
                          : 'bg-violet-500/80 text-white border-violet-300'
                      }`}
                    >
                      {isBoreal ? `🌌 ${t('auBorealBadge')}` : `✨ ${t('auAustralBadge')}`}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                      {localizedBortleShort}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white mt-3">
                    <span className="font-extrabold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#38BDF8]">location_on</span>
                      {localizedCountry} • {spot.region}
                    </span>
                    {distance !== null && (
                      <span className="text-[11px] font-mono text-[#7DD3FC] font-bold bg-black/60 border border-[#38BDF8]/40 px-2 py-0.5 rounded-full">
                        {distance.toLocaleString()} km
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] font-['JetBrains_Mono'] text-white/70 flex items-center justify-between">
                    <span>📍 {spot.latitude.toFixed(2)}°, {spot.longitude.toFixed(2)}°</span>
                    <span className="text-[#7DD3FC] font-bold">{localizedFrequency}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#7DD3FC] font-['JetBrains_Mono'] block mb-0.5">
                      {spot.region} • {localizedFrequency}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-[#7DD3FC] transition-colors font-['Plus_Jakarta_Sans'] leading-tight">
                      {spot.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#e1e3e4]/80 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-[#38BDF8]">calendar_month</span>
                      <span className="truncate">{spot.bestSeason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-[#38BDF8]">explore</span>
                      <span className="truncate">{spot.orientation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="px-5 pb-5 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSpot(spot);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#082F49]/80 hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-[#38BDF8]/60 hover:border-[#7DD3FC] shadow-md shadow-sky-950/40 cursor-pointer"
                >
                  <span>{t('auViewSheetBtn')}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpots.length === 0 && (
        <div className="text-center py-16 bg-[#130B22]/50 rounded-3xl border border-white/10 p-8 space-y-3">
          <span className="material-symbols-outlined text-4xl text-white/40">travel_explore</span>
          <h4 className="text-lg font-black text-white">{t('auEmptyTitle')}</h4>
          <p className="text-xs text-white/70">
            {t('auEmptyDesc')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedHemisphere('todos');
              setSelectedCategory('todos');
              setSelectedCountry('todos');
            }}
            className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#38BDF8] text-white hover:text-black font-black text-xs uppercase rounded-xl border border-[#7DD3FC] shadow-lg shadow-sky-950/40 cursor-pointer transition-all"
          >
            {t('auResetBtn')}
          </button>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedSpot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedSpot(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#090414] text-white rounded-3xl border-2 border-[#38BDF8]/60 shadow-[0_0_50px_rgba(56,189,248,0.35)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header with Regional Image */}
            {(() => {
              const rawRegImg = getRegionImage({ ...selectedSpot, isAurora: true });
              const regImg = rawRegImg ? translateRegionInfo(rawRegImg, language) : null;
              const displayImg = regImg?.imageUrl || selectedSpot.imageUrl;
              return (
                <div className="relative aspect-[16/9] w-full shrink-0 bg-slate-900 overflow-hidden">
                  <img
                    src={displayImg}
                    alt={selectedSpot.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090414] via-transparent to-black/50" />

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedSpot(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/30 backdrop-blur-md z-10"
                    aria-label={t('landingLegalCloseBtn')}
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>

                  {/* Badges on modal image */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border ${
                        selectedSpot.hemisphere === 'norte'
                          ? 'bg-[#0284C7] text-white border-[#7DD3FC]'
                          : 'bg-violet-500 text-white border-violet-300'
                      }`}
                    >
                      {selectedSpot.hemisphere === 'norte' ? `🌌 ${t('auBorealBadge')}` : `✨ ${t('auAustralBadge')}`}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-[#082F49]/80 text-[#7DD3FC] text-xs font-black uppercase tracking-wider border border-[#38BDF8]/50 backdrop-blur-md">
                      {translateAuroraFrequency(selectedSpot.frequencyLabel, language)}
                    </span>

                    {regImg && (
                      <span className="px-2.5 py-1 rounded-full bg-black/75 text-amber-300 text-[10px] font-bold border border-amber-400/40 backdrop-blur-md">
                        🌄 {t('dsTerritoryPrefix')} {regImg.region || selectedSpot.region}
                      </span>
                    )}
                  </div>

                  {/* Spot Title on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs font-mono font-bold text-[#7DD3FC] block">
                      {selectedSpot.region}, {translateCountry(selectedSpot.country, language)}
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans'] leading-tight drop-shadow-md">
                      {selectedSpot.name}
                    </h2>
                  </div>
                </div>
              );
            })()}

            {/* Modal Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Description */}
              <p className="text-sm text-[#e1e3e4] leading-relaxed">
                {selectedSpot.description}
              </p>

              {/* Info Matrix Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-[#38BDF8]/40 font-medium">
                <div>
                  <span className="text-[10px] text-[#7DD3FC] uppercase tracking-wider font-bold block">
                    {t('auSeasonLabel')}
                  </span>
                  <span className="text-white font-bold">{selectedSpot.bestSeason}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#7DD3FC] uppercase tracking-wider font-bold block">
                    {t('auOrientationLabel')}
                  </span>
                  <span className="text-white font-bold">{selectedSpot.orientation}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#7DD3FC] uppercase tracking-wider font-bold block">
                    {t('auLightPollLabel')}
                  </span>
                  <span className="text-white font-bold">{translateBortleText(selectedSpot.bortle, language)}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#7DD3FC] uppercase tracking-wider font-bold block">
                    {t('auCoordsLabel')}
                  </span>
                  <span className="text-white font-mono font-bold">
                    {selectedSpot.latitude.toFixed(4)}°, {selectedSpot.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#7DD3FC] font-['JetBrains_Mono']">
                  {t('auHighlightsTitle')}:
                </h4>
                <ul className="space-y-1.5">
                  {selectedSpot.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-[#38BDF8] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accessibility / Night Notes */}
              <div className="p-3.5 bg-[#082F49]/40 rounded-2xl border border-[#38BDF8]/40 text-white/90 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7DD3FC] font-['JetBrains_Mono'] block">
                  {t('auAccessTitle')}:
                </span>
                <p className="leading-relaxed">{selectedSpot.accessibility}</p>
              </div>

              {/* Official Tourism Source */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-white/60 block">{t('auOfficialSourceLabel')}:</span>
                  <span className="text-[#7DD3FC] font-bold">{selectedSpot.officialSource}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <a
                    href={buildClearOutsideUrl(selectedSpot.latitude, selectedSpot.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-800/80 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-400/40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">cloud</span>
                    <span>Clear Outside 7d</span>
                  </a>

                  <a
                    href={buildWindyUrl(selectedSpot.latitude, selectedSpot.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-sky-950/70 hover:bg-sky-800/80 text-sky-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-sky-400/40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">air</span>
                    <span>Windy</span>
                  </a>

                  <a
                    href={buildGoogleMapsDirectionsUrl(selectedSpot.latitude, selectedSpot.longitude, userCoords)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#082F49]/80 hover:bg-[#0284C7] text-[#BAE6FD] hover:text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all border border-[#38BDF8]/60 hover:border-[#7DD3FC] shadow-md shadow-sky-950/30 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#7DD3FC]">map</span>
                    <span>{t('auOpenGMapsBtn')}</span>
                  </a>

                  <a
                    href={selectedSpot.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#38BDF8] text-[#082F49] hover:text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-950/40 border border-[#7DD3FC] cursor-pointer"
                  >
                    <span>{t('auOfficialGuideBtn')}</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
