import React, { useState } from 'react';
import { STARLIGHT_SPOTS } from '../data/stellaData';
import { StarlightSpot } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SpotsViewProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const SpotsView: React.FC<SpotsViewProps> = () => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'name' | 'coords' | 'nearby'>('name');
  const [mapMode, setMapMode] = useState<'certified' | 'free_location'>('certified');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedSpot, setSelectedSpot] = useState<StarlightSpot | null>(null);

  // Free Location Map state (Extra Coordenadas)
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number }>({ lat: 40.22, lng: -0.35 });
  const [customBortle, setCustomBortle] = useState<number>(2);
  const [customSQM, setCustomSQM] = useState<number>(21.75);

  // User Geolocation state for Nearby Places
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('Haz clic en el botón para detectar tu ubicación GPS');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Get list of unique countries in dataset
  const availableCountries = ['todos', ...Array.from(new Set(STARLIGHT_SPOTS.map((s) => s.country || 'España')))];

  // Filter spots dynamically by name, region, country, description, facilities, and filters
  const filteredSpots = STARLIGHT_SPOTS.filter((spot) => {
    // Country Filter
    if (selectedCountry !== 'todos') {
      const spotCountry = spot.country || 'España';
      if (spotCountry.toLowerCase() !== selectedCountry.toLowerCase()) return false;
    }

    // Type Filter (Certified vs Optimal Free)
    if (selectedType === 'certified' && !spot.certified) return false;
    if (selectedType === 'optimal_free' && spot.certified) return false;

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      spot.name.toLowerCase().includes(q) ||
      spot.region.toLowerCase().includes(q) ||
      (spot.country && spot.country.toLowerCase().includes(q)) ||
      spot.description.toLowerCase().includes(q) ||
      spot.facilities.some((f) => f.toLowerCase().includes(q))
    );
  });

  // Compute distance in km
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    setGeoStatus('Obteniendo coordenadas GPS en tiempo real...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setGeoStatus(`Ubicación detectada con éxito: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
          setIsLocating(false);
        },
        (error) => {
          console.warn('Geolocation error or denied, using default:', error);
          const defaultLat = 39.9864;
          const defaultLng = -0.0513;
          setUserCoords({ lat: defaultLat, lng: defaultLng });
          setGeoStatus('Ubicación predeterminada (Castellón Centro) cargada.');
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setUserCoords({ lat: 39.9864, lng: -0.0513 });
      setGeoStatus('Navegador no soporta GPS. Usando posición predeterminada.');
      setIsLocating(false);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = x / rect.width;
    const normY = y / rect.height;

    const newLat = parseFloat((43 - normY * 7).toFixed(4));
    const newLng = parseFloat((-9 + normX * 12).toFixed(4));

    const estimatedBortle = Math.max(1, Math.min(8, Math.floor(Math.random() * 4) + 2));
    const estimatedSQM = parseFloat((22.0 - estimatedBortle * 0.45).toFixed(2));

    setCustomCoords({ lat: newLat, lng: newLng });
    setCustomBortle(estimatedBortle);
    setCustomSQM(estimatedSQM);
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10 pb-28 md:pb-16">
      {/* Header */}
      <header className="py-4 md:py-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">map</span>
          {t('spotsTitle', 'Buscar Localización y Miradores Astronómicos')}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('spotsTitle', 'Buscar Localización y Miradores')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t('spotsSubtitle', 'Explora destinos certificados Starlight y otros rincones óptimos para observar el cielo nocturno sin contaminación lumínica.')}
        </p>
      </header>

      {/* PROMINENT SEARCH & FILTER CONTAINER */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[#FFD700]/40 bg-gradient-to-r from-[#2D1B4E] via-[#241542] to-[#1e1335] shadow-2xl mb-8 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#FFD700]">
            <span className="material-symbols-outlined text-2xl">search</span>
            <h2 className="text-base sm:text-lg font-extrabold font-['Plus_Jakarta_Sans']">
              Buscador Global de Localizaciones Estelares
            </h2>
          </div>
          <span className="text-[10px] sm:text-xs bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full font-bold border border-[#FFD700]/30 uppercase tracking-wider font-['JetBrains_Mono']">
            {filteredSpots.length} / {STARLIGHT_SPOTS.length} Lugares
          </span>
        </div>

        {/* Input Name Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700] text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeSubTab !== 'name') setActiveSubTab('name');
            }}
            placeholder={t('searchPlaceholder', 'Buscar municipio, mirador, parque natural o provincia...')}
            className="w-full bg-black/40 text-white placeholder-white/40 pl-11 pr-10 py-3 rounded-2xl border border-white/20 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 text-sm sm:text-base font-['Plus_Jakarta_Sans'] transition-all shadow-inner"
            id="input-search-location-name"
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

        {/* Country & Type Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Country Selector */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs text-[#FFD700] font-bold shrink-0 font-['JetBrains_Mono']">
              {t('countryFilter', 'País:')}
            </span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-black/60 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-[#FFD700] flex-1 cursor-pointer"
            >
              <option value="todos">{t('allCountries', 'Todos los Países')}</option>
              {availableCountries.filter((c) => c !== 'todos').map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Certification Type Selector */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs text-[#FFD700] font-bold shrink-0 font-['JetBrains_Mono']">
              {t('typeFilter', 'Tipo:')}
            </span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-black/60 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-[#FFD700] flex-1 cursor-pointer"
            >
              <option value="todos">{t('allTypes', 'Todos los Lugares (Certificados + Libres)')}</option>
              <option value="certified">{t('certifiedOnly', 'Certificados Starlight ⭐')}</option>
              <option value="optimal_free">{t('optimalFree', 'Óptimos No Certificados (Puntos Libres) 🌄')}</option>
            </select>
          </div>
        </div>

        {/* Modalidad Buttons: Certificados vs Localización Libre */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setSelectedType('certified');
              setActiveSubTab('name');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedType === 'certified'
                ? 'bg-[#FFD700]/20 border-[#FFD700] text-white shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center text-xl shrink-0">
              ⭐
            </div>
            <div>
              <span className="block text-xs font-extrabold uppercase text-[#FFD700] tracking-wider font-['JetBrains_Mono']">
                Modalidad 1
              </span>
              <span className="block text-sm font-bold font-['Plus_Jakarta_Sans']">
                {t('modality1Title', 'Zonas Certificadas Starlight')}
              </span>
              <span className="block text-[11px] text-white/60">
                {t('modality1Desc', 'Reservas y Destinos de la Fundación Starlight')}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedType('optimal_free');
              setActiveSubTab('name');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedType === 'optimal_free'
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              🌄
            </div>
            <div>
              <span className="block text-xs font-extrabold uppercase text-emerald-400 tracking-wider font-['JetBrains_Mono']">
                Modalidad 2
              </span>
              <span className="block text-sm font-bold font-['Plus_Jakarta_Sans']">
                {t('modality2Title', 'Localización Libre (Puntos Accesibles)')}
              </span>
              <span className="block text-[11px] text-white/60">
                {t('modality2Desc', 'Ermitas, Castillos, Playas y Miradores de Montaña')}
              </span>
            </div>
          </button>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-white/60 text-[11px] font-semibold">{t('quickSearch', 'Búsqueda rápida:')}</span>
          {['Peñíscola', 'Castillo Papa Luna', 'Sierra de Irta', 'Ermita Sant Antoni', 'Playa Norte', 'Penyagolosa', 'Culla', 'Javalambre', 'La Palma', 'Atacama'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                setSelectedCountry('todos');
                setSelectedType('todos');
                setActiveSubTab('name');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                searchQuery.toLowerCase().includes(tag.toLowerCase())
                  ? 'bg-[#FEE685] text-black border-[#FEE685] font-extrabold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
              }`}
            >
              🔍 {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap border-b border-white/12 mb-8 gap-4">
        <button
          onClick={() => setActiveSubTab('name')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'name' ? 'text-[#FFD700]' : 'text-white/60 hover:text-white'
          }`}
          id="tab-spots-name"
        >
          <span className="material-symbols-outlined text-2xl">search</span>
          {t('spotsTitle', 'Buscar Localización')} ({filteredSpots.length})
          {activeSubTab === 'name' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('coords')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'coords' ? 'text-[#FFD700]' : 'text-white/60 hover:text-white'
          }`}
          id="tab-spots-coords"
        >
          <span className="material-symbols-outlined text-2xl">public</span>
          {t('searchByCoords', 'Mapa y Coordenadas Libres')}
          {activeSubTab === 'coords' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('nearby')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'nearby' ? 'text-[#FFD700]' : 'text-white/60 hover:text-white'
          }`}
          id="tab-spots-nearby"
        >
          <span className="material-symbols-outlined text-2xl">near_me</span>
          {t('nearbyGPS', 'Miradores Cercanos (GPS)')}
          {activeSubTab === 'nearby' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>
      </div>

      {/* SUB-TAB 1: BUSCAR Y VER TODOS LOS LUGARES */}
      {activeSubTab === 'name' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>
              Mostrando {filteredSpots.length} de {STARLIGHT_SPOTS.length} miradores astronómicos y puntos libres.
            </span>
            {(searchQuery || selectedCountry !== 'todos' || selectedType !== 'todos') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('todos');
                  setSelectedType('todos');
                }}
                className="text-[#FFD700] hover:underline font-bold cursor-pointer"
              >
                Restablecer Filtros
              </button>
            )}
          </div>

          {filteredSpots.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center border border-white/10 space-y-3">
              <span className="material-symbols-outlined text-4xl text-white/40">search_off</span>
              <h3 className="text-lg font-bold text-white">No se encontró ningún lugar con los criterios seleccionados</h3>
              <p className="text-xs text-white/60">Prueba cambiando el país, seleccionando "Todos los Tipos" o limpiando el texto de búsqueda.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('todos');
                  setSelectedType('todos');
                }}
                className="px-4 py-2 bg-[#FEE685] text-black font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Ver Todos los Lugares
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className="card-pastel-gold card-pastel-gold-hover rounded-3xl overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 md:h-56 relative overflow-hidden">
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {spot.certified ? (
                          <span className="bg-[#24153F] text-[#FEE685] text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md border border-[#FEE685]/40">
                            ⭐ Certificado Starlight
                          </span>
                        ) : (
                          <span className="bg-[#0D5C35] text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            🌄 Lugar Óptimo (Punto Libre)
                          </span>
                        )}

                        <span className="bg-black/80 backdrop-blur-md text-[#FEE685] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded-full font-bold border border-[#FEE685]/40">
                          Bortle {spot.bortleClass}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                          🌍 {spot.country || 'España'}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xs text-[#FEE685] font-extrabold uppercase tracking-wider drop-shadow">
                          {spot.region}
                        </span>
                        <h3 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans'] drop-shadow">
                          {spot.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-[#2B2538] font-medium leading-relaxed mb-4 line-clamp-3">
                        {spot.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono'] mb-4 p-3.5 rounded-2xl bg-white/70 border border-[#E6CA65]">
                        <div>
                          <span className="text-[#594A70] block font-bold">Altitud:</span>
                          <span className="text-[#120D1C] font-extrabold">{spot.elevationMeters}m snm</span>
                        </div>
                        <div>
                          <span className="text-[#594A70] block font-bold">Calidad Cielo (SQM):</span>
                          <span className="text-[#120D1C] font-extrabold">{spot.sqm} mag/arcsec²</span>
                        </div>
                      </div>

                      {spot.subAreas && spot.subAreas.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[11px] font-extrabold text-[#24153F] uppercase block mb-1.5 font-['JetBrains_Mono']">
                            📍 Zonas y Puntos de Interés:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {spot.subAreas.map((area, idx) => (
                              <span key={idx} className="text-[10px] bg-[#E8D48A] text-[#120D1C] px-2.5 py-1 rounded-lg border border-[#D5BE6E] font-bold">
                                📍 {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {spot.facilities.map((fac, idx) => (
                          <span key={idx} className="text-[11px] bg-white/60 text-[#120D1C] font-semibold px-2.5 py-1 rounded-md border border-[#E6CA65]">
                            • {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpot(spot);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#FEE685]/30 cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">map</span>
                      {t('viewDetails', 'Ver Ficha Completa y Ruta')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MAPA TERRÁQUEO */}
      {activeSubTab === 'coords' && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit">
            <button
              onClick={() => setMapMode('certified')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                mapMode === 'certified'
                  ? 'bg-[#FEE685] text-black shadow-lg shadow-[#FEE685]/20'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">verified</span>
              Todos los Lugares Registrados ({filteredSpots.length})
            </button>

            <button
              onClick={() => setMapMode('free_location')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                mapMode === 'free_location'
                  ? 'bg-[#FEE685] text-black shadow-lg shadow-[#FEE685]/20'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">ads_click</span>
              Analizar Coordenadas Libres en Mapa
            </button>
          </div>

          {mapMode === 'certified' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className="glass-panel rounded-2xl overflow-hidden border border-white/12 hover:border-[#FFD700]/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 md:h-56 relative overflow-hidden">
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B4E] via-transparent to-black/30" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {spot.certified ? (
                          <span className="bg-[#FFD700] text-black text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase">
                            ⭐ Starlight
                          </span>
                        ) : (
                          <span className="bg-emerald-500 text-black text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase">
                            🌄 Libre Óptimo
                          </span>
                        )}
                        <span className="bg-black/70 backdrop-blur-md text-[#FFD700] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded-full font-bold">
                          Bortle {spot.bortleClass}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xs text-[#FFD700] font-bold uppercase tracking-wider">
                          {spot.region} • {spot.country || 'España'}
                        </span>
                        <h3 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                          {spot.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-[#e1e3e4]/80 leading-relaxed mb-4 line-clamp-2">
                        {spot.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono'] mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <span className="text-white/50 block">Coordenadas:</span>
                          <span className="text-white font-bold">{spot.latitude.toFixed(2)}°, {spot.longitude.toFixed(2)}°</span>
                        </div>
                        <div>
                          <span className="text-white/50 block">Elevación:</span>
                          <span className="text-white font-bold">{spot.elevationMeters}m snm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpot(spot);
                      }}
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#FEE685] hover:text-black text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/15"
                    >
                      <span className="material-symbols-outlined text-base">map</span>
                      Ficha y Navegación GPS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mapMode === 'free_location' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/15">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                      Mapa Terráqueo Interactivo de Contaminación Lumínica
                    </h3>
                    <p className="text-xs text-white/70">
                      Haz clic en cualquier punto del mapa para analizar coordenadas y calidad de cielo libre.
                    </p>
                  </div>
                  <span className="text-xs font-['JetBrains_Mono'] px-3 py-1 rounded-full bg-[#FEE685]/20 text-[#FEE685] border border-[#FEE685]/30 font-extrabold">
                    Modo Libre Ubicación
                  </span>
                </div>

                <div
                  onClick={handleMapClick}
                  className="relative w-full h-96 rounded-2xl overflow-hidden border border-white/20 bg-slate-900 cursor-crosshair group shadow-inner flex items-center justify-center"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(124, 77, 255, 0.15) 0%, rgba(18, 11, 46, 0.95) 100%), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

                  <div className="relative z-10 flex flex-col items-center animate-bounce">
                    <div className="px-3 py-1 rounded-lg bg-[#FEE685] text-black font-['JetBrains_Mono'] font-extrabold text-xs shadow-xl border border-white">
                      📍 Lat: {customCoords.lat}°, Lng: {customCoords.lng}°
                    </div>
                    <span className="material-symbols-outlined text-4xl text-[#FEE685] drop-shadow-[0_0_10px_#FEE685]">
                      location_on
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-white/80">
                      👉 <strong>Haz clic en cualquier punto</strong> del mapa para mover la aguja y medir la oscuridad.
                    </span>
                    <span className="text-[#FEE685] font-['JetBrains_Mono'] font-extrabold">
                      Bortle Estimado: Clase {customBortle} | SQM: {customSQM}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-white/50 font-['JetBrains_Mono'] uppercase block">
                      Coordenadas Seleccionadas
                    </span>
                    <span className="text-lg font-bold text-white font-['JetBrains_Mono']">
                      {customCoords.lat}° N, {customCoords.lng}° E
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-white/50 font-['JetBrains_Mono'] uppercase block">
                      Clase de Oscuridad
                    </span>
                    <span className="text-lg font-bold text-[#FEE685] font-['JetBrains_Mono']">
                      Bortle Clase {customBortle} ({customSQM} mag)
                    </span>
                  </div>

                  <div className="flex items-center">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${customCoords.lat},${customCoords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-[#FEE685] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">directions</span>
                      Abrir Navegación GPS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PROXIMIDAD POR GPS */}
      {activeSubTab === 'nearby' && (
        <div className="space-y-8">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-[#FEE685]/30 bg-gradient-to-r from-[#2D1B4E] to-[#1a102f]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FEE685]/20 text-[#FEE685] border border-[#FEE685]/40 text-xs font-extrabold uppercase tracking-wider mb-2 inline-block font-['JetBrains_Mono']">
                  Detección GPS en Tiempo Real
                </span>
                <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] mb-1">
                  Encuentra los Sitios Más Cercanos a Ti Ahora
                </h3>
                <p className="text-sm text-white/80">
                  {geoStatus}
                </p>
              </div>

              <button
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="px-6 py-3.5 rounded-xl bg-[#FEE685] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2.5 shadow-xl shadow-[#FEE685]/30 shrink-0 cursor-pointer"
                id="btn-gps-detect"
              >
                <span className="material-symbols-outlined text-xl">
                  {isLocating ? 'sync' : 'my_location'}
                </span>
                {isLocating ? 'Detectando GPS...' : 'Detectar mi Ubicación Actual'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-['Plus_Jakarta_Sans']">
              Todos los Miradores Ordenados por Proximidad ({filteredSpots.length})
            </h3>

            <div className="space-y-4">
              {filteredSpots.map((spot) => {
                const lat = userCoords ? userCoords.lat : 39.9864;
                const lng = userCoords ? userCoords.lng : -0.0513;
                const distanceKm = calculateDistanceKm(lat, lng, spot.latitude, spot.longitude);

                return (
                  <div
                    key={spot.id}
                    className="card-pastel-gold card-pastel-gold-hover rounded-3xl p-6 shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-[#E6CA65] shrink-0 shadow-md"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#24153F] text-[#FEE685] text-[10px] font-extrabold font-['JetBrains_Mono'] uppercase">
                            A {distanceKm} km de ti
                          </span>
                          {spot.certified ? (
                            <span className="text-[10px] bg-[#E8D48A] text-[#120D1C] border border-[#D5BE6E] px-2 py-0.5 rounded-lg font-extrabold">
                              ⭐ Starlight
                            </span>
                          ) : (
                            <span className="text-[10px] bg-[#D1F2D9] text-[#0D5C35] border border-[#A2E2B4] px-2 py-0.5 rounded-lg font-extrabold">
                              🌄 Punto Libre
                            </span>
                          )}
                          <span className="text-xs text-[#594A70] font-['JetBrains_Mono'] font-bold">
                            Bortle {spot.bortleClass}
                          </span>
                        </div>

                        <h4 className="text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">
                          {spot.name}
                        </h4>

                        <p className="text-xs text-[#2B2538] font-medium line-clamp-1 mt-0.5">
                          {spot.region} • {spot.country || 'España'} • Altitud: {spot.elevationMeters}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span className="material-symbols-outlined text-base">near_me</span>
                        {t('getDirections', 'Cómo Llegar')} ({distanceKm} km)
                      </a>

                      <button
                        onClick={() => setSelectedSpot(spot)}
                        className="px-4 py-3 rounded-2xl bg-white/70 hover:bg-white text-[#120D1C] font-bold text-xs transition-all border border-[#E6CA65] cursor-pointer shadow-sm"
                      >
                        Ficha
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Spot Detail Modal in Luxury Pastel Yellow with Black Letters */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="card-pastel-gold w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-[#D4AF37]">
            <div className="flex items-center justify-between border-b border-[#E6CA65] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#24153F] font-extrabold uppercase tracking-wider">
                    {selectedSpot.region} ({selectedSpot.country || 'España'})
                  </span>
                  {selectedSpot.certified ? (
                    <span className="px-2.5 py-0.5 bg-[#24153F] text-[#FEE685] font-extrabold text-[9px] rounded-full uppercase">
                      ⭐ Certificado Starlight
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-[#0D5C35] text-white font-extrabold text-[9px] rounded-full uppercase">
                      🌄 Punto Libre Óptimo
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">{selectedSpot.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSpot(null)}
                className="text-[#120D1C]/70 hover:text-black p-2 rounded-full hover:bg-black/10 cursor-pointer"
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="h-56 rounded-2xl overflow-hidden relative border border-[#E6CA65] shadow-md">
                <img src={selectedSpot.imageUrl} alt={selectedSpot.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="bg-[#24153F] text-[#FEE685] text-xs font-extrabold px-3 py-1 rounded-full font-['JetBrains_Mono']">
                    Bortle Clase {selectedSpot.bortleClass}
                  </span>
                  <span className="bg-black/80 text-white backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full font-['JetBrains_Mono']">
                    SQM: {selectedSpot.sqm} mag/arcsec²
                  </span>
                </div>
              </div>

              <p className="text-base text-[#120D1C] font-medium leading-relaxed">
                {selectedSpot.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/70 border border-[#E6CA65] text-xs">
                <div>
                  <span className="text-[#594A70] block uppercase font-['JetBrains_Mono'] font-bold">Elevación:</span>
                  <span className="text-[#120D1C] font-extrabold text-sm">{selectedSpot.elevationMeters}m</span>
                </div>
                <div>
                  <span className="text-[#594A70] block uppercase font-['JetBrains_Mono'] font-bold">Mejor Época:</span>
                  <span className="text-[#120D1C] font-extrabold text-sm">{selectedSpot.bestSeason}</span>
                </div>
                <div>
                  <span className="text-[#594A70] block uppercase font-['JetBrains_Mono'] font-bold">Coordenadas:</span>
                  <span className="text-[#120D1C] font-extrabold text-sm font-['JetBrains_Mono']">{selectedSpot.latitude}, {selectedSpot.longitude}</span>
                </div>
              </div>

              {selectedSpot.subAreas && selectedSpot.subAreas.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-[#24153F] text-sm uppercase tracking-wider mb-2">Puntos de Interés y Accesos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpot.subAreas.map((area, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-[#E8D48A] text-[#120D1C] text-xs font-bold border border-[#D5BE6E] flex items-center gap-1 shadow-sm">
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-extrabold text-[#24153F] text-sm uppercase tracking-wider mb-2">Servicios en el Punto:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpot.facilities.map((fac, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-white/70 text-[#120D1C] text-xs font-semibold border border-[#E6CA65]">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6CA65] flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedSpot.latitude},${selectedSpot.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 rounded-2xl bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">near_me</span>
                  Abrir Ruta en Google Maps
                </a>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="px-6 py-3.5 rounded-2xl bg-white/80 text-[#120D1C] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer border border-[#E6CA65]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

