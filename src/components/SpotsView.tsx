import React, { useState, useEffect, useRef } from 'react';
import { STARLIGHT_SPOTS } from '../data/stellaData';
import { StarlightSpot } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useOfflineStorage } from '../lib/offlineStorage';
import { getRegionImage } from '../lib/regionImages';
import {
  watchLivePosition,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsPinUrl,
  formatCoordinatesDMS,
  LiveCoordinates,
} from '../lib/locationService';
import {
  translateCountry,
  translateProvinceLabel,
  translateBortleText,
  translateRegionInfo,
  matchesMultilingualSearch,
} from '../lib/locationI18n';

interface SpotsViewProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
  onNavigateToDarkSky?: () => void;
}

export const SpotsView: React.FC<SpotsViewProps> = ({ onGoBack, onGoHome, onNavigateToDarkSky }) => {
  const { t, language } = useLanguage();
  const {
    savedSpots,
    isSpotSaved,
    toggleSaveSpot,
    saveSpot,
    removeSpot,
    stats,
  } = useOfflineStorage();
  const [activeSubTab, setActiveSubTab] = useState<'name' | 'coords' | 'nearby' | 'offline'>('name');
  const [savedBatchCount, setSavedBatchCount] = useState<number | null>(null);
  const [confirmClearBackpack, setConfirmClearBackpack] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'certified' | 'free_location'>('certified');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('todos');
  const [selectedProvince, setSelectedProvince] = useState<string>('todas');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedSpot, setSelectedSpot] = useState<StarlightSpot | null>(null);

  // Helper to normalize accents, diacritics, and lowercase
  const normalizeSearchText = (str: string): string => {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Manual exact coordinates input for direct Google Maps launch
  const [customCoords, setCustomCoords] = useState<{ lat: string; lng: string }>({ lat: '40.2241', lng: '-0.3524' });

  // User Real-Time Geolocation state
  const [userCoords, setUserCoords] = useState<LiveCoordinates | null>(null);
  const [geoStatusKey, setGeoStatusKey] = useState<'default' | 'obtaining' | 'detected' | 'denied' | 'unavailable' | 'unsupported'>('default');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const stopWatchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (stopWatchRef.current) {
        stopWatchRef.current();
      }
    };
  }, []);

  const geoStatusText = (() => {
    switch (geoStatusKey) {
      case 'obtaining':
        return t('spotsGpsObtaining');
      case 'detected':
        return userCoords
          ? `${t('spotsGpsDetectedPrefix')} ${userCoords.lat.toFixed(5)}°, ${userCoords.lng.toFixed(5)}°${
              userCoords.accuracyMeters ? ` (±${userCoords.accuracyMeters} m)` : ''
            }`
          : t('spotsGpsPromptDefault');
      case 'denied':
        return t('gpsErrDenied', 'Permiso GPS denegado. Activa la ubicación en tu navegador/móvil para obtener tus coordenadas reales.');
      case 'unavailable':
        return t('gpsErrUnavailable', 'No se pudo obtener señal GPS todavía. Comprueba la ubicación del dispositivo.');
      case 'unsupported':
        return t('spotsGpsNoSupport');
      default:
        return t('spotsGpsPromptDefault');
    }
  })();

  // Get list of unique countries in dataset
  const availableCountries = ['todos', ...Array.from(new Set(STARLIGHT_SPOTS.map((s) => s.country || 'España')))];

  // Spanish provinces / autonomous communities with certified Starlight destinations
  const spanishProvinceKeys = [
    'todas',
    'zaragoza',
    'teruel',
    'huesca',
    'castellon',
    'valencia',
    'galicia',
    'andalucia',
    'castilla-la mancha',
    'castilla y leon',
    'canarias',
    'baleares',
    'extremadura',
    'navarra',
    'la rioja',
    'cataluna',
    'pais vasco',
    'asturias',
  ];
  const spanishProvinces = spanishProvinceKeys.map((val) => ({
    value: val,
    label: translateProvinceLabel(val, language),
  }));

  // Filter spots dynamically with multi-token matching, country & province support
  const filteredSpots = STARLIGHT_SPOTS.filter((spot) => {
    // 1. Country Filter
    if (selectedCountry !== 'todos') {
      const spotCountryNorm = normalizeSearchText(spot.country || 'España');
      const targetCountryNorm = normalizeSearchText(selectedCountry);
      if (spotCountryNorm !== targetCountryNorm) return false;
    }

    // 2. Province / Region Filter
    if (selectedProvince !== 'todas') {
      const targetProvNorm = normalizeSearchText(selectedProvince);
      const spotRegionNorm = normalizeSearchText(spot.region);
      const spotNameNorm = normalizeSearchText(spot.name);
      const spotDescNorm = normalizeSearchText(spot.description);

      // Special case for Galicia (matches Ourense, Lugo, Pontevedra, A Coruña or Galicia)
      if (targetProvNorm === 'galicia') {
        const isGalicia =
          spotRegionNorm.includes('galicia') ||
          spotRegionNorm.includes('ourense') ||
          spotRegionNorm.includes('lugo') ||
          spotRegionNorm.includes('coruna') ||
          spotRegionNorm.includes('pontevedra');
        if (!isGalicia) return false;
      } else if (targetProvNorm === 'zaragoza') {
        const isZaragoza =
          spotRegionNorm.includes('zaragoza') ||
          spotNameNorm.includes('zaragoza') ||
          spotDescNorm.includes('zaragoza') ||
          spot.id.includes('zaragoza');
        if (!isZaragoza) return false;
      } else if (targetProvNorm === 'andalucia') {
        const isAndalucia =
          spotRegionNorm.includes('andalucia') ||
          spotRegionNorm.includes('jaen') ||
          spotRegionNorm.includes('cordoba') ||
          spotRegionNorm.includes('malaga') ||
          spotRegionNorm.includes('almeria') ||
          spotRegionNorm.includes('granada') ||
          spotRegionNorm.includes('huelva') ||
          spotRegionNorm.includes('sevilla');
        if (!isAndalucia) return false;
      } else if (targetProvNorm.includes('mancha') || targetProvNorm === 'cuenca') {
        const isMancha =
          spotRegionNorm.includes('mancha') ||
          spotRegionNorm.includes('cuenca') ||
          spotRegionNorm.includes('albacete') ||
          spotRegionNorm.includes('ciudad real') ||
          spotRegionNorm.includes('toledo') ||
          spotRegionNorm.includes('guadalajara');
        if (!isMancha) return false;
      } else if (targetProvNorm.includes('leon')) {
        const isCastillaLeon =
          spotRegionNorm.includes('leon') ||
          spotRegionNorm.includes('avila') ||
          spotRegionNorm.includes('soria') ||
          spotRegionNorm.includes('salamanca') ||
          spotRegionNorm.includes('burgos') ||
          spotRegionNorm.includes('zamora') ||
          spotRegionNorm.includes('valladolid') ||
          spotRegionNorm.includes('palencia') ||
          spotRegionNorm.includes('segovia') ||
          spotRegionNorm.includes('castilla y leon');
        if (!isCastillaLeon) return false;
      } else if (targetProvNorm.includes('vasco') || targetProvNorm.includes('alava')) {
        const isPaisVasco =
          spotRegionNorm.includes('vasco') ||
          spotRegionNorm.includes('alava') ||
          spotRegionNorm.includes('araba') ||
          spotRegionNorm.includes('guipuzcoa') ||
          spotRegionNorm.includes('vizcaya');
        if (!isPaisVasco) return false;
      } else if (targetProvNorm === 'canarias') {
        const isCanarias =
          spotRegionNorm.includes('canarias') ||
          spotRegionNorm.includes('palma') ||
          spotRegionNorm.includes('tenerife') ||
          spotRegionNorm.includes('fuerteventura') ||
          spotRegionNorm.includes('gran canaria');
        if (!isCanarias) return false;
      } else if (targetProvNorm === 'baleares') {
        const isBaleares =
          spotRegionNorm.includes('baleares') ||
          spotRegionNorm.includes('menorca') ||
          spotRegionNorm.includes('mallorca') ||
          spotRegionNorm.includes('cabrera') ||
          spotRegionNorm.includes('ibiza');
        if (!isBaleares) return false;
      } else if (targetProvNorm === 'extremadura' || targetProvNorm === 'caceres') {
        const isExtremadura =
          spotRegionNorm.includes('extremadura') ||
          spotRegionNorm.includes('caceres') ||
          spotRegionNorm.includes('badajoz');
        if (!isExtremadura) return false;
      } else if (targetProvNorm === 'cataluna') {
        const isCataluna =
          spotRegionNorm.includes('cataluna') ||
          spotRegionNorm.includes('lleida') ||
          spotRegionNorm.includes('tarragona') ||
          spotRegionNorm.includes('girona') ||
          spotRegionNorm.includes('barcelona') ||
          spotRegionNorm.includes('montsec') ||
          spotRegionNorm.includes('prades') ||
          spotRegionNorm.includes('aiguestortes');
        if (!isCataluna) return false;
      } else if (!spotRegionNorm.includes(targetProvNorm)) {
        return false;
      }
    }

    // 3. Type Filter (Certified vs Optimal Free)
    if (selectedType === 'certified' && !spot.certified) return false;
    if (selectedType === 'optimal_free' && spot.certified) return false;

    // 4. Search query filter: Multilingual multi-token search with accent tolerance
    if (!searchQuery.trim()) return true;

    return matchesMultilingualSearch(searchQuery, [
      spot.name,
      spot.region,
      spot.country || 'España',
      translateCountry(spot.country || 'España', language),
      spot.description,
      ...(spot.facilities || []),
      ...(spot.subAreas || []),
    ]);
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
    if (stopWatchRef.current) {
      stopWatchRef.current();
      stopWatchRef.current = null;
    }

    setIsLocating(true);
    setGeoStatusKey('obtaining');

    stopWatchRef.current = watchLivePosition(
      (coords) => {
        setUserCoords(coords);
        setGeoStatusKey('detected');
        setIsLocating(false);
      },
      (errCode) => {
        setIsLocating(false);
        if (errCode === 'denied') {
          setGeoStatusKey('denied');
        } else if (errCode === 'unsupported') {
          setGeoStatusKey('unsupported');
        } else {
          setGeoStatusKey('unavailable');
        }
      }
    );
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10 pb-28 md:pb-16">
      {/* Header */}
      <header className="py-4 md:py-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <span className="material-symbols-outlined text-sm">stars</span>
          <span>{t('spotsHeaderBadge')}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('spotsHeaderTitle')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t('spotsHeaderDesc')}
        </p>
      </header>

      {/* PROMINENT SEARCH & FILTER CONTAINER */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[#FFD700]/40 bg-gradient-to-r from-[#2D1B4E] via-[#241542] to-[#1e1335] shadow-2xl mb-8 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#FFD700]">
            <span className="material-symbols-outlined text-2xl">search</span>
            <h2 className="text-base sm:text-lg font-extrabold font-['Plus_Jakarta_Sans']">
              {t('spotsSearchHeader')}
            </h2>
          </div>
          <span className="text-[10px] sm:text-xs bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full font-bold border border-[#FFD700]/30 uppercase tracking-wider font-['JetBrains_Mono']">
            {filteredSpots.length} / {STARLIGHT_SPOTS.length} {t('spotsCountUnit')}
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
            placeholder={t('spotsSearchPlaceholder')}
            className="w-full bg-black/40 text-white placeholder-white/40 pl-11 pr-10 py-3 rounded-2xl border border-white/20 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 text-sm sm:text-base font-['Plus_Jakarta_Sans'] transition-all shadow-inner"
            id="input-search-location-name"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title={t('spotsClearSearch')}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Quick Batch Save for current search / selection */}
        {searchQuery.trim().length > 1 && filteredSpots.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <span className="material-symbols-outlined text-sm">download_for_offline</span>
              <span>
                <strong>{t('spotsBatchPrompt1')}</strong> {t('spotsBatchPrompt2')} ({filteredSpots.length} · ~{(filteredSpots.length * 1.5).toFixed(1)} KB).
              </span>
            </div>
            <button
              onClick={() => {
                filteredSpots.forEach((s) => saveSpot(s));
                setSavedBatchCount(filteredSpots.length);
                setTimeout(() => setSavedBatchCount(null), 4000);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-sm">bookmark_add</span>
              {t('spotsBatchBtn')} ({filteredSpots.length})
            </button>
          </div>
        )}

        {savedBatchCount !== null && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span className="font-bold">{savedBatchCount} {t('spotsBatchSavedToast')}</span>
          </div>
        )}

        {/* Country, Province & Type Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Country Selector */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs text-[#FFD700] font-bold shrink-0 font-['JetBrains_Mono']">
              {t('countryFilter', 'País:')}
            </span>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                if (e.target.value !== 'España' && e.target.value !== 'todos') {
                  setSelectedProvince('todas');
                }
              }}
              className="bg-black/60 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-[#FFD700] flex-1 cursor-pointer"
            >
              <option value="todos">{t('allCountries', 'Todos los Países')}</option>
              {availableCountries.filter((c) => c !== 'todos').map((country) => (
                <option key={country} value={country}>
                  {translateCountry(country, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Province / Region Selector (Spain & General) */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs text-[#FFD700] font-bold shrink-0 font-['JetBrains_Mono']">
              {t('spotsRegionFilter')}
            </span>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                if (activeSubTab !== 'name') setActiveSubTab('name');
              }}
              className="bg-black/60 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-[#FFD700] flex-1 cursor-pointer"
            >
              {spanishProvinces.map((prov) => (
                <option key={prov.value} value={prov.value}>
                  {prov.label}
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

        {/* Informative Starlight Banner for Zaragoza */}
        {(normalizeSearchText(searchQuery).includes('zaragoza') || normalizeSearchText(searchQuery).includes('saragossa') || normalizeSearchText(searchQuery).includes('saragosse') || selectedProvince === 'zaragoza') && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-100 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-fadeIn">
            <span className="material-symbols-outlined text-amber-300 text-2xl shrink-0 mt-0.5">verified</span>
            <div className="space-y-1">
              <div className="font-extrabold text-white flex flex-wrap items-center gap-2">
                <span>{t('spotsZaragozaBannerTitle')}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                  Fundación Starlight
                </span>
              </div>
              <p className="text-amber-100/90 leading-relaxed text-xs">
                {t('spotsZaragozaBannerDesc')}
              </p>
            </div>
          </div>
        )}

        {/* Informative Starlight Banner for Galicia */}
        {(normalizeSearchText(searchQuery).includes('galicia') || normalizeSearchText(searchQuery).includes('galice') || normalizeSearchText(searchQuery).includes('galiza') || normalizeSearchText(searchQuery).includes('galizia') || selectedProvince === 'galicia') && (
          <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-100 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-fadeIn">
            <span className="material-symbols-outlined text-sky-300 text-2xl shrink-0 mt-0.5">verified</span>
            <div className="space-y-1">
              <div className="font-extrabold text-white flex flex-wrap items-center gap-2">
                <span>{t('spotsGaliciaBannerTitle')}</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                  Fundación Starlight
                </span>
              </div>
              <p className="text-sky-100/90 leading-relaxed text-xs">
                {t('spotsGaliciaBannerDesc')}
              </p>
            </div>
          </div>
        )}

        {/* Modalidad Buttons: Starlight vs DarkSky Internacional vs Localización Libre */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Modalidad 1: Starlight */}
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
            id="btn-modality-starlight"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center text-xl shrink-0">
              ⭐
            </div>
            <div>
              <span className="block text-xs font-extrabold uppercase text-[#FFD700] tracking-wider font-['JetBrains_Mono']">
                {t('spotsModality1Badge')}
              </span>
              <span className="block text-sm font-bold font-['Plus_Jakarta_Sans']">
                {t('modality1Title', 'Zonas Certificadas Starlight')}
              </span>
              <span className="block text-[11px] text-white/60">
                {t('modality1Desc', 'Reservas y Destinos de la Fundación Starlight')}
              </span>
            </div>
          </button>

          {/* Modalidad 2: DarkSky Internacional */}
          <button
            onClick={() => {
              if (onNavigateToDarkSky) {
                onNavigateToDarkSky();
              }
            }}
            className="p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-cyan-400/50 hover:border-cyan-300 text-white shadow-lg hover:shadow-cyan-500/20 group"
            id="btn-modality-darksky"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-105 transition-transform flex items-center justify-center text-xl shrink-0 border border-cyan-400/30">
              🌌
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="block text-xs font-extrabold uppercase text-cyan-300 tracking-wider font-['JetBrains_Mono']">
                  {t('spotsModality2GlobalBadge')}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 text-[9px] font-bold">
                  {t('spotsModality2GlobalPill')}
                </span>
              </div>
              <span className="block text-sm font-bold font-['Plus_Jakarta_Sans'] group-hover:text-cyan-200 transition-colors">
                {t('spotsModality2DarkSkyTitle')}
              </span>
              <span className="block text-[11px] text-cyan-100/70">
                {t('spotsModality2DarkSkyDesc')}
              </span>
            </div>
          </button>

          {/* Modalidad 3: Localización Libre */}
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
            id="btn-modality-free"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              🌄
            </div>
            <div>
              <span className="block text-xs font-extrabold uppercase text-emerald-400 tracking-wider font-['JetBrains_Mono']">
                {t('spotsOptimalBadge')}
              </span>
              <span className="block text-sm font-bold font-['Plus_Jakarta_Sans']">
                {t('modality2Title', 'Localización Libre (Puntos Accesibles)')}
              </span>
              <span className="block text-[11px] text-white/60">
                {t('modality2Desc', 'Ermitas, Castillos y Miradores de Montaña')}
              </span>
            </div>
          </button>
        </div>

        {/* Popular Tags */}
        {(() => {
          const currentContext = (() => {
            if (selectedCountry !== 'todos' && selectedCountry !== 'España') return selectedCountry;
            if (selectedProvince !== 'todas') return selectedProvince;
            const q = normalizeSearchText(searchQuery);
            if (q.includes('chile') || q.includes('chili') || q.includes('cile') || q.includes('atacama') || q.includes('paranal')) return 'Chile';
            if (q.includes('argentina') || q.includes('argentine') || q.includes('argentinien') || q.includes('leoncito') || q.includes('villavicencio')) return 'Argentina';
            if (q.includes('portugal') || q.includes('portogallo') || q.includes('alqueva')) return 'Portugal';
            if (q.includes('andorra') || q.includes('andorre') || q.includes('sorteny')) return 'Andorra';
            if (q.includes('aragon') || q.includes('zaragoza') || q.includes('saragossa') || q.includes('saragosse') || q.includes('teruel') || q.includes('vicort')) return 'Aragón';
            if (q.includes('galicia') || q.includes('galice') || q.includes('galiza') || q.includes('galizia') || q.includes('trevinca') || q.includes('cies')) return 'Galicia';
            if (q.includes('canarias') || q.includes('canary') || q.includes('canaries') || q.includes('kanaren') || q.includes('palma') || q.includes('teide') || q.includes('tenerife')) return 'Canarias';
            if (q.includes('andaluc') || q.includes('andalus') || q.includes('andalou') || q.includes('gorafe') || q.includes('morena')) return 'Andalucía';
            if (q.includes('catal') || q.includes('katalon') || q.includes('montsec') || q.includes('aiguamolls')) return 'Cataluña';
            if (q.includes('extremadura') || q.includes('monfrague')) return 'Extremadura';
            if (q.includes('cuenca') || q.includes('mancha')) return 'Castilla-La Mancha';
            if (q.includes('gredos') || q.includes('leon')) return 'Castilla y León';
            if (q.includes('valenc') || q.includes('turia') || q.includes('culla')) return 'Comunidad Valenciana';
            if (selectedCountry === 'España') return 'España';
            return 'todos';
          })();

          const tagsMap: Record<string, string[]> = {
            Chile: ['Desierto de Atacama', 'Cerro Paranal', 'Bosque Fray Jorge', 'Llanos de Challes', 'Antofagasta'],
            Argentina: ['El Leoncito', 'Reserva Villavicencio', 'Barreal Blanco', 'Mendoza', 'Tierra del Fuego'],
            Portugal: ['Dark Sky Alqueva', 'Aldeia das Ruivas', 'Vale do Tua', 'Monsaraz', 'Cumeada'],
            Andorra: ['Vall de Sorteny', 'Comapedrosa', 'Ordino'],
            'EE.UU.': ['Observatorio Mauna Kea', 'Hawái'],
            Aragón: ['Zaragoza', 'Sierra de Vicort', 'Comarca del Aranda', 'Gúdar-Javalambre', 'Teruel', 'Aliaga'],
            Galicia: ['Pena Trevinca', 'Islas Cíes', 'Muras', 'Costa da Morte', 'A Veiga'],
            Canarias: ['La Palma', 'Roque de los Muchachos', 'Teide (Tenerife)', 'Fuerteventura'],
            Andalucía: ['Gorafe', 'Sierra Sur de Jaén', 'Sierra Morena', 'Sierra Nevada', 'Cazorla'],
            Cataluña: ['Montsec', 'Aiguamolls de l’Empordà', 'Prades', 'Aigüestortes'],
            Extremadura: ['Monfragüe', 'Alqueva Badajoz', 'Tajo Internacional'],
            'Castilla-La Mancha': ['Serranía de Cuenca', 'Sierra del Segura', 'Valle de Alcudia'],
            'Castilla y León': ['Sierra de Gredos', 'Muriel Viejo', 'Las Hurdes', 'Babia'],
            'Comunidad Valenciana': ['Alto Turia', 'Culla', 'Tírig', 'Aras de los Olmos'],
            'Islas Baleares': ['Menorca Starlight', 'Santa Galdana', 'Fornells'],
            'La Rioja': ['Valle del Leza', 'Jubera', 'Cidacos'],
            Navarra: ['Roncal', 'Selva de Irati', 'Bardenas Reales'],
            global: [
              'Zaragoza',
              'Galicia',
              'Sierra de Vicort',
              'La Palma',
              'Montsec',
              'Atacama (Chile)',
              'El Leoncito (Argentina)',
              'Alqueva (Portugal)'
            ]
          };

          const tags = tagsMap[currentContext] || tagsMap.global;
          const localizedContext = currentContext === 'todos'
            ? ''
            : translateProvinceLabel(currentContext.toLowerCase(), language) !== currentContext.toLowerCase()
              ? translateProvinceLabel(currentContext.toLowerCase(), language).split(' (')[0]
              : translateCountry(currentContext, language);

          return (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-white/60 text-[11px] font-semibold">
                {t('quickSearch', 'Búsqueda rápida:')}{localizedContext ? ` (${localizedContext})` : ''}
              </span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const cleanTag = tag.replace(/\s*\([^)]*\)/g, '').trim();
                    setSearchQuery(cleanTag);
                    setActiveSubTab('name');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                    searchQuery.toLowerCase().includes(tag.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim())
                      ? 'bg-[#FEE685] text-black border-[#FEE685] font-extrabold shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                  }`}
                >
                  🔍 {tag}
                </button>
              ))}
            </div>
          );
        })()}
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

        <button
          onClick={() => setActiveSubTab('offline')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'offline' ? 'text-amber-400' : 'text-white/60 hover:text-white'
          }`}
          id="tab-spots-offline"
        >
          <span className="material-symbols-outlined text-2xl">
            {stats.spotsCount > 0 ? 'backpack' : 'cloud_off'}
          </span>
          <span>{t('spotsOfflineTitle')} ({stats.spotsCount})</span>
          {stats.spotsCount > 0 && (
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-400/40">
              {stats.approxKB} KB
            </span>
          )}
          {activeSubTab === 'offline' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400 rounded-t-full shadow-[0_0_12px_#fbbf24]" />
          )}
        </button>
      </div>

      {/* SUB-TAB 1: BUSCAR Y VER TODOS LOS LUGARES */}
      {activeSubTab === 'name' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>
              {t('spotsShowingPrefix')} {filteredSpots.length} {t('spotsShowingMiddle')} {STARLIGHT_SPOTS.length} {t('spotsShowingSuffix')}.
            </span>
            {(searchQuery || selectedCountry !== 'todos' || selectedProvince !== 'todas' || selectedType !== 'todos') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('todos');
                  setSelectedProvince('todas');
                  setSelectedType('todos');
                }}
                className="text-[#FFD700] hover:underline font-bold cursor-pointer"
              >
                {t('spotsResetFilters')}
              </button>
            )}
          </div>

          {filteredSpots.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center border border-white/10 space-y-3">
              <span className="material-symbols-outlined text-4xl text-white/40">search_off</span>
              <h3 className="text-lg font-bold text-white">{t('spotsEmptyTitle')}</h3>
              <p className="text-xs text-white/60">{t('spotsEmptyDesc')}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('todos');
                  setSelectedProvince('todas');
                  setSelectedType('todos');
                }}
                className="px-4 py-2 bg-[#FEE685] text-black font-extrabold rounded-xl text-xs cursor-pointer"
              >
                {t('spotsViewAllBtn')}
              </button>
            </div>
          ) : (
            <>
              {/* Territorial / Regional Hero Banner */}
              {(() => {
                let activeCountry = selectedCountry !== 'todos' ? selectedCountry : undefined;
                let activeRegion = selectedProvince !== 'todas' ? selectedProvince : searchQuery || undefined;

                if (!activeCountry && searchQuery) {
                  const q = normalizeSearchText(searchQuery);
                  if (q.includes('chile') || q.includes('chili') || q.includes('cile') || q.includes('atacama') || q.includes('paranal') || q.includes('fray jorge')) {
                    activeCountry = 'Chile';
                  } else if (q.includes('argentina') || q.includes('argentine') || q.includes('argentinien') || q.includes('leoncito') || q.includes('villavicencio') || q.includes('mendoza') || q.includes('ushuaia')) {
                    activeCountry = 'Argentina';
                  } else if (q.includes('portugal') || q.includes('portogallo') || q.includes('alqueva') || q.includes('ruivas') || q.includes('tua')) {
                    activeCountry = 'Portugal';
                  } else if (q.includes('andorra') || q.includes('andorre') || q.includes('sorteny') || q.includes('ordino')) {
                    activeCountry = 'Andorra';
                  } else if (q.includes('mauna kea') || q.includes('hawai') || q.includes('eeuu') || q.includes('usa') || q.includes('united states') || q.includes('estados unidos')) {
                    activeCountry = 'EE.UU.';
                  } else if (filteredSpots.length > 0 && filteredSpots[0].country) {
                    activeCountry = filteredSpots[0].country;
                  }
                }

                if (!activeCountry) {
                  if (filteredSpots.length > 0 && filteredSpots[0].country) {
                    activeCountry = filteredSpots[0].country;
                  } else {
                    activeCountry = 'España';
                  }
                }

                if (!activeRegion && filteredSpots.length > 0) {
                  activeRegion = filteredSpots[0].region;
                }

                const rawRegionInfo = getRegionImage({
                  country: activeCountry,
                  region: activeRegion,
                });
                const activeRegionInfo = rawRegionInfo ? translateRegionInfo(rawRegionInfo, language) : null;
                if (!activeRegionInfo) return null;
                return (
                  <div className="rounded-3xl overflow-hidden border border-[#38BDF8]/40 shadow-2xl bg-gradient-to-br from-[#0c1a30] via-[#10223f] to-[#071326] mb-8 relative">
                    <div className="relative h-60 sm:h-72 w-full overflow-hidden">
                      <img
                        src={activeRegionInfo.imageUrl}
                        alt={activeRegionInfo.nombre_localizacion_principal}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-[#071326]/50 to-transparent" />
                      <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 text-[11px] font-extrabold text-amber-300 shadow-lg flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-amber-300">image</span>
                        {t('spotsRepImgLabel')}: {activeRegionInfo.region || activeRegionInfo.pais}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 space-y-1">
                        <span className="text-xs uppercase font-extrabold text-[#7DD3FC] tracking-wider block font-['JetBrains_Mono']">
                          {activeRegionInfo.pais} • {activeRegionInfo.region}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans'] drop-shadow-md">
                          {activeRegionInfo.nombre_localizacion_principal}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/90 line-clamp-2 max-w-3xl drop-shadow">
                          {activeRegionInfo.descripcion_imagen_generica}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-[#082F49]/80 border-t border-[#38BDF8]/30 flex flex-wrap items-center justify-between text-xs text-[#BAE6FD] gap-2">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#7DD3FC]">verified</span>
                        {t('spotsTerritoryHint')}
                      </span>
                      <span className="font-['JetBrains_Mono'] font-bold text-[#FEE685] bg-black/50 px-2.5 py-0.5 rounded-lg border border-white/10">
                        {filteredSpots.length} {t('spotsCatalogedSuffix')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSpots.map((spot) => {
                  const localizedCountry = translateCountry(spot.country || 'España', language);
                  return (
                  <div
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot)}
                    className="card-pastel-gold card-pastel-gold-hover rounded-3xl overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between border-2 border-[#38BDF8]"
                  >
                    <div>
                      {/* Enclave Technical Header (No individual photo) */}
                      <div className="p-5 pb-4 bg-gradient-to-br from-[#0c192e] via-[#0f2442] to-[#091629] border-b border-[#38BDF8]/40">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {spot.certified ? (
                              <span className="bg-[#0284C7] text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-[#BAE6FD]/40">
                                ⭐ {t('spotsCertifiedBadge')}
                              </span>
                            ) : (
                              <span className="bg-[#059669] text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                🌄 {t('spotsOptimalBadge')}
                              </span>
                            )}
                            <span className="bg-black/80 text-[#38BDF8] font-['JetBrains_Mono'] text-xs px-2.5 py-0.5 rounded-full font-black border border-[#38BDF8]/40 shadow-sm">
                              Bortle {spot.bortleClass}
                            </span>
                          </div>

                          <span className="bg-black/60 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                            🌍 {localizedCountry}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs text-[#7DD3FC] font-black uppercase tracking-wider block font-['JetBrains_Mono']">
                            {spot.region}
                          </span>
                          <h3 className="text-xl md:text-2xl font-black text-white font-['Plus_Jakarta_Sans'] leading-tight group-hover:text-[#7DD3FC] transition-colors mt-0.5">
                            {spot.name}
                          </h3>
                        </div>

                        {/* Astronomical Telemetry Grid */}
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/10 text-xs font-['JetBrains_Mono']">
                          <div className="bg-black/50 p-2 rounded-xl border border-white/10">
                            <span className="text-[#7DD3FC] block text-[9px] uppercase font-bold">{t('spotsAltitudeLabel')}</span>
                            <span className="text-white font-black text-sm">{spot.elevationMeters}m</span>
                          </div>
                          <div className="bg-black/50 p-2 rounded-xl border border-white/10">
                            <span className="text-[#7DD3FC] block text-[9px] uppercase font-bold">{t('spotsSqmLabel')}</span>
                            <span className="text-white font-black text-sm">{spot.sqm}</span>
                          </div>
                          <div className="bg-black/50 p-2 rounded-xl border border-white/10">
                            <span className="text-[#7DD3FC] block text-[9px] uppercase font-bold">GPS</span>
                            <span className="text-white font-black text-[10px] truncate block" title={`${spot.latitude}, ${spot.longitude}`}>
                              {spot.latitude.toFixed(2)}°, {spot.longitude.toFixed(2)}°
                            </span>
                          </div>
                        </div>
                      </div>

                    <div className="p-6">
                      <p className="text-sm md:text-base text-[#030712] font-bold leading-relaxed mb-4 line-clamp-3">
                        {spot.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono'] mb-4 p-3.5 rounded-2xl bg-white/90 border border-[#38BDF8]/60 shadow-sm">
                        <div>
                          <span className="text-[#082F49] block font-black">{t('spotsElevationFullLabel')}:</span>
                          <span className="text-[#030712] font-black text-sm">{spot.elevationMeters} {t('spotsElevUnitLabel')}</span>
                        </div>
                        <div>
                          <span className="text-[#082F49] block font-black">{t('spotsSqmQualityLabel')}:</span>
                          <span className="text-[#030712] font-black text-sm">{spot.sqm} mag/arcsec²</span>
                        </div>
                      </div>

                      {spot.subAreas && spot.subAreas.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[11px] font-black text-[#082F49] uppercase block mb-1.5 font-['JetBrains_Mono']">
                            📍 {t('spotsSubAreasLabel')}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {spot.subAreas.map((area, idx) => (
                              <span key={idx} className="text-[11px] bg-white text-[#030712] px-2.5 py-1 rounded-lg border border-[#38BDF8]/60 font-black shadow-sm">
                                📍 {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {spot.facilities.map((fac, idx) => (
                          <span key={idx} className="text-[11px] bg-white/80 text-[#030712] font-black px-2.5 py-1 rounded-md border border-[#38BDF8]/40 shadow-xs">
                            • {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpot(spot);
                      }}
                      className="flex-1 py-3.5 rounded-2xl bg-[#0369A1] hover:bg-[#0284C7] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">map</span>
                      {t('viewDetails', 'Ficha Completa')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveSpot(spot);
                      }}
                      className={`px-3.5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0 ${
                        isSpotSaved(spot.id)
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400/40 shadow-emerald-900/30'
                          : 'bg-[#082F49] hover:bg-[#0c3e60] text-white/90 border border-[#38BDF8]/40'
                      }`}
                      title={
                        isSpotSaved(spot.id)
                          ? t('spotsOfflineBoxSaved')
                          : t('spotsOfflineBoxSave')
                      }
                    >
                      <span className="material-symbols-outlined text-base text-amber-300">
                        {isSpotSaved(spot.id) ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                      <span className="hidden sm:inline">
                        {isSpotSaved(spot.id) ? t('spotsSavedShort') : t('spotsSaveShort')}
                      </span>
                    </button>
                  </div>
                </div>
                  );
                })}
            </div>
          </>
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
              {t('spotsAllRegisteredBtn')} ({filteredSpots.length})
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
              {t('spotsAnalyzeFreeBtn')}
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
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B4E] via-transparent to-black/30" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {spot.certified ? (
                          <span className="bg-[#FFD700] text-black text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase">
                            ⭐ {t('spotsCertifiedBadge')}
                          </span>
                        ) : (
                          <span className="bg-emerald-500 text-black text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase">
                            🌄 {t('spotsOptimalBadge')}
                          </span>
                        )}
                        <span className="bg-black/70 backdrop-blur-md text-[#FFD700] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded-full font-bold">
                          Bortle {spot.bortleClass}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xs text-[#FFD700] font-bold uppercase tracking-wider">
                          {spot.region} • {translateCountry(spot.country || 'España', language)}
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
                          <span className="text-white/50 block">{t('spotsCoordsLabel')}:</span>
                          <span className="text-white font-bold">{spot.latitude.toFixed(2)}°, {spot.longitude.toFixed(2)}°</span>
                        </div>
                        <div>
                          <span className="text-white/50 block">{t('spotsAltitudeLabel')}:</span>
                          <span className="text-white font-bold">{spot.elevationMeters} {t('spotsElevUnitLabel')}</span>
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
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#FEE685] hover:text-black text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/15 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">map</span>
                      {t('spotsSheetGpsBtn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mapMode === 'free_location' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/15 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                      {t('spotsCoordsDirectTitle', 'Tu GPS en Tiempo Real y Coordenadas en Google Maps')}
                    </h3>
                    <p className="text-xs text-white/70 mt-1">
                      {t('spotsCoordsDirectDesc', 'Obtén tu posición GPS real o introduce unas coordenadas exactas para abrirlas directamente en Google Maps.')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="px-5 py-2.5 rounded-xl bg-[#FEE685] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isLocating ? 'sync' : 'my_location'}
                    </span>
                    <span>{isLocating ? t('spotsGpsDetectingBtn') : t('spotsGpsDetectBtn')}</span>
                  </button>
                </div>

                {/* Live user GPS readout */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#7DD3FC] font-bold block">
                      {t('mcSosCoordsLabel', 'MIS COORDENADAS GPS')}
                    </span>
                    {userCoords ? (
                      <div className="mt-1 space-y-0.5">
                        <span className="text-base sm:text-lg font-extrabold text-white font-['JetBrains_Mono'] block">
                          {formatCoordinatesDMS(userCoords.lat, userCoords.lng)}
                        </span>
                        <span className="text-xs text-emerald-300 font-['JetBrains_Mono'] block">
                          {userCoords.lat.toFixed(6)}, {userCoords.lng.toFixed(6)}
                          {userCoords.accuracyMeters ? ` (±${userCoords.accuracyMeters} m)` : ''}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/75 mt-1 block">{geoStatusText}</span>
                    )}
                  </div>

                  {userCoords && (
                    <a
                      href={buildGoogleMapsPinUrl(userCoords.lat, userCoords.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{t('gpsOpenMyLocationMaps', 'Ver mi ubicación exacta en Google Maps')}</span>
                    </a>
                  )}
                </div>

                {/* Direct custom coordinates -> Google Maps */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-xs text-white/60 font-['JetBrains_Mono'] uppercase block mb-1.5">
                      {t('spotsLatLabel', 'Latitud exacta')}
                    </label>
                    <input
                      type="text"
                      value={customCoords.lat}
                      onChange={(e) => setCustomCoords((prev) => ({ ...prev, lat: e.target.value }))}
                      placeholder="40.2241"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-['JetBrains_Mono'] text-sm focus:outline-none focus:border-[#FEE685]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/60 font-['JetBrains_Mono'] uppercase block mb-1.5">
                      {t('spotsLngLabel', 'Longitud exacta')}
                    </label>
                    <input
                      type="text"
                      value={customCoords.lng}
                      onChange={(e) => setCustomCoords((prev) => ({ ...prev, lng: e.target.value }))}
                      placeholder="-0.3524"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-['JetBrains_Mono'] text-sm focus:outline-none focus:border-[#FEE685]"
                    />
                  </div>

                  {(() => {
                    const parsedLat = Number(customCoords.lat);
                    const parsedLng = Number(customCoords.lng);
                    const valid =
                      Number.isFinite(parsedLat) &&
                      Number.isFinite(parsedLng) &&
                      Math.abs(parsedLat) <= 90 &&
                      Math.abs(parsedLng) <= 180;
                    return valid ? (
                      <a
                        href={buildGoogleMapsDirectionsUrl(parsedLat, parsedLng, userCoords)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-[#FEE685] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">directions</span>
                        {t('spotsMapOpenNav')}
                      </a>
                    ) : (
                      <span className="text-xs text-rose-300 font-bold py-2.5">
                        {t('spotsInvalidCoords', 'Introduce coordenadas válidas (Lat -90..90, Lng -180..180)')}
                      </span>
                    );
                  })()}
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
                  {t('spotsGpsBadge')}
                </span>
                <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] mb-1">
                  {t('spotsGpsTitle')}
                </h3>
                <p className="text-sm text-white/80">
                  {geoStatusText}
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
                {isLocating ? t('spotsGpsDetectingBtn') : t('spotsGpsDetectBtn')}
              </button>
            </div>
          </div>

          {!userCoords ? (
            <div className="glass-panel rounded-3xl p-8 text-center border border-white/15 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#FEE685]">my_location</span>
              <h3 className="text-lg font-bold text-white">
                {t('spotsGpsNeedPermTitle', 'Activa tu ubicación GPS en tiempo real')}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto">
                {geoStatusText}
              </p>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="px-5 py-3 rounded-xl bg-[#FEE685] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">my_location</span>
                <span>{isLocating ? t('spotsGpsDetectingBtn') : t('spotsGpsDetectBtn')}</span>
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-['Plus_Jakarta_Sans']">
                {t('spotsNearbyHeading')} ({filteredSpots.length})
              </h3>

              <div className="space-y-4">
                {[...filteredSpots]
                  .map((spot) => {
                    const distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude);
                    return { spot, distanceKm };
                  })
                  .sort((a, b) => a.distanceKm - b.distanceKm)
                  .map(({ spot, distanceKm }) => {
                    return (
                      <div
                        key={spot.id}
                        className="card-pastel-gold card-pastel-gold-hover rounded-3xl p-6 shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#7DD3FC]/50 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={spot.imageUrl}
                            alt={spot.name}
                            className="w-20 h-20 rounded-2xl object-cover border border-[#38BDF8]/60 shrink-0 shadow-md"
                          />

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-lg bg-[#082F49]/90 text-[#7DD3FC] border border-[#38BDF8]/50 text-[10px] font-extrabold font-['JetBrains_Mono'] uppercase">
                                {t('spotsAwayPrefix')} {distanceKm} {t('spotsAwaySuffix')}
                              </span>
                              {spot.certified ? (
                                <span className="text-[10px] bg-[#082F49]/90 text-[#FEE685] border border-[#FEE685]/50 px-2 py-0.5 rounded-lg font-extrabold">
                                  ⭐ {t('spotsCertifiedBadge')}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-[#059669]/90 text-white px-2 py-0.5 rounded-lg font-extrabold">
                                  🌄 {t('spotsOptimalBadge')}
                                </span>
                              )}
                              <span className="text-xs text-[#BAE6FD] font-['JetBrains_Mono'] font-bold">
                                Bortle {spot.bortleClass}
                              </span>
                            </div>

                            <h4 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                              {spot.name}
                            </h4>

                            <p className="text-xs text-[#BAE6FD] font-medium line-clamp-1 mt-0.5">
                              {spot.region} • {translateCountry(spot.country || 'España', language)} • {t('spotsAltitudeLabel')}: {spot.elevationMeters}m
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <a
                            href={buildGoogleMapsDirectionsUrl(spot.latitude, spot.longitude, userCoords)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border border-[#7DD3FC]/50"
                          >
                            <span className="material-symbols-outlined text-base">near_me</span>
                            {t('getDirections', 'Cómo Llegar')} ({distanceKm} km)
                          </a>

                          <button
                            onClick={() => setSelectedSpot(spot)}
                            className="px-4 py-3 rounded-2xl bg-[#082F49]/80 hover:bg-[#082F49] text-white font-extrabold text-xs transition-all border border-[#38BDF8]/50 cursor-pointer shadow-sm"
                          >
                            {t('spotsSheetBtn')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: MOCHILA OFFLINE (MIRADORES GUARDADOS SELECTIVAMENTE) */}
      {activeSubTab === 'offline' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Informative Header for Offline Backpack */}
          <div className="card-pastel-gold rounded-3xl p-6 md:p-8 border border-amber-400/50 shadow-xl bg-gradient-to-r from-[#241542] via-[#1d1033] to-[#120a22]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0 text-2xl shadow-inner">
                  🎒
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                      {t('spotsOfflineTitle')}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                      {savedSpots.length} {t('spotsOfflineSavedCount')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
                    {t('spotsOfflineDesc1')} <strong className="text-amber-300 font-mono">{(savedSpots.length * 1.5).toFixed(1)} KB</strong> — {t('spotsOfflineDesc2')}
                  </p>
                </div>
              </div>

              {savedSpots.length > 0 && (
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {!confirmClearBackpack ? (
                    <button
                      onClick={() => setConfirmClearBackpack(true)}
                      className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">delete_sweep</span>
                      {t('spotsOfflineClearBtn')}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          savedSpots.forEach((s) => removeSpot(s.id));
                          setConfirmClearBackpack(false);
                        }}
                        className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white border border-red-300 text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                        {t('spotsOfflineConfirmClearBtn')}
                      </button>
                      <button
                        onClick={() => setConfirmClearBackpack(false)}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {t('spotsCloseBtn')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {savedSpots.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 text-center border border-white/10 space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-3xl text-amber-300/80">
                cloud_off
              </div>
              <h3 className="text-xl font-bold text-white">{t('spotsOfflineEmptyTitle')}</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {t('spotsOfflineEmptyDesc')}
              </p>
              <button
                onClick={() => setActiveSubTab('name')}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">search</span>
                {t('spotsOfflineSearchBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedSpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className="card-pastel-gold card-pastel-gold-hover rounded-3xl overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between border-2 border-amber-400/60"
                >
                  <div>
                    <div className="h-44 relative overflow-hidden">
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          ✓ {t('spotsSavedShort')}
                        </span>
                        <span className="bg-black/80 backdrop-blur-md text-[#38BDF8] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded-full font-black border border-[#38BDF8]/40">
                          Bortle {spot.bortleClass}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xs text-[#7DD3FC] font-black uppercase tracking-wider drop-shadow">
                          {spot.region} • {translateCountry(spot.country || 'España', language)}
                        </span>
                        <h3 className="text-xl font-black text-white font-['Plus_Jakarta_Sans'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {spot.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs md:text-sm text-[#030712] font-bold leading-relaxed line-clamp-2">
                        {spot.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-['JetBrains_Mono'] p-2.5 rounded-xl bg-white/90 border border-amber-400/40">
                        <div>
                          <span className="text-[#082F49] block font-black text-[10px]">{t('spotsCoordsLabel')}:</span>
                          <span className="text-[#030712] font-black text-xs">{spot.latitude}, {spot.longitude}</span>
                        </div>
                        <div>
                          <span className="text-[#082F49] block font-black text-[10px]">{t('spotsAltitudeLabel')} / SQM:</span>
                          <span className="text-[#030712] font-black text-xs">{spot.elevationMeters}m · SQM {spot.sqm}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-1 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpot(spot);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-[#0369A1] hover:bg-[#0284C7] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                      {t('spotsViewOfflineBtn')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSpot(spot.id);
                      }}
                      className="px-3 py-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-500/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                      title={t('spotsRemoveBtn')}
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span className="hidden sm:inline">{t('spotsRemoveBtn')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spot Detail Modal in Celestial Sky Blue Glass */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="card-pastel-gold w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 shadow-2xl border border-[#7DD3FC]/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#38BDF8]/40 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#BAE6FD] font-extrabold uppercase tracking-wider">
                    {selectedSpot.region} ({translateCountry(selectedSpot.country || 'España', language)})
                  </span>
                  {selectedSpot.certified ? (
                    <span className="px-2.5 py-0.5 bg-[#082F49]/90 text-[#FEE685] border border-[#FEE685]/50 font-extrabold text-[10px] rounded-full uppercase">
                      ⭐ {t('spotsCertifiedBadge')}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-[#059669] text-white font-extrabold text-[10px] rounded-full uppercase">
                      🌄 {t('spotsOptimalBadge')}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{selectedSpot.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSpot(null)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
                aria-label={t('spotsCloseBtn')}
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {(() => {
                const rawRegImg = getRegionImage(selectedSpot);
                const regImg = rawRegImg ? translateRegionInfo(rawRegImg, language) : null;
                return (
                  <div className="h-60 rounded-2xl overflow-hidden relative border border-[#38BDF8]/60 shadow-lg bg-black">
                    <img
                      src={regImg?.imageUrl || '/images/regions/esp_andalucia_default.jpg'}
                      alt={regImg?.nombre_localizacion_principal || selectedSpot.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-[10px] font-bold text-amber-300">
                      🌄 {t('spotsModalImgTerritory')}: {regImg?.region || selectedSpot.region} ({regImg?.nombre_localizacion_principal})
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <span className="bg-[#0284C7] text-white text-xs font-extrabold px-3 py-1 rounded-full font-['JetBrains_Mono'] shadow-sm">
                          Bortle {selectedSpot.bortleClass}
                        </span>
                        <span className="bg-black/80 text-white backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full font-['JetBrains_Mono']">
                          SQM: {selectedSpot.sqm} mag/arcsec²
                        </span>
                      </div>
                      <span className="text-[11px] text-white/90 font-['JetBrains_Mono'] bg-black/70 px-2.5 py-1 rounded-lg">
                        📍 {selectedSpot.latitude.toFixed(4)}°, {selectedSpot.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </div>
                );
              })()}

              <p className="text-base text-[#E0F2FE] font-medium leading-relaxed">
                {selectedSpot.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#082F49]/80 border border-[#38BDF8]/40 text-xs">
                <div>
                  <span className="text-[#7DD3FC] block uppercase font-['JetBrains_Mono'] font-bold">{t('spotsAltitudeLabel')}:</span>
                  <span className="text-white font-extrabold text-sm">{selectedSpot.elevationMeters} {t('spotsElevUnitLabel')}</span>
                </div>
                <div>
                  <span className="text-[#7DD3FC] block uppercase font-['JetBrains_Mono'] font-bold">{t('spotsBestSeasonLabel')}:</span>
                  <span className="text-white font-extrabold text-sm">{selectedSpot.bestSeason}</span>
                </div>
                <div>
                  <span className="text-[#7DD3FC] block uppercase font-['JetBrains_Mono'] font-bold">{t('spotsCoordsLabel')}:</span>
                  <span className="text-white font-extrabold text-sm font-['JetBrains_Mono']">{selectedSpot.latitude}, {selectedSpot.longitude}</span>
                </div>
              </div>

              {selectedSpot.subAreas && selectedSpot.subAreas.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-[#7DD3FC] text-sm uppercase tracking-wider mb-2">{t('spotsPointsInterestLabel')}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpot.subAreas.map((area, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-[#082F49]/90 text-[#E0F2FE] text-xs font-extrabold border border-[#38BDF8]/40 flex items-center gap-1 shadow-sm">
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-extrabold text-[#7DD3FC] text-sm uppercase tracking-wider mb-2">{t('spotsFacilitiesLabel')}:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpot.facilities.map((fac, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-[#082F49]/70 text-white text-xs font-medium border border-[#38BDF8]/30 shadow-xs">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selective Offline Storage Action in Modal */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-300 text-2xl">
                    {isSpotSaved(selectedSpot.id) ? 'offline_pin' : 'download_for_offline'}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isSpotSaved(selectedSpot.id)
                        ? t('spotsOfflineBoxSaved')
                        : t('spotsOfflineBoxSave')}
                    </span>
                    <span className="text-[11px] text-white/70 block">
                      {t('spotsOfflineBoxSub')} (~1.5 KB)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSaveSpot(selectedSpot)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shrink-0 ${
                    isSpotSaved(selectedSpot.id)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400/40'
                      : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isSpotSaved(selectedSpot.id) ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  <span>{isSpotSaved(selectedSpot.id) ? `✓ ${t('spotsSavedShort')}` : `${t('spotsSaveShort')} (~1.5 KB)`}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#38BDF8]/40 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildGoogleMapsDirectionsUrl(selectedSpot.latitude, selectedSpot.longitude, userCoords)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-[#7DD3FC]/50"
                >
                  <span className="material-symbols-outlined text-lg">near_me</span>
                  {t('spotsOpenGMapsBtn')}
                </a>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="px-6 py-3.5 rounded-2xl bg-[#082F49]/80 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#082F49] transition-all cursor-pointer border border-[#38BDF8]/40"
                >
                  {t('spotsCloseBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


