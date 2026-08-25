import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

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
  // Real dynamic countdown to August 12, 2026 19:30 UTC (Great Solar Eclipse Total in Spain)
  const [timeLeft, setTimeLeft] = useState({ days: 482, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const eclipseDate = new Date('2026-08-12T19:30:00Z').getTime();

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
      <section className="flex flex-col items-center justify-center text-center pt-4 md:pt-8">
        <div className="mb-6 md:mb-8 flex flex-col items-center gap-3">
          <span className="font-['JetBrains_Mono'] text-xs md:text-sm text-[#FFD700] uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
            {t('grandEclipse', 'Gran Eclipse Solar Total 2026')}
          </span>

          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/12 backdrop-blur-md">
            <span className="material-symbols-outlined text-base text-[#FFD700]">
              location_on
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] md:text-xs text-[#e1e3e4]/80 uppercase tracking-wider font-semibold">
              {t('foco', 'Foco: Castellón & Arco Mediterráneo')}
            </span>
          </div>
        </div>

        {/* Ring Countdown Widget */}
        <div className="eclipse-ring my-2" style={{ '--progress': '78%' } as React.CSSProperties}>
          <div className="eclipse-content flex flex-col gap-1 md:gap-2">
            <span
              className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              id="countdown-timer"
            >
              {timeLeft.days}:{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="font-['JetBrains_Mono'] text-xs md:text-sm text-[#FFD700]/90 tracking-[0.25em] font-semibold uppercase">
              {t('daysHoursMin', 'DÍAS : HRS : MIN')}
            </span>
          </div>
        </div>

        {/* THREE PRIMARY ACTION BUTTONS ON MAIN SCREEN (Luxury Pastel Yellow with Black Letters) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-4xl w-full mx-auto">
          {/* Button 1: Buscar localización */}
          <button
            onClick={() => onExploreSpots && onExploreSpots()}
            className="p-6 rounded-3xl card-pastel-gold card-pastel-gold-hover transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xl relative overflow-hidden"
            id="btn-main-spots"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#24153F] flex items-center justify-center text-[#FEE685] mb-3.5 group-hover:scale-110 transition-transform shadow-md border border-[#FEE685]/40">
              <span className="material-symbols-outlined text-2xl font-bold">near_me</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-[#120D1C] leading-snug">
              {t('spots', 'Buscar localización')}
            </span>
            <span className="text-xs text-[#2B2538] mt-1.5 font-semibold">
              {t('mapGps', 'Mapa terráqueo & GPS')}
            </span>
            <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[#24153F] bg-[#E8D48A] px-3 py-1 rounded-full border border-[#D5BE6E]">
              Explorar Miradores →
            </span>
          </button>

          {/* Button 2: Evento estelar */}
          <button
            onClick={() => onExploreEvents && onExploreEvents()}
            className="p-6 rounded-3xl card-pastel-gold card-pastel-gold-hover transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xl relative overflow-hidden"
            id="btn-main-events"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#24153F] flex items-center justify-center text-[#FEE685] mb-3.5 group-hover:scale-110 transition-transform shadow-md border border-[#FEE685]/40">
              <span className="material-symbols-outlined text-2xl font-bold">flare</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-[#120D1C] leading-snug">
              {t('events', 'Evento estelar')}
            </span>
            <span className="text-xs text-[#2B2538] mt-1.5 font-semibold">
              {t('planetaryEnergy', 'Energía planetaria & Eclipses')}
            </span>
            <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[#24153F] bg-[#E8D48A] px-3 py-1 rounded-full border border-[#D5BE6E]">
              Ver Calendario →
            </span>
          </button>

          {/* Button 3: Previsión del tiempo */}
          <button
            onClick={() => onExploreWeather && onExploreWeather()}
            className="p-6 rounded-3xl card-pastel-gold card-pastel-gold-hover transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xl relative overflow-hidden"
            id="btn-main-weather"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#24153F] flex items-center justify-center text-[#FEE685] mb-3.5 group-hover:scale-110 transition-transform shadow-md border border-[#FEE685]/40">
              <span className="material-symbols-outlined text-2xl font-bold">cloud_sync</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-[#120D1C] leading-snug">
              {t('weather', 'Previsión del tiempo')}
            </span>
            <span className="text-xs text-[#2B2538] mt-1.5 font-semibold">
              {t('realtimeAnim', 'Tiempo real & Animación')}
            </span>
            <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[#24153F] bg-[#E8D48A] px-3 py-1 rounded-full border border-[#D5BE6E]">
              Consultar Cielo →
            </span>
          </button>
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
