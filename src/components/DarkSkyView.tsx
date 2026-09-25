import React, { useState } from 'react';
import { DARKSKY_ZONES, DarkSkyZone } from '../data/darkSkyData';
import { useLanguage } from '../context/LanguageContext';

interface DarkSkyViewProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const DarkSkyView: React.FC<DarkSkyViewProps> = ({ onGoBack, onGoHome }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('todos');
  const [selectedCountry, setSelectedCountry] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedZone, setSelectedZone] = useState<DarkSkyZone | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Geolocation & Distance Calculation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // Haversine formula to compute distance in km
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
          // Default to central Spain (Madrid) for testing
          setUserCoords({ lat: 40.4168, lng: -3.7038 });
          setSortByDistance(true);
          setGeoMessage('Ubicación aproximada establecida. Lugares ordenados por distancia.');
          setIsLocating(false);
          setTimeout(() => setGeoMessage(null), 4000);
        },
        { timeout: 7000 }
      );
    } else {
      setGeoMessage('Tu navegador no soporta geolocalización.');
      setIsLocating(false);
    }
  };

  // Continents list
  const continents: Array<{ id: string; label: string; icon: string }> = [
    { id: 'todos', label: 'Todo el Mundo', icon: 'public' },
    { id: 'Europa', label: 'Europa', icon: 'euro' },
    { id: 'América del Norte', label: 'N. América', icon: 'travel_explore' },
    { id: 'América del Sur', label: 'S. América', icon: 'south_america' },
    { id: 'África', label: 'África', icon: 'landscape' },
    { id: 'Asia', label: 'Asia & O. Medio', icon: 'temple_buddhist' },
    { id: 'Oceanía', label: 'Oceanía', icon: 'water' },
  ];

  // Extract unique countries
  const countries = ['todos', ...Array.from(new Set(DARKSKY_ZONES.map((z) => z.country)))];

  // Filter zones
  let filteredZones = DARKSKY_ZONES.filter((zone) => {
    if (selectedContinent !== 'todos' && zone.continent !== selectedContinent) {
      return false;
    }
    if (selectedCountry !== 'todos' && !zone.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'todos' && zone.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      zone.name.toLowerCase().includes(q) ||
      zone.region.toLowerCase().includes(q) ||
      zone.country.toLowerCase().includes(q) ||
      zone.continent.toLowerCase().includes(q) ||
      zone.categoryLabel.toLowerCase().includes(q) ||
      zone.description.toLowerCase().includes(q) ||
      zone.highlights.some((h) => h.toLowerCase().includes(q))
    );
  });

  // Sort by distance if enabled
  if (sortByDistance && userCoords) {
    filteredZones = [...filteredZones].sort((a, b) => {
      const distA = calculateDistanceKm(userCoords.lat, userCoords.lng, a.latitude, a.longitude);
      const distB = calculateDistanceKm(userCoords.lat, userCoords.lng, b.latitude, b.longitude);
      return distA - distB;
    });
  }

  // Convert lat/lng to approximate percentage coordinates for interactive world map projection
  // Web Mercator / Equirectangular bounding: Longitude [-180, 180] -> [0%, 100%], Latitude [75, -60] -> [0%, 100%]
  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    // Latitude clamped from 75°N to -60°S
    const clampedLat = Math.max(-60, Math.min(75, lat));
    const y = ((75 - clampedLat) / 135) * 100;
    return { left: `${Math.max(4, Math.min(96, x))}%`, top: `${Math.max(6, Math.min(94, y))}%` };
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10 pb-28 md:pb-16 animate-fadeIn">
      {/* Header */}
      <header className="py-4 md:py-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <span className="material-symbols-outlined text-sm">public</span>
          <span>DarkSky International (IDA) • Catálogo Mundial</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          Zonas & Lugares DarkSky en el Mundo
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          Localiza y explora santuarios, parques y reservas de cielo oscuro certificados en cualquier continente por DarkSky International (antigua IDA), con mapas de coordenadas, valores fotométricos SQM y guías de observación.
        </p>
      </header>

      {/* Info & Educational Banner */}
      <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-[#170E28]/85 to-blue-950/70 border border-cyan-400/35 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0 text-2xl shadow-md">
            🌌
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-cyan-200 font-['Plus_Jakarta_Sans']">
              ¿Qué certifica DarkSky International (IDA)?
            </h3>
            <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
              Territorios protegidos donde rige oscuridad absoluta (Bortle 1-3), auditorías científicas anuales y protección del cielo nocturno como patrimonio natural de la humanidad.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          {/* Geolocation Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md w-full sm:w-auto ${
              sortByDistance
                ? 'bg-emerald-500 text-black border border-emerald-400'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'
            }`}
            title="Calcular distancias desde tu posición GPS actual"
          >
            <span className="material-symbols-outlined text-sm">
              {isLocating ? 'sync' : 'near_me'}
            </span>
            <span>{isLocating ? 'Localizando...' : sortByDistance ? 'Ordenado por GPS' : 'Cercanos a Mí'}</span>
          </button>

          <a
            href="https://darksky.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 text-xs font-bold transition-all shrink-0 flex items-center gap-1"
          >
            <span>IDA Oficial</span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
        </div>
      </div>

      {geoMessage && (
        <div className="mb-4 px-4 py-2.5 rounded-2xl bg-cyan-900/60 border border-cyan-400/50 text-cyan-200 text-xs font-bold animate-fadeIn flex items-center gap-2 shadow-lg">
          <span className="material-symbols-outlined text-sm">info</span>
          <span>{geoMessage}</span>
        </div>
      )}

      {/* Continents Filter Bar */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {continents.map((cont) => {
          const count = cont.id === 'todos'
            ? DARKSKY_ZONES.length
            : DARKSKY_ZONES.filter((z) => z.continent === cont.id).length;
          const isSelected = selectedContinent === cont.id;
          return (
            <button
              key={cont.id}
              onClick={() => {
                setSelectedContinent(cont.id);
                setSelectedCountry('todos');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cont.icon}</span>
              <span>{cont.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-white/60'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Container */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-cyan-400/30 bg-[#160E26]/90 shadow-2xl mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="material-symbols-outlined text-2xl">travel_explore</span>
            <h2 className="text-base sm:text-lg font-extrabold font-['Plus_Jakarta_Sans']">
              Localizador Mundial de Sitios DarkSky
            </h2>
          </div>

          {/* Toggle View: Grid vs Interactive World Map */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/50 border border-white/15">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span>Fichas ({filteredZones.length})</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Mapa Mundial</span>
            </button>
          </div>
        </div>

        {/* Input Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, país, continente, parque o santuario (ej. Aiguamolls, Atacama, Grand Canyon, Aoraki, Namib)..."
            className="w-full bg-black/40 text-white placeholder-white/40 pl-11 pr-10 py-3 rounded-2xl border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm sm:text-base font-['Plus_Jakarta_Sans'] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Country & Category Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Country Selector */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs text-cyan-300 font-bold shrink-0 font-['JetBrains_Mono']">
              País:
            </span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-black/60 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-cyan-400 flex-1 cursor-pointer"
            >
              <option value="todos">Todos los Países del Mundo ({countries.length - 1})</option>
              {countries.filter((c) => c !== 'todos').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs text-cyan-300 font-bold shrink-0 font-['JetBrains_Mono']">
              Categoría DarkSky:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/60 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-cyan-400 flex-1 cursor-pointer"
            >
              <option value="todos">Todas las Categorías Oficiales</option>
              <option value="International Dark Sky Sanctuary">Santuarios Internacionales (Máxima Pureza Bortle 1)</option>
              <option value="International Dark Sky Reserve">Reservas Internacionales</option>
              <option value="International Dark Sky Park">Parques Internacionales</option>
              <option value="Dark Sky Community">Comunidades de Cielo Oscuro</option>
            </select>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-white/60 text-[11px] font-semibold">Enclaves Legendarios:</span>
          {['Aiguamolls', 'Atacama', 'Grand Canyon', 'Alqueva', 'Pic du Midi', 'Aoraki', 'Death Valley', 'NamibRand'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  setSelectedContinent('todos');
                  setSelectedCountry('todos');
                  setSelectedCategory('todos');
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                  searchQuery.toLowerCase().includes(tag.toLowerCase())
                    ? 'bg-cyan-400 text-black border-cyan-400 font-extrabold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                }`}
              >
                🌌 {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* INTERACTIVE WORLD MAP VIEW */}
      {viewMode === 'map' && (
        <div className="mb-8 p-4 sm:p-6 rounded-3xl bg-[#120B22]/95 border-2 border-cyan-400/40 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                <span className="material-symbols-outlined text-cyan-300">public</span>
                Mapa de Coordenadas de Cielos Oscuros Mundiales
              </h3>
              <p className="text-xs text-cyan-200/80">
                Pasa el cursor o haz clic en cualquier enclave para consultar coordenadas, país y ficha oficial.
              </p>
            </div>
            <span className="text-xs font-['JetBrains_Mono'] px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold self-start">
              {filteredZones.length} Localizaciones en el Mapa
            </span>
          </div>

          {/* Interactive World Map Canvas Container */}
          <div
            className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden border border-cyan-400/30 shadow-inner group"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, rgba(14, 116, 144, 0.25) 0%, rgba(10, 6, 26, 0.98) 100%), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Ambient grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#38bdf815_1px,transparent_1px),linear-gradient(to_bottom,#38bdf815_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Equator & Prime Meridian reference lines */}
            <div className="absolute top-[55%] left-0 right-0 h-[1px] bg-cyan-400/20 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-cyan-400/20 pointer-events-none" />

            {/* World Pins */}
            {filteredZones.map((zone) => {
              const pos = getMapPosition(zone.latitude, zone.longitude);
              const isSelected = selectedZone?.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
                >
                  {/* Pin glowing beacon */}
                  <div className="relative flex items-center justify-center">
                    <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg transition-transform group-hover/pin:scale-130 ${
                      isSelected
                        ? 'bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,1)] scale-125'
                        : 'bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse'
                    }`} />
                    <span className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-30 min-w-[160px] bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/60 shadow-2xl">
                    <span className="text-[11px] font-extrabold text-white text-center leading-tight truncate max-w-[200px]">
                      {zone.name}
                    </span>
                    <span className="text-[10px] text-cyan-300 font-bold">
                      {zone.country} • Bortle {zone.bortleClass}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-[11px]">Enclave DarkSky</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-[11px]">Enclave Seleccionado</span>
                </div>
              </div>
              <span className="text-[11px] text-cyan-200">
                Haz clic en cualquier punto para abrir su ficha completa.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of DarkSky Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          const distanceKm = userCoords
            ? calculateDistanceKm(userCoords.lat, userCoords.lng, zone.latitude, zone.longitude)
            : null;

          return (
            <div
              key={zone.id}
              className="group rounded-3xl overflow-hidden bg-[#180E2B]/85 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-xl flex flex-col justify-between hover:shadow-cyan-500/20"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={zone.imageUrl}
                    alt={zone.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180E2B] via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md shadow-sm">
                      {zone.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold backdrop-blur-md">
                      Bortle {zone.bortleClass}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {distanceKm !== null && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-[10px] font-extrabold backdrop-blur-md shadow-sm">
                        {distanceKm.toLocaleString()} km
                      </span>
                    )}
                    <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                      {zone.designationYear}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-['JetBrains_Mono']">
                    <span className="bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                      SQM: {zone.sqm.toFixed(2)} mag/arcsec²
                    </span>
                    {zone.areaKm2 && (
                      <span className="bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                        {zone.areaKm2.toLocaleString()} km²
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-cyan-300/90 font-bold mb-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>
                        {zone.region} • {zone.country} ({zone.continent})
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans'] group-hover:text-cyan-200 transition-colors leading-snug">
                      {zone.name}
                    </h3>
                  </div>

                  <p className="text-xs text-white/80 line-clamp-3 leading-relaxed">
                    {zone.description}
                  </p>

                  {/* Highlights preview */}
                  <div className="pt-1 space-y-1">
                    {zone.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#BAE6FD]">
                        <span className="text-cyan-400 font-bold shrink-0">✓</span>
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 pt-0 border-t border-white/10 mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>Ficha e Información</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${zone.latitude},${zone.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shrink-0 cursor-pointer"
                  title="Ver localización en Google Maps"
                >
                  <span className="material-symbols-outlined text-base">map</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredZones.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 max-w-xl mx-auto my-8">
          <span className="material-symbols-outlined text-5xl text-cyan-400 mb-2">travel_explore</span>
          <h3 className="text-lg font-bold text-white">No se encontraron zonas DarkSky</h3>
          <p className="text-xs text-white/60 mt-1">
            Prueba a buscar con otro término, cambia de continente o selecciona "Todo el Mundo".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedContinent('todos');
              setSelectedCountry('todos');
              setSelectedCategory('todos');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs cursor-pointer shadow-md"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED DARKSKY ZONE */}
      {selectedZone && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedZone(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#160E26] border-2 border-cyan-400/50 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/50 text-[10px] font-extrabold uppercase tracking-wider inline-block">
                    {selectedZone.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-white/80 border border-white/20 text-[10px] font-bold">
                    {selectedZone.continent} • Designado en {selectedZone.designationYear}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {selectedZone.name}
                </h2>
                <p className="text-xs text-cyan-200/90 font-bold mt-0.5">
                  {selectedZone.region} ({selectedZone.country})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedZone(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs">
              {/* Image banner */}
              <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-md">
                <img
                  src={selectedZone.imageUrl}
                  alt={selectedZone.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-['JetBrains_Mono'] text-xs">
                  <span className="bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    Bortle {selectedZone.bortleClass} (SQM: {selectedZone.sqm})
                  </span>
                  <span className="bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    📍 {selectedZone.latitude.toFixed(4)}°, {selectedZone.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider font-['JetBrains_Mono']">
                  Descripción Oficial & Valor de Conservación
                </h4>
                <p className="text-xs text-white/90 leading-relaxed">{selectedZone.description}</p>
              </div>

              {/* Key Highlights */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider font-['JetBrains_Mono']">
                  Criterios Científicos Cumplidos (DarkSky IDA)
                </h4>
                <ul className="space-y-1.5">
                  {selectedZone.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <span className="material-symbols-outlined text-sm text-cyan-400 shrink-0 mt-0.5">
                        verified
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Observing Sites */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider font-['JetBrains_Mono']">
                  Miradores y Puntos de Observación Dentro de la Zona
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedZone.keyObservingSites.map((site, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/40 border border-cyan-400/20 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-cyan-400 text-sm">visibility</span>
                      <span className="font-bold text-white/90 truncate">{site}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Season */}
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-200">Mejor Época de Observación:</span>
                <span className="font-extrabold text-white">{selectedZone.bestSeason}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
              {selectedZone.officialUrl && (
                <a
                  href={selectedZone.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Ficha DarkSky Oficial</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedZone.latitude},${selectedZone.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md ml-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                <span>Cómo Llegar (Ruta GPS Mundial)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
