import React, { useState } from 'react';
import { AURORAS_DATA, AuroraSpot } from '../data/aurorasData';
import { useLanguage } from '../context/LanguageContext';

interface AurorasViewProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const AurorasView: React.FC<AurorasViewProps> = ({ onGoBack, onGoHome }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHemisphere, setSelectedHemisphere] = useState<'todos' | 'norte' | 'sur'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedCountry, setSelectedCountry] = useState<string>('todos');
  const [selectedSpot, setSelectedSpot] = useState<AuroraSpot | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Geolocation & Distance Calculation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

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
    setIsLocating(true);
    setGeoMessage('Detectando posición GPS...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setSortByDistance(true);
          setGeoMessage(`Ubicación detectada (${lat.toFixed(2)}°, ${lng.toFixed(2)}°). Lugares ordenados por cercanía.`);
          setIsLocating(false);
          setTimeout(() => setGeoMessage(null), 4000);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setUserCoords({ lat: 40.4168, lng: -3.7038 }); // Madrid default
          setSortByDistance(true);
          setGeoMessage('Ubicación aproximada establecida. Lugares ordenados por distancia.');
          setIsLocating(false);
          setTimeout(() => setGeoMessage(null), 4000);
        },
        { timeout: 7000 }
      );
    } else {
      setGeoMessage('Tu dispositivo no soporta geolocalización.');
      setIsLocating(false);
    }
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
    const q = searchQuery.toLowerCase().trim();
    return (
      spot.name.toLowerCase().includes(q) ||
      spot.region.toLowerCase().includes(q) ||
      spot.country.toLowerCase().includes(q) ||
      spot.description.toLowerCase().includes(q) ||
      spot.highlights.some((h) => h.toLowerCase().includes(q))
    );
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>Atlas Mundial de Auroras Boreales & Australes</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          Localizador de Auroras Boreales y Australes
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          Explora los mejores enclaves del planeta para observar auroras boreales en el Ártico y auroras australes en el hemisferio sur, clasificados según su cercanía al óvalo auroral magnético, temporada de oscuridad y horizontes de baja contaminación lumínica.
        </p>
      </header>

      {/* Aurora Science & Guide Banner */}
      <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-[#170E28]/85 to-violet-950/70 border border-emerald-400/40 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-violet-500/30 text-emerald-300 border border-emerald-400/50 flex items-center justify-center shrink-0 text-2xl shadow-md">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 font-['JetBrains_Mono']">
                Criterio Científico Stellaway
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                Óvalo Auroral & Viento Solar
              </span>
            </div>
            <p className="text-xs text-white/90 mt-0.5 max-w-2xl leading-relaxed">
              La visibilidad depende de la actividad solar (Kp, componente Bz y viento solar), noche polar y cielos despejados. Clasificamos en <strong>Núcleo Auroral</strong> (bajo el óvalo habitual), <strong>Frecuente</strong> (regular con oscuridad) y <strong>Ocasional</strong> (tormentas solares Kp 4-7+).
            </p>
          </div>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={isLocating}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shrink-0 border shadow-md ${
            sortByDistance
              ? 'bg-emerald-600 text-white border-emerald-400'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
          }`}
        >
          <span className="material-symbols-outlined text-sm">my_location</span>
          <span>{isLocating ? 'Localizando...' : sortByDistance ? 'Ordenado por Cercanía' : 'Ordenar por Cercanía'}</span>
        </button>
      </div>

      {geoMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs text-center animate-fadeIn font-bold">
          {geoMessage}
        </div>
      )}

      {/* Filter and View Controls Bar */}
      <div className="mb-6 space-y-3 bg-[#0B061A]/80 p-4 rounded-3xl border border-emerald-500/30 shadow-xl backdrop-blur-md">
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
              placeholder="Buscar por lugar, fiordo, país (ej: Tromsø, Abisko, Rakiura, Ushuaia, Alaska)..."
              className="w-full bg-[#170E28] border border-emerald-400/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 font-bold"
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black border-emerald-300 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              <span>Cuadrícula</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black border-emerald-300 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>Mapa Mundial</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Buttons: Hemispheres & Frequency */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 font-['JetBrains_Mono']">
            Hemisferio:
          </span>

          <button
            onClick={() => setSelectedHemisphere('todos')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedHemisphere === 'todos'
                ? 'bg-emerald-500 text-black border-emerald-300 font-black'
                : 'bg-white/5 hover:bg-white/15 text-white/80 border-white/15'
            }`}
          >
            Todos ({AURORAS_DATA.length})
          </button>

          <button
            onClick={() => setSelectedHemisphere('norte')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              selectedHemisphere === 'norte'
                ? 'bg-emerald-400 text-black border-emerald-300 font-black shadow-md shadow-emerald-500/30'
                : 'bg-white/5 hover:bg-white/15 text-white/80 border-white/15'
            }`}
          >
            <span>🌌 Norte (Aurora Boreal)</span>
            <span className="text-[10px] opacity-80">
              ({AURORAS_DATA.filter((s) => s.hemisphere === 'norte').length})
            </span>
          </button>

          <button
            onClick={() => setSelectedHemisphere('sur')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              selectedHemisphere === 'sur'
                ? 'bg-violet-400 text-black border-violet-300 font-black shadow-md shadow-violet-500/30'
                : 'bg-white/5 hover:bg-white/15 text-white/80 border-white/15'
            }`}
          >
            <span>✨ Sur (Aurora Austral)</span>
            <span className="text-[10px] opacity-80">
              ({AURORAS_DATA.filter((s) => s.hemisphere === 'sur').length})
            </span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1 hidden sm:block" />

          {/* Frequency Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 bg-[#170E28] border border-emerald-400/40 rounded-xl text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="todos">Cualquier Frecuencia</option>
            <option value="nucleo">Bajo el Núcleo Auroral</option>
            <option value="frecuente">Frecuente / Con Oscuridad</option>
            <option value="ocasional">Ocasional / Tormenta Solar</option>
          </select>

          {/* Country Select */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-1 bg-[#170E28] border border-emerald-400/40 rounded-xl text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos los Países</option>
            {countries.filter((c) => c !== 'todos').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <div className="mb-8 rounded-3xl bg-[#080315] border-2 border-emerald-400/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-black text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">public</span>
                Distribución Global de Enclaves de Auroras
              </h3>
              <p className="text-xs text-white/70">
                Puntos verdes: <span className="text-emerald-300 font-bold">Auroras Boreales (Norte)</span> • Puntos violetas: <span className="text-violet-300 font-bold">Auroras Australes (Sur)</span>
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 self-start sm:self-auto">
              {filteredSpots.length} lugares localizados
            </span>
          </div>

          {/* Simulated SVG World Map Projection Container */}
          <div className="relative w-full aspect-[2/1] min-h-[300px] bg-gradient-to-b from-[#021020] via-[#051829] to-[#010811] rounded-2xl border border-white/10 overflow-hidden shadow-inner">
            {/* Arctic Oval Indicator Line */}
            <div className="absolute top-[12%] left-0 right-0 h-0.5 border-t border-dashed border-emerald-400/40 z-0">
              <span className="text-[9px] font-mono font-bold text-emerald-400/70 ml-3">
                Óvalo Auroral Boreal (~65° - 75° N)
              </span>
            </div>

            {/* Antarctic Oval Indicator Line */}
            <div className="absolute bottom-[16%] left-0 right-0 h-0.5 border-t border-dashed border-violet-400/40 z-0">
              <span className="text-[9px] font-mono font-bold text-violet-400/70 ml-3">
                Óvalo Auroral Austral (~60° - 75° S)
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
                  title={`${spot.name} (${spot.country}) - ${spot.frequencyLabel}`}
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border shadow-lg ${
                        isBoreal
                          ? 'bg-emerald-400 border-white shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse'
                          : 'bg-violet-400 border-white shadow-[0_0_12px_rgba(167,139,250,0.9)] animate-pulse'
                      }`}
                    />
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 pointer-events-none whitespace-nowrap bg-black/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/20 shadow-xl backdrop-blur-md">
                      <span className={isBoreal ? 'text-emerald-300' : 'text-violet-300'}>
                        {isBoreal ? '● Boreal: ' : '● Austral: '}
                      </span>
                      {spot.name}
                    </div>
                  </div>
                </button>
              );
            })}
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

          return (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#130B22] to-[#0A0614] border border-emerald-500/30 hover:border-emerald-400/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Luminous, colourful high-contrast image container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#130B22] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-md ${
                        isBoreal
                          ? 'bg-emerald-500/80 text-black border-emerald-300'
                          : 'bg-violet-500/80 text-white border-violet-300'
                      }`}
                    >
                      {isBoreal ? '🌌 Aurora Boreal' : '✨ Aurora Austral'}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-mono font-bold border border-white/20 backdrop-blur-md">
                      {spot.bortle.split(' - ')[0]}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-extrabold flex items-center gap-1 drop-shadow-md">
                      <span className="material-symbols-outlined text-sm text-emerald-400">location_on</span>
                      {spot.country}
                    </span>
                    {distance !== null && (
                      <span className="text-[11px] font-mono text-emerald-300 font-bold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {distance.toLocaleString()} km
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 font-['JetBrains_Mono'] block mb-0.5">
                      {spot.region} • {spot.frequencyLabel}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors font-['Plus_Jakarta_Sans'] leading-tight">
                      {spot.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#e1e3e4]/80 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-emerald-400">calendar_month</span>
                      <span className="truncate">{spot.bestSeason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-emerald-400">explore</span>
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
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/20 hover:border-emerald-300 shadow-md cursor-pointer"
                >
                  <span>Ver Ficha y Consejos</span>
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
          <h4 className="text-lg font-black text-white">No se encontraron lugares de auroras con estos filtros</h4>
          <p className="text-xs text-white/70">
            Intenta cambiar el término de búsqueda o selecciona "Todos los hemisferios" y "Todas las frecuencias".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedHemisphere('todos');
              setSelectedCategory('todos');
              setSelectedCountry('todos');
            }}
            className="px-4 py-2 bg-emerald-500 text-black font-black text-xs uppercase rounded-xl cursor-pointer"
          >
            Restablecer Filtros
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
            className="relative w-full max-w-2xl bg-[#090414] text-white rounded-3xl border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.35)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full shrink-0 bg-slate-900 overflow-hidden">
              <img
                src={selectedSpot.imageUrl}
                alt={selectedSpot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090414] via-transparent to-black/50" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/30 backdrop-blur-md"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {/* Badges on modal image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border ${
                    selectedSpot.hemisphere === 'norte'
                      ? 'bg-emerald-500 text-black border-emerald-300'
                      : 'bg-violet-500 text-white border-violet-300'
                  }`}
                >
                  {selectedSpot.hemisphere === 'norte' ? '🌌 Aurora Boreal' : '✨ Aurora Austral'}
                </span>

                <span className="px-3 py-1 rounded-full bg-black/70 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/40 backdrop-blur-md">
                  {selectedSpot.frequencyLabel}
                </span>
              </div>

              {/* Spot Title on image */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs font-mono font-bold text-emerald-300 block">
                  {selectedSpot.region}, {selectedSpot.country}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans'] leading-tight drop-shadow-md">
                  {selectedSpot.name}
                </h2>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Description */}
              <p className="text-sm text-[#e1e3e4] leading-relaxed">
                {selectedSpot.description}
              </p>

              {/* Info Matrix Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-emerald-400/30 font-medium">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">
                    Temporada Óptima de Oscuridad
                  </span>
                  <span className="text-white font-bold">{selectedSpot.bestSeason}</span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">
                    Orientación Recomendada
                  </span>
                  <span className="text-white font-bold">{selectedSpot.orientation}</span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">
                    Contaminación Lumínica
                  </span>
                  <span className="text-white font-bold">{selectedSpot.bortle}</span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">
                    Coordenadas Geográficas
                  </span>
                  <span className="text-white font-mono font-bold">
                    {selectedSpot.latitude.toFixed(4)}°, {selectedSpot.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 font-['JetBrains_Mono']">
                  Puntos Destacados & Observación:
                </h4>
                <ul className="space-y-1.5">
                  {selectedSpot.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-emerald-400 shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accessibility / Night Notes */}
              <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-white/90 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 font-['JetBrains_Mono'] block">
                  Accesibilidad & Consejos de Seguridad Nocturna:
                </span>
                <p className="leading-relaxed">{selectedSpot.accessibility}</p>
              </div>

              {/* Official Tourism Source */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-white/60 block">Fuente Oficial Verificada:</span>
                  <span className="text-emerald-300 font-bold">{selectedSpot.officialSource}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedSpot.latitude},${selectedSpot.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all border border-white/20"
                  >
                    <span className="material-symbols-outlined text-sm text-emerald-400">map</span>
                    <span>Abrir en Google Maps</span>
                  </a>

                  <a
                    href={selectedSpot.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Guía Oficial</span>
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
