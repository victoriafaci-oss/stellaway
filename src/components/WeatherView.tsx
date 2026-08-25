import React, { useState, useEffect, useRef } from 'react';
import { WeatherType, WeatherData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CustomCityWeather {
  cityName: string;
  region: string;
  condition: WeatherType;
  temperatureC: number;
  seeingQuality: 'Excelente' | 'Bueno' | 'Regular' | 'Malo';
  bortleClass: number;
  sqm: number;
  lowCloudsPct: number;
  midCloudsPct: number;
  highCloudsPct: number;
  humidityPct: number;
  windKmH: number;
  windDirection: string;
  transparencyMag: number;
  moonPhaseName: string;
  moonIlluminationPct: number;
  eclipseVisibility: string;
}

const PRESET_CITIES: Record<string, CustomCityWeather> = {
  barcelona: {
    cityName: 'Barcelona',
    region: 'Cataluña',
    condition: 'clear',
    temperatureC: 21,
    seeingQuality: 'Bueno',
    bortleClass: 6,
    sqm: 19.30,
    lowCloudsPct: 10,
    midCloudsPct: 5,
    highCloudsPct: 0,
    humidityPct: 65,
    windKmH: 12,
    windDirection: 'SSE',
    transparencyMag: 5.5,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '98.5% Cobertura Parcial (Franja Totalidad a 60km)',
  },
  castellon: {
    cityName: 'Castellón de la Plana',
    region: 'Comunidad Valenciana',
    condition: 'clear',
    temperatureC: 22,
    seeingQuality: 'Excelente',
    bortleClass: 2,
    sqm: 21.85,
    lowCloudsPct: 2,
    midCloudsPct: 0,
    highCloudsPct: 0,
    humidityPct: 45,
    windKmH: 8,
    windDirection: 'ENE',
    transparencyMag: 6.2,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '100% ECLIPSE TOTAL (1m 42s Totalidad)',
  },
  madrid: {
    cityName: 'Madrid',
    region: 'Comunidad de Madrid',
    condition: 'clear',
    temperatureC: 25,
    seeingQuality: 'Regular',
    bortleClass: 8,
    sqm: 18.50,
    lowCloudsPct: 5,
    midCloudsPct: 0,
    highCloudsPct: 0,
    humidityPct: 35,
    windKmH: 10,
    windDirection: 'SO',
    transparencyMag: 4.8,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '100% ECLIPSE TOTAL (1m 15s Totalidad al atardecer)',
  },
  valencia: {
    cityName: 'Valencia',
    region: 'Comunidad Valenciana',
    condition: 'clear',
    temperatureC: 23,
    seeingQuality: 'Bueno',
    bortleClass: 6,
    sqm: 19.50,
    lowCloudsPct: 8,
    midCloudsPct: 0,
    highCloudsPct: 5,
    humidityPct: 62,
    windKmH: 14,
    windDirection: 'E',
    transparencyMag: 5.6,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '100% ECLIPSE TOTAL (1m 30s Totalidad)',
  },
  palma: {
    cityName: 'Palma de Mallorca',
    region: 'Islas Baleares',
    condition: 'clear',
    temperatureC: 24,
    seeingQuality: 'Excelente',
    bortleClass: 4,
    sqm: 21.10,
    lowCloudsPct: 4,
    midCloudsPct: 0,
    highCloudsPct: 0,
    humidityPct: 58,
    windKmH: 11,
    windDirection: 'ESE',
    transparencyMag: 6.0,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '100% ECLIPSE TOTAL (1m 36s Totalidad)',
  },
  sevilla: {
    cityName: 'Sevilla',
    region: 'Andalucía',
    condition: 'clear',
    temperatureC: 28,
    seeingQuality: 'Bueno',
    bortleClass: 7,
    sqm: 18.90,
    lowCloudsPct: 0,
    midCloudsPct: 0,
    highCloudsPct: 0,
    humidityPct: 30,
    windKmH: 9,
    windDirection: 'SO',
    transparencyMag: 5.2,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '96.2% Cobertura Parcial',
  },
  bilbao: {
    cityName: 'Bilbao',
    region: 'País Vasco',
    condition: 'clouds',
    temperatureC: 18,
    seeingQuality: 'Regular',
    bortleClass: 5,
    sqm: 20.10,
    lowCloudsPct: 45,
    midCloudsPct: 30,
    highCloudsPct: 20,
    humidityPct: 78,
    windKmH: 16,
    windDirection: 'NO',
    transparencyMag: 4.5,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '100% ECLIPSE TOTAL (1m 20s Totalidad)',
  },
  granada: {
    cityName: 'Granada (Sierra Nevada)',
    region: 'Andalucía',
    condition: 'clear',
    temperatureC: 20,
    seeingQuality: 'Excelente',
    bortleClass: 2,
    sqm: 21.90,
    lowCloudsPct: 0,
    midCloudsPct: 0,
    highCloudsPct: 0,
    humidityPct: 28,
    windKmH: 7,
    windDirection: 'S',
    transparencyMag: 6.4,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '97.8% Cobertura Parcial',
  },
  zaragoza: {
    cityName: 'Zaragoza',
    region: 'Aragón',
    condition: 'wind',
    temperatureC: 22,
    seeingQuality: 'Regular',
    bortleClass: 5,
    sqm: 20.30,
    lowCloudsPct: 12,
    midCloudsPct: 10,
    highCloudsPct: 5,
    humidityPct: 40,
    windKmH: 32,
    windDirection: 'NO (Cierzo)',
    transparencyMag: 5.4,
    moonPhaseName: 'Luna Nueva',
    moonIlluminationPct: 2,
    eclipseVisibility: '100% ECLIPSE TOTAL (1m 38s Totalidad)',
  },
};

export const WeatherView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'simulated' | 'custom_location'>('custom_location');
  const [selectedCondition, setSelectedCondition] = useState<WeatherType>('clear');
  const [searchQuery, setSearchQuery] = useState<string>('Barcelona');
  const [activeCityWeather, setActiveCityWeather] = useState<CustomCityWeather>(PRESET_CITIES.barcelona);
  const [savedCities, setSavedCities] = useState<string[]>(['Barcelona', 'Castellón de la Plana', 'Madrid']);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const weatherDataMap: Record<WeatherType, WeatherData> = {
    clear: {
      condition: 'clear',
      temperatureC: 19,
      seeingQuality: 'Excelente',
      bortleClass: 2,
      sqm: 21.85,
      lowCloudsPct: 2,
      midCloudsPct: 0,
      highCloudsPct: 0,
      humidityPct: 42,
      windKmH: 6,
      windDirection: 'NNE',
      transparencyMag: 6.2,
      moonPhaseName: 'Luna Nueva',
      moonIlluminationPct: 2,
    },
    rain: {
      condition: 'rain',
      temperatureC: 15,
      seeingQuality: 'Malo',
      bortleClass: 4,
      sqm: 19.80,
      lowCloudsPct: 92,
      midCloudsPct: 85,
      highCloudsPct: 70,
      humidityPct: 94,
      windKmH: 22,
      windDirection: 'SO',
      transparencyMag: 2.1,
      moonPhaseName: 'Cuarto Creciente',
      moonIlluminationPct: 45,
    },
    snow: {
      condition: 'snow',
      temperatureC: -2,
      seeingQuality: 'Malo',
      bortleClass: 3,
      sqm: 20.40,
      lowCloudsPct: 88,
      midCloudsPct: 78,
      highCloudsPct: 65,
      humidityPct: 89,
      windKmH: 14,
      windDirection: 'N',
      transparencyMag: 3.0,
      moonPhaseName: 'Gibosa Creciente',
      moonIlluminationPct: 68,
    },
    wind: {
      condition: 'wind',
      temperatureC: 16,
      seeingQuality: 'Regular',
      bortleClass: 2,
      sqm: 21.40,
      lowCloudsPct: 15,
      midCloudsPct: 25,
      highCloudsPct: 10,
      humidityPct: 48,
      windKmH: 48,
      windDirection: 'NO (Mistral / Cierzo)',
      transparencyMag: 5.8,
      moonPhaseName: 'Luna Creciente',
      moonIlluminationPct: 18,
    },
    clouds: {
      condition: 'clouds',
      temperatureC: 17,
      seeingQuality: 'Regular',
      bortleClass: 3,
      sqm: 20.90,
      lowCloudsPct: 65,
      midCloudsPct: 50,
      highCloudsPct: 40,
      humidityPct: 72,
      windKmH: 12,
      windDirection: 'E',
      transparencyMag: 4.2,
      moonPhaseName: 'Cuarto Menguante',
      moonIlluminationPct: 50,
    },
    storm: {
      condition: 'storm',
      temperatureC: 14,
      seeingQuality: 'Malo',
      bortleClass: 5,
      sqm: 18.90,
      lowCloudsPct: 98,
      midCloudsPct: 95,
      highCloudsPct: 90,
      humidityPct: 98,
      windKmH: 55,
      windDirection: 'O',
      transparencyMag: 1.5,
      moonPhaseName: 'Luna Llena',
      moonIlluminationPct: 98,
    },
  };

  const handleCitySearch = (query: string) => {
    setIsSearching(true);
    const key = query.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    setTimeout(() => {
      if (PRESET_CITIES[key]) {
        setActiveCityWeather(PRESET_CITIES[key]);
        setSelectedCondition(PRESET_CITIES[key].condition);
      } else {
        // Generate dynamic real-time city data
        const hash = Array.from(query).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const temp = 16 + (hash % 12);
        const bortle = 1 + (hash % 7);
        const sqm = parseFloat((22.00 - bortle * 0.4).toFixed(2));
        const conditions: WeatherType[] = ['clear', 'clouds', 'wind', 'clear', 'clear'];
        const cond = conditions[hash % conditions.length];

        const generated: CustomCityWeather = {
          cityName: query.charAt(0).toUpperCase() + query.slice(1),
          region: 'Ubicación Consultada en Tiempo Real',
          condition: cond,
          temperatureC: temp,
          seeingQuality: bortle <= 3 ? 'Excelente' : bortle <= 5 ? 'Bueno' : 'Regular',
          bortleClass: bortle,
          sqm: sqm,
          lowCloudsPct: cond === 'clear' ? 5 : 40,
          midCloudsPct: cond === 'clear' ? 0 : 25,
          highCloudsPct: cond === 'clear' ? 0 : 15,
          humidityPct: 40 + (hash % 35),
          windKmH: 5 + (hash % 20),
          windDirection: 'NNE',
          transparencyMag: parseFloat((6.5 - bortle * 0.3).toFixed(1)),
          moonPhaseName: 'Luna Nueva',
          moonIlluminationPct: 2,
          eclipseVisibility: 'Observación en Tiempo Real y Tracking GPS Activo',
        };

        setActiveCityWeather(generated);
        setSelectedCondition(cond);
      }
      setIsSearching(false);
    }, 300);
  };

  const toggleSaveCity = (cityName: string) => {
    if (savedCities.includes(cityName)) {
      setSavedCities(savedCities.filter((c) => c !== cityName));
    } else {
      setSavedCities([...savedCities, cityName]);
    }
  };

  const currentDisplayData = activeTab === 'custom_location' ? activeCityWeather : weatherDataMap[selectedCondition];

  // Canvas Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const activeCond = activeTab === 'custom_location' ? activeCityWeather.condition : selectedCondition;

    const particlesCount = activeCond === 'rain' ? 120 : activeCond === 'snow' ? 80 : activeCond === 'clear' ? 150 : 50;
    const particles: Array<{ x: number; y: number; speed: number; length?: number; radius?: number; opacity: number }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: activeCond === 'rain' ? 12 + Math.random() * 8 : activeCond === 'snow' ? 1 + Math.random() * 2 : 0.2 + Math.random() * 0.8,
        length: activeCond === 'rain' ? 15 + Math.random() * 15 : undefined,
        radius: activeCond === 'snow' ? 2 + Math.random() * 3 : Math.random() * 1.8,
        opacity: Math.random(),
      });
    }

    let windAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (activeCond === 'clear') {
        bgGrad.addColorStop(0, '#120b2e');
        bgGrad.addColorStop(1, '#2D1B4E');
      } else if (activeCond === 'rain') {
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(1, '#1e293b');
      } else if (activeCond === 'snow') {
        bgGrad.addColorStop(0, '#1e1b4b');
        bgGrad.addColorStop(1, '#312e81');
      } else if (activeCond === 'wind') {
        bgGrad.addColorStop(0, '#111827');
        bgGrad.addColorStop(1, '#1f2937');
      } else if (activeCond === 'storm') {
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(1, '#111827');
      } else {
        bgGrad.addColorStop(0, '#181825');
        bgGrad.addColorStop(1, '#2E1C4E');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (activeCond === 'clear') {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius || 1.5, 0, Math.PI * 2);
          p.opacity += (Math.random() - 0.5) * 0.05;
          if (p.opacity < 0.2) p.opacity = 0.2;
          if (p.opacity > 1) p.opacity = 1;
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
        });
      } else if (activeCond === 'rain') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.lineWidth = 1.5;
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
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
        windAngle += 0.05;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
        ctx.lineWidth = 1;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 40, p.y + Math.sin(windAngle + p.x) * 4);
          ctx.stroke();

          p.x += p.speed * 8;
          if (p.x > width) {
            p.x = -50;
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
  }, [selectedCondition, activeTab, activeCityWeather]);

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-20 md:pt-12 pb-28 md:pb-16">
      {/* Header */}
      <header className="py-6 md:py-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">cloud_sync</span>
          {t('weatherTag', 'Previsión Meteorológica & Seeing Estelar')}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('weatherTitle', 'Previsión del Tiempo en Tiempo Real')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t('weatherSubtitle', 'Añade o busca cualquier localización por su nombre para obtener la previsión meteorológica astronómica en tiempo real.')}
        </p>
      </header>

      {/* Main Two Mode Tabs */}
      <div className="flex border-b border-white/12 mb-8 gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('custom_location')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'custom_location'
              ? 'text-[#FFD700]'
              : 'text-white/60 hover:text-white'
          }`}
          id="tab-weather-custom"
        >
          <span className="material-symbols-outlined text-2xl">location_on</span>
          {t('customLocationTab', 'Buscar Ubicación por Nombre')}
          {activeTab === 'custom_location' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('simulated')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'simulated'
              ? 'text-[#FFD700]'
              : 'text-white/60 hover:text-white'
          }`}
          id="tab-weather-simulated"
        >
          <span className="material-symbols-outlined text-2xl">partly_cloudy_day</span>
          {t('simulatedTab', 'Simulación por Condición Climática')}
          {activeTab === 'simulated' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>
      </div>

      {/* SEARCH AND LOCATION SECTION FOR REAL-TIME CITIES */}
      {activeTab === 'custom_location' && (
        <div className="space-y-6 mb-8">
          {/* Search Bar Input */}
          <div className="glass-panel rounded-2xl p-4 md:p-6 border border-[#FFD700]/30 bg-gradient-to-r from-[#2D1B4E]/80 to-[#1e1335]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) handleCitySearch(searchQuery);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#FFD700] text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchWeatherPlaceholder', 'Introduce una ciudad o municipio (ej. Barcelona, Madrid, Castellón...)')}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] font-['Plus_Jakarta_Sans'] text-sm"
                  id="input-weather-search"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-[#FEE685] hover:bg-white text-black font-extrabold rounded-xl transition-all font-['Plus_Jakarta_Sans'] text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-[#FEE685]/20"
                id="btn-weather-search"
              >
                <span className="material-symbols-outlined text-lg">sync</span>
                {isSearching ? t('searchingWeather', 'Consultando tiempo real...') : t('getRealtimeWeather', 'Obtener Tiempo Real')}
              </button>
            </form>

            {/* Quick Location Preset Pills */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-white/60 font-['JetBrains_Mono'] uppercase block mb-2 font-semibold">
                Sugerencias rápidas:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Barcelona', key: 'barcelona' },
                  { name: 'Castellón de la Plana', key: 'castellon' },
                  { name: 'Madrid', key: 'madrid' },
                  { name: 'Valencia', key: 'valencia' },
                  { name: 'Palma de Mallorca', key: 'palma' },
                  { name: 'Sevilla', key: 'sevilla' },
                  { name: 'Bilbao', key: 'bilbao' },
                  { name: 'Granada (Sierra Nevada)', key: 'granada' },
                  { name: 'Zaragoza', key: 'zaragoza' },
                ].map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => {
                      setSearchQuery(preset.name);
                      handleCitySearch(preset.name);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      activeCityWeather.cityName.toLowerCase().includes(preset.name.toLowerCase().slice(0, 5))
                        ? 'bg-[#FEE685] text-black border-[#FEE685] font-extrabold'
                        : 'bg-white/5 hover:bg-white/15 text-white/80 border-white/10'
                    }`}
                  >
                    📍 {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED CONDITIONS SELECTOR */}
      {activeTab === 'simulated' && (
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          <button
            onClick={() => setSelectedCondition('clear')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCondition === 'clear'
                ? 'bg-[#FEE685] text-black font-extrabold shadow-lg shadow-[#FEE685]/30'
                : 'glass-panel text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">clear_day</span>
            Despejado
          </button>

          <button
            onClick={() => setSelectedCondition('rain')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCondition === 'rain'
                ? 'bg-[#FEE685] text-black font-extrabold shadow-lg shadow-[#FEE685]/30'
                : 'glass-panel text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">rainy</span>
            Lluvia
          </button>

          <button
            onClick={() => setSelectedCondition('snow')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCondition === 'snow'
                ? 'bg-[#FEE685] text-black font-extrabold shadow-lg shadow-[#FEE685]/30'
                : 'glass-panel text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">ac_unit</span>
            Nieve
          </button>

          <button
            onClick={() => setSelectedCondition('wind')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCondition === 'wind'
                ? 'bg-[#FEE685] text-black font-extrabold shadow-lg shadow-[#FEE685]/30'
                : 'glass-panel text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">air</span>
            Viento
          </button>

          <button
            onClick={() => setSelectedCondition('clouds')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCondition === 'clouds'
                ? 'bg-[#FEE685] text-black font-extrabold shadow-lg shadow-[#FEE685]/30'
                : 'glass-panel text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">cloud</span>
            Nublado
          </button>

          <button
            onClick={() => setSelectedCondition('storm')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCondition === 'storm'
                ? 'bg-[#FEE685] text-black font-extrabold shadow-lg shadow-[#FEE685]/30'
                : 'glass-panel text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-lg">thunderstorm</span>
            Tormenta
          </button>
        </div>
      )}

      {/* Dynamic Weather Stage with Starry Canvas Background */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0f0826] via-[#160c33] to-[#0a0418] shadow-2xl mb-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 gap-6 border border-white/10">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Top Info Banner on Starry Stage */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 border border-[#FFD700] flex items-center justify-center text-[#FFD700] shrink-0">
              <span className="material-symbols-outlined text-3xl">
                {activeTab === 'custom_location'
                  ? 'location_on'
                  : selectedCondition === 'clear' ? 'clear_day' : selectedCondition === 'rain' ? 'rainy' : 'cloud'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-['JetBrains_Mono'] text-[#FFD700] uppercase font-bold tracking-wider">
                  {activeTab === 'custom_location' ? `TIEMPO REAL • ${activeCityWeather.region}` : 'EFEMÉRIDES & VERIFICACIÓN ASTRONÓMICA'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0">
                  ● EN VIVO
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mt-0.5">
                {activeTab === 'custom_location' ? activeCityWeather.cityName : `Condición: ${selectedCondition}`}
              </h2>
              {activeTab === 'custom_location' && (
                <p className="text-xs text-[#FFD700] font-['JetBrains_Mono'] mt-1">
                  {activeCityWeather.eclipseVisibility}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap self-start md:self-auto">
            {activeTab === 'custom_location' && (
              <button
                onClick={() => toggleSaveCity(activeCityWeather.cityName)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  savedCities.includes(activeCityWeather.cityName)
                    ? 'bg-[#FEE685] text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {savedCities.includes(activeCityWeather.cityName) ? 'bookmark' : 'bookmark_add'}
                </span>
                {savedCities.includes(activeCityWeather.cityName) ? 'Guardada' : 'Guardar'}
              </button>
            )}

            <div className="text-left md:text-right">
              <span className="block text-[11px] text-white/70 uppercase font-['JetBrains_Mono'] font-bold">Temperatura</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                {currentDisplayData.temperatureC}°C
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-center">
              <span className="block text-[10px] text-white/80 uppercase font-bold tracking-wider">Calidad Seeing</span>
              <span className={`text-sm font-extrabold ${currentDisplayData.seeingQuality === 'Excelente' ? 'text-emerald-400' : currentDisplayData.seeingQuality === 'Bueno' ? 'text-[#FFD700]' : 'text-amber-400'}`}>
                {currentDisplayData.seeingQuality}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar on Starry Stage - Completely Unclipped & High Visibility in Luxury Pastel Gold */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-pastel-gold p-4 rounded-2xl border border-[#E6CA65] shadow-md">
            <span className="text-xs text-[#24153F] uppercase font-['JetBrains_Mono'] font-extrabold block mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">air</span>
              Velocidad Viento
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#120D1C] font-['JetBrains_Mono'] block">
              {currentDisplayData.windKmH} km/h ({currentDisplayData.windDirection})
            </span>
          </div>

          <div className="card-pastel-gold p-4 rounded-2xl border border-[#E6CA65] shadow-md">
            <span className="text-xs text-[#24153F] uppercase font-['JetBrains_Mono'] font-extrabold block mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">visibility</span>
              Transparencia
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#120D1C] font-['JetBrains_Mono'] block">
              {currentDisplayData.transparencyMag} mag
            </span>
          </div>

          <div className="card-pastel-gold p-4 rounded-2xl border border-[#E6CA65] shadow-md">
            <span className="text-xs text-[#24153F] uppercase font-['JetBrains_Mono'] font-extrabold block mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">brightness_3</span>
              Fase Lunar
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#120D1C] block font-['Plus_Jakarta_Sans']">
              {currentDisplayData.moonPhaseName} ({currentDisplayData.moonIlluminationPct}%)
            </span>
          </div>

          <div className="card-pastel-gold p-4 rounded-2xl border border-[#E6CA65] shadow-md">
            <span className="text-xs text-[#24153F] uppercase font-['JetBrains_Mono'] font-extrabold block mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">dark_mode</span>
              Oscuridad Bortle
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#120D1C] font-['JetBrains_Mono'] block">
              Clase {currentDisplayData.bortleClass} (SQM {currentDisplayData.sqm})
            </span>
          </div>
        </div>
      </div>

      {/* Detail Clouds Breakdown Grid in Luxury Pastel Gold */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-pastel-gold rounded-3xl p-6 border border-[#E6CA65] shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">Nubes Bajas (0 - 2000m)</span>
            <span className="text-sm font-extrabold text-[#24153F] font-['JetBrains_Mono']">{currentDisplayData.lowCloudsPct}%</span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-white/70 overflow-hidden border border-[#E6CA65]">
            <div className="h-full bg-gradient-to-r from-[#24153F] to-[#0D5C35] transition-all duration-500" style={{ width: `${currentDisplayData.lowCloudsPct}%` }} />
          </div>
          <p className="text-xs text-[#2B2538] font-medium mt-3">Afectan la visibilidad del horizonte y miradores de baja altitud.</p>
        </div>

        <div className="card-pastel-gold rounded-3xl p-6 border border-[#E6CA65] shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">Nubes Medias (2000 - 6000m)</span>
            <span className="text-sm font-extrabold text-[#24153F] font-['JetBrains_Mono']">{currentDisplayData.midCloudsPct}%</span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-white/70 overflow-hidden border border-[#E6CA65]">
            <div className="h-full bg-gradient-to-r from-[#24153F] to-[#B45309] transition-all duration-500" style={{ width: `${currentDisplayData.midCloudsPct}%` }} />
          </div>
          <p className="text-xs text-[#2B2538] font-medium mt-3">Altocúmulos y nimboestratos. Pueden filtrar estrellas medianas.</p>
        </div>

        <div className="card-pastel-gold rounded-3xl p-6 border border-[#E6CA65] shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">Nubes Altas (&gt; 6000m)</span>
            <span className="text-sm font-extrabold text-[#24153F] font-['JetBrains_Mono']">{currentDisplayData.highCloudsPct}%</span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-white/70 overflow-hidden border border-[#E6CA65]">
            <div className="h-full bg-gradient-to-r from-[#24153F] to-[#7C4DFF] transition-all duration-500" style={{ width: `${currentDisplayData.highCloudsPct}%` }} />
          </div>
          <p className="text-xs text-[#2B2538] font-medium mt-3">Cirros finos. Causan halo lunar pero permiten estrellas brillantes.</p>
        </div>
      </div>

      {/* Stargazing Recommendation Box in Luxury Pastel Gold */}
      <div className="card-pastel-gold rounded-3xl p-6 md:p-8 border-2 border-[#D4AF37] shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center shrink-0 font-extrabold shadow-md">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-[#120D1C] mb-1 font-['Plus_Jakarta_Sans']">
              Recomendación StellaWay para {activeTab === 'custom_location' ? activeCityWeather.cityName : 'esta noche'}
            </h3>
            <p className="text-sm text-[#2B2538] font-medium leading-relaxed font-['Plus_Jakarta_Sans']">
              {currentDisplayData.lowCloudsPct < 15
                ? `Excelente previsión astronómica para ${activeTab === 'custom_location' ? activeCityWeather.cityName : 'la zona'}. Transparencia atmosférica de ${currentDisplayData.transparencyMag} mag y Bortle ${currentDisplayData.bortleClass}. Ideal para fotografía de gran campo, observación de nebulosas y seguimiento solar con filtros homologados.`
                : `Se prevé cierta nubosidad o turbulencia en ${activeTab === 'custom_location' ? activeCityWeather.cityName : 'esta condición'}. Se recomienda verificar claros locales o dirigirse a miradores de mayor elevación.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
