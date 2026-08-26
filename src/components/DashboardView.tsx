import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import eclipseImg from '../assets/images/eclipse_total_2026_1787656886887.jpg';
import milkyWayImg from '../assets/images/milky_way_sky_1787656902205.jpg';

interface DashboardViewProps {
  nightVision: boolean;
  setNightVision: React.Dispatch<React.SetStateAction<boolean>>;
  onExploreSpots?: () => void;
  onExploreEvents?: () => void;
  onExploreWeather?: () => void;
  openModal?: (type: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  nightVision,
  setNightVision,
  onExploreSpots,
  onExploreEvents,
  onExploreWeather,
  openModal,
}) => {
  const { t } = useLanguage();
  // Real dynamic countdown to August 2, 2027 10:10 UTC (The Great Eclipse of the Century)
  const [timeLeft, setTimeLeft] = useState({ days: 342, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const eclipseDate = new Date('2027-08-02T10:10:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = eclipseDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow pt-4 md:pt-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-8 md:gap-12 pb-28 md:pb-16">
      {/* Hero: Eclipse Countdown Timer */}
      <section className="flex flex-col items-center justify-center text-center pt-2 md:pt-4">
        <div className="mb-5 md:mb-7 flex flex-col items-center gap-2.5">
          <span className="font-['JetBrains_Mono'] text-xs md:text-sm text-[#FFD700] uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            {t('grandEclipse', 'Gran Eclipse Solar Total 2027')}
          </span>

          <div className="flex items-center gap-2 bg-[#24153F]/80 rounded-full px-4 py-1.5 border border-[#FEE685]/30 backdrop-blur-md shadow-md">
            <span className="material-symbols-outlined text-base text-[#FEE685]">
              location_on
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] md:text-xs text-[#FFF8D6] uppercase tracking-wider font-bold">
              {t('foco', 'Foco: Castellón & Arco Mediterráneo')}
            </span>
          </div>
        </div>

        {/* Ring Countdown Widget */}
        <div className="eclipse-ring my-2" style={{ '--progress': '78%' } as React.CSSProperties}>
          <div className="eclipse-content flex flex-col gap-1 md:gap-2">
            <span
              className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_14px_rgba(255,255,255,0.85)]"
              id="countdown-timer"
            >
              {timeLeft.days}:{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="font-['JetBrains_Mono'] text-xs md:text-sm text-[#FFD700] tracking-[0.25em] font-bold uppercase drop-shadow">
              {t('daysHoursMin', 'DÍAS : HRS : MIN')}
            </span>
          </div>
        </div>

        {/* THREE PRIMARY ACTION BUTTONS (Semi-Transparent Celestial Sky Blue Glass) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-4xl w-full mx-auto">
          {/* Button 1: Buscar localización (Semi-Transparent Sky Blue) */}
          <button
            onClick={() => onExploreSpots && onExploreSpots()}
            className="p-6 rounded-3xl card-celestial-blue-glass transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xl relative overflow-hidden backdrop-blur-md"
            id="btn-main-spots"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#082F49]/80 backdrop-blur-sm flex items-center justify-center text-[#7DD3FC] mb-3.5 group-hover:scale-110 transition-transform shadow-lg border border-[#38BDF8]/60">
              <span className="material-symbols-outlined text-2xl font-bold">near_me</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {t('spots', 'Buscar localización')}
            </span>
            <span className="text-xs text-[#BAE6FD] mt-1.5 font-bold">
              {t('mapGps', 'Mapa terráqueo & GPS')}
            </span>
            <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[#F0F9FF] bg-[#0284C7]/80 group-hover:bg-[#0284C7] px-3.5 py-1 rounded-full border border-[#7DD3FC]/60 shadow-sm backdrop-blur-sm">
              {t('exploreSpotsBadge', 'Explorar Miradores →')}
            </span>
          </button>

          {/* Button 2: Evento estelar (Semi-Transparent Sky Blue) */}
          <button
            onClick={() => onExploreEvents && onExploreEvents()}
            className="p-6 rounded-3xl card-celestial-blue-glass transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xl relative overflow-hidden backdrop-blur-md"
            id="btn-main-events"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#082F49]/80 backdrop-blur-sm flex items-center justify-center text-[#7DD3FC] mb-3.5 group-hover:scale-110 transition-transform shadow-lg border border-[#38BDF8]/60">
              <span className="material-symbols-outlined text-2xl font-bold">flare</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {t('events', 'Evento estelar')}
            </span>
            <span className="text-xs text-[#BAE6FD] mt-1.5 font-bold">
              {t('planetaryEnergy', 'Energía planetaria & Eclipses')}
            </span>
            <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[#F0F9FF] bg-[#0284C7]/80 group-hover:bg-[#0284C7] px-3.5 py-1 rounded-full border border-[#7DD3FC]/60 shadow-sm backdrop-blur-sm">
              {t('viewCalendarBadge', 'Ver Calendario →')}
            </span>
          </button>

          {/* Button 3: Previsión del tiempo (Semi-Transparent Sky Blue) */}
          <button
            onClick={() => onExploreWeather && onExploreWeather()}
            className="p-6 rounded-3xl card-celestial-blue-glass transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xl relative overflow-hidden backdrop-blur-md"
            id="btn-main-weather"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#082F49]/80 backdrop-blur-sm flex items-center justify-center text-[#7DD3FC] mb-3.5 group-hover:scale-110 transition-transform shadow-lg border border-[#38BDF8]/60">
              <span className="material-symbols-outlined text-2xl font-bold">cloud_sync</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {t('weather', 'Previsión del tiempo')}
            </span>
            <span className="text-xs text-[#BAE6FD] mt-1.5 font-bold">
              {t('realtimeAnim', 'Tiempo real & Animación')}
            </span>
            <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[#F0F9FF] bg-[#0284C7]/80 group-hover:bg-[#0284C7] px-3.5 py-1 rounded-full border border-[#7DD3FC]/60 shadow-sm backdrop-blur-sm">
              {t('checkSkyBadge', 'Consultar Cielo →')}
            </span>
          </button>
        </div>
      </section>

      {/* Visual Celestial Showcase Cards: Eclipse de Agosto 2026 & Vía Láctea */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        {/* Card 1: Gran Eclipse Solar Total 2027 */}
        <div className="relative rounded-3xl overflow-hidden border border-[#FEE685]/40 shadow-2xl bg-[#170E28]/90 backdrop-blur-xl group hover:border-[#FEE685] transition-all">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <img
              src={eclipseImg}
              alt="Gran Eclipse Solar Total 2027 Corona"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#170E28] via-[#170E28]/40 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="bg-[#130B22]/90 border border-[#FEE685] text-[#FEE685] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">wb_twilight</span>
                {t('eclipseCardBadge', 'Eclipse del Siglo • Totalidad >4 min')}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-3 -mt-6 relative z-10">
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-extrabold text-white leading-tight">
              {t('eclipseCardTitle', 'El Gran Eclipse del Siglo: 2 de Agosto de 2027')}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {t('eclipseCardDesc', 'Conocido como el mayor eclipse total de nuestra era por su extraordinaria duración (más de 4 minutos y medio en el sur de España). Franja de totalidad sobre Andalucía: Cádiz, Tarifa, Málaga, Granada, Almería y el Estrecho de Gibraltar (10:10 UTC).')}
            </p>
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onExploreEvents && onExploreEvents()}
                className="px-4 py-2.5 bg-gradient-to-r from-[#FEE685] to-[#E5B54F] hover:from-white hover:to-[#FEE685] text-[#120D1C] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>{t('viewEclipseGuide', 'Ver Información y Ruta del Eclipse 2027 →')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Vía Láctea & Lluvia de Estrellas */}
        <div className="relative rounded-3xl overflow-hidden border border-[#38BDF8]/40 shadow-2xl bg-[#0F172A]/90 backdrop-blur-xl group hover:border-[#38BDF8] transition-all">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <img
              src={milkyWayImg}
              alt="Vía Láctea y Lluvia de Estrellas"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="bg-[#082F49]/90 border border-[#38BDF8] text-[#7DD3FC] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                {t('milkyWayCardBadge', 'Cielos Prístinos Bortle 1-3')}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-3 -mt-6 relative z-10">
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-extrabold text-white leading-tight">
              {t('milkyWayCardTitle', 'Vía Láctea & Lluvia de Estrellas (Perseidas)')}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {t('milkyWayCardDesc', 'Explora miradores astronómicos libres de contaminación lumínica para contemplar el brazo de Sagitario, la Vía Láctea y las Lágrimas de San Lorenzo.')}
            </p>
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onExploreSpots && onExploreSpots()}
                className="px-4 py-2.5 bg-gradient-to-r from-[#7DD3FC] to-[#38BDF8] hover:from-white hover:to-[#7DD3FC] text-[#082F49] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>{t('viewMilkyWaySpots', 'Ver Miradores de Cielo Oscuro →')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAB: Night Vision Toggle */}
      <button
        onClick={() => setNightVision((prev) => !prev)}
        className={`fixed bottom-24 right-6 w-14 h-14 rounded-full backdrop-blur-md border shadow-2xl flex items-center justify-center transition-all z-40 group ${
          nightVision
            ? 'bg-[#FF3B30] border-white text-white shadow-[0_0_25px_rgba(255,59,48,0.8)] scale-110'
            : 'bg-[#FF3B30]/20 border-[#FF3B30]/50 text-[#FF3B30] hover:bg-[#FF3B30]/30 shadow-[0_0_20px_rgba(255,59,48,0.3)]'
        }`}
        title={nightVision ? t('redLightActive', 'Desactivar Luz Roja') : t('redLight', 'Activar Modo Luz Roja (Visión Nocturna)')}
        id="btn-fab-night-vision"
      >
        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
          {nightVision ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
};
