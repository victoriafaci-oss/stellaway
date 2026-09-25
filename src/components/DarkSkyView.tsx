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
  const [selectedCountry, setSelectedCountry] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedZone, setSelectedZone] = useState<DarkSkyZone | null>(null);

  // Extract unique countries
  const countries = ['todos', ...Array.from(new Set(DARKSKY_ZONES.map((z) => z.country)))];

  // Filtered zones
  const filteredZones = DARKSKY_ZONES.filter((zone) => {
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
      zone.categoryLabel.toLowerCase().includes(q) ||
      zone.description.toLowerCase().includes(q) ||
      zone.highlights.some((h) => h.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10 pb-28 md:pb-16 animate-fadeIn">
      {/* Header */}
      <header className="py-4 md:py-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">public</span>
          <span>DarkSky International (IDA)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('darkSkyTitle', 'Zonas DarkSky Internacionales')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t(
            'darkSkySubtitle',
            'Información detallada sobre los santuarios, parques y reservas de cielo oscuro oficialmente reconocidos en todo el mundo por DarkSky International (anteriormente IDA) para la preservación de la noche cósmica.'
          )}
        </p>
      </header>

      {/* Info Pill / Educational Banner */}
      <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#170E28]/80 to-blue-950/60 border border-cyan-400/30 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0 text-2xl shadow-md">
          🌌
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-cyan-200 font-['Plus_Jakarta_Sans']">
            ¿Qué es una certificación DarkSky International?
          </h3>
          <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
            Son territorios donde gobiernos y comunidades implementan normativas estrictas de iluminación, auditorías fotométricas periódicas y medidas activas de conservación biológica para mantener la oscuridad natural (Bortle 1-3).
          </p>
        </div>
        <a
          href="https://darksky.org"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
        >
          <span>Web Oficial IDA</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>

      {/* Search and Filters Container */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-cyan-400/30 bg-[#160E26]/90 shadow-2xl mb-8 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="material-symbols-outlined text-2xl">travel_explore</span>
            <h2 className="text-base sm:text-lg font-extrabold font-['Plus_Jakarta_Sans']">
              Buscador de Sitios DarkSky Catalogados
            </h2>
          </div>
          <span className="text-[10px] sm:text-xs bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full font-bold border border-cyan-400/30 uppercase tracking-wider font-['JetBrains_Mono']">
            {filteredZones.length} / {DARKSKY_ZONES.length} Enclaves
          </span>
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
            placeholder="Buscar por nombre, país, santuario o región (ej. Aiguamolls, Alqueva, Atacama, Grand Canyon)..."
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
              <option value="todos">Todos los Países</option>
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
              <option value="todos">Todas las Categorías</option>
              <option value="International Dark Sky Sanctuary">Santuarios Internacionales (Máxima Pureza)</option>
              <option value="International Dark Sky Reserve">Reservas Internacionales</option>
              <option value="International Dark Sky Park">Parques Internacionales</option>
              <option value="Dark Sky Community">Comunidades de Cielo Oscuro</option>
            </select>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-white/60 text-[11px] font-semibold">Destacados:</span>
          {['Aiguamolls', 'Alqueva', 'Atacama', 'Grand Canyon', 'Pic du Midi', 'Aoraki Mackenzie', 'NamibRand'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
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

      {/* Grid of DarkSky Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => (
          <div
            key={zone.id}
            className="group rounded-3xl overflow-hidden bg-[#180E2B]/80 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-xl flex flex-col justify-between"
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

                <div className="absolute top-3 right-3">
                  <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                    {zone.designationYear}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-['JetBrains_Mono']">
                  <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    SQM: {zone.sqm.toFixed(2)} mag/arcsec²
                  </span>
                  {zone.areaKm2 && (
                    <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
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
                      {zone.region} • {zone.country}
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
                onClick={() => setSelectedZone(zone)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">info</span>
                <span>Ficha e Información Completa</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${zone.latitude},${zone.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shrink-0 cursor-pointer"
                title="Ver en Google Maps"
              >
                <span className="material-symbols-outlined text-base">map</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredZones.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 max-w-xl mx-auto my-8">
          <span className="material-symbols-outlined text-5xl text-cyan-400 mb-2">travel_explore</span>
          <h3 className="text-lg font-bold text-white">No se encontraron zonas DarkSky</h3>
          <p className="text-xs text-white/60 mt-1">
            Prueba a buscar con otro término o selecciona "Todos los Países".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCountry('todos');
              setSelectedCategory('todos');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED DARKSKY ZONE */}
      {selectedZone && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setSelectedZone(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#160E26] border-2 border-cyan-400/50 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3 shrink-0">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/50 text-[10px] font-extrabold uppercase tracking-wider inline-block mb-1">
                  {selectedZone.categoryLabel} • Designado en {selectedZone.designationYear}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {selectedZone.name}
                </h2>
                <p className="text-xs text-cyan-200/80 font-bold mt-0.5">
                  {selectedZone.region} ({selectedZone.country})
                </p>
              </div>

              <button
                onClick={() => setSelectedZone(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs">
              {/* Image banner */}
              <div className="relative h-52 rounded-2xl overflow-hidden border border-white/10 shadow-md">
                <img
                  src={selectedZone.imageUrl}
                  alt={selectedZone.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-['JetBrains_Mono'] text-xs">
                  <span className="bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    Bortle {selectedZone.bortleClass} (SQM: {selectedZone.sqm})
                  </span>
                  <span className="bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    Coords: {selectedZone.latitude.toFixed(3)}°, {selectedZone.longitude.toFixed(3)}°
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
                  Puntos Clave y Criterios Cumplidos
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
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md ml-auto"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                <span>Cómo Llegar (Ruta GPS)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
