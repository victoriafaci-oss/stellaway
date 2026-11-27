import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CalendarConfirmModal } from './CalendarConfirmModal';
import { CalendarEventPayload } from '../lib/calendar';
import eclipseImg from '../assets/images/eclipse_total_2026_1787656886887.jpg';

interface Eclipse2027ViewProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
  onExploreSpots?: () => void;
  onExploreWeather?: () => void;
  onExploreShop?: () => void;
}

type EclipseSectionFilter = 'all' | 'route' | 'schedule' | 'safety' | 'physics' | 'planning';

interface TrajectoryCity {
  id: string;
  city: string;
  country: string;
  flag: string;
  regionTag: string;
  durationNote: string;
  climateNote: string;
  highlight?: boolean;
  xPct: number;
  yPct: number;
  coords: string;
}

export const Eclipse2027View: React.FC<Eclipse2027ViewProps> = ({
  onGoBack,
  onGoHome,
  onExploreSpots,
  onExploreWeather,
  onExploreShop,
}) => {
  const { t, language } = useLanguage();
  const { user, signIn, syncEventToCalendar } = useAuth();

  const trajectoryCities = useMemo<TrajectoryCity[]>(
    () => [
      {
        id: 'cadiz',
        city: t('ec27CityCadizName', 'Cádiz & Tarifa'),
        country: t('ec27CityCadizCountry', 'España'),
        flag: '🇪🇸',
        regionTag: t('ec27CityCadizRegion', 'Extremo sur de Andalucía & Gibraltar'),
        durationNote: t(
          'ec27CityCadizDur',
          '>4 min 30 s de totalidad · Parcial ~08:32 WEST · Totalidad ~10:44–10:53 CEST'
        ),
        climateNote: t(
          'ec27CityCadizClimate',
          'Posibles brumas matinales en costa; el interior andaluz ofrece mayor probabilidad de cielo despejado.'
        ),
        highlight: true,
        xPct: 12,
        yPct: 33,
        coords: '36.01°N, 5.60°W',
      },
      {
        id: 'tanger',
        city: t('ec27CityTangerName', 'Tánger'),
        country: t('ec27CityTangerCountry', 'Marruecos'),
        flag: '🇲🇦',
        regionTag: t('ec27CityTangerRegion', 'Estrecho de Gibraltar · Norte de África'),
        durationNote: t(
          'ec27CityTangerDur',
          'Franja central cruzando del Atlántico al Rif y las reservas del Atlas'
        ),
        climateNote: t(
          'ec27CityTangerClimate',
          'Buen cielo veraniego; excelente plan B por carretera hacia el interior si hay nubes en la costa andaluza.'
        ),
        xPct: 14,
        yPct: 38,
        coords: '35.76°N, 5.83°W',
      },
      {
        id: 'oran',
        city: t('ec27CityOranName', 'Orán'),
        country: t('ec27CityOranCountry', 'Argelia'),
        flag: '🇩🇿',
        regionTag: t('ec27CityOranRegion', 'Costa Mediterránea Occidental'),
        durationNote: t('ec27CityOranDur', 'Más de 5 min cerca del eje central de la umbra'),
        climateNote: t(
          'ec27CityOranClimate',
          'Clima mediterráneo seco en agosto con alta insolación matinal.'
        ),
        xPct: 24,
        yPct: 39,
        coords: '35.70°N, 0.63°W',
      },
      {
        id: 'sfax',
        city: t('ec27CitySfaxName', 'Sfax'),
        country: t('ec27CitySfaxCountry', 'Túnez'),
        flag: '🇹🇳',
        regionTag: t('ec27CitySfaxRegion', 'Costa Centro-Oriental de Túnez'),
        durationNote: t('ec27CitySfaxDur', 'Más de 5 min 40 s de totalidad sobre el Golfo de Gabés'),
        climateNote: t(
          'ec27CitySfaxClimate',
          'Destino alternativo destacado en el Mediterráneo central con cielos habitualmente limpios en agosto.'
        ),
        xPct: 37,
        yPct: 43,
        coords: '34.74°N, 10.76°E',
      },
      {
        id: 'bengasi',
        city: t('ec27CityBengasiName', 'Bengasi'),
        country: t('ec27CityBengasiCountry', 'Libia'),
        flag: '🇱🇾',
        regionTag: t('ec27CityBengasiRegion', 'Cirenaica · Norte de África'),
        durationNote: t('ec27CityBengasiDur', 'Cerca de 6 min de totalidad entrando hacia el desierto libio'),
        climateNote: t(
          'ec27CityBengasiClimate',
          'Cielos muy despejados en el desierto, aunque requiere revisar advertencias oficiales de viaje.'
        ),
        xPct: 50,
        yPct: 50,
        coords: '32.12°N, 20.07°E',
      },
      {
        id: 'luxor',
        city: t('ec27CityLuxorName', 'Luxor (Máximo Eclipse)'),
        country: t('ec27CityLuxorCountry', 'Egipto'),
        flag: '🇪🇬',
        regionTag: t('ec27CityLuxorRegion', 'Valle del Nilo · Máximo Mundial'),
        durationNote: t('ec27CityLuxorDur', '6 min 23 s de totalidad máxima (≈25.5°N, 33.2°E) · 10:06:40 UTC'),
        climateNote: t(
          'ec27CityLuxorClimate',
          'Desierto oriental: probabilidad altísima de cielo completamente despejado y calor extremo de agosto.'
        ),
        highlight: true,
        xPct: 68,
        yPct: 65,
        coords: '25.50°N, 33.20°E',
      },
      {
        id: 'jeddah',
        city: t('ec27CityJeddahName', 'Jeddah'),
        country: t('ec27CityJeddahCountry', 'Arabia Saudita'),
        flag: '🇸🇦',
        regionTag: t('ec27CityJeddahRegion', 'Costa del Mar Rojo · Medio Oriente'),
        durationNote: t(
          'ec27CityJeddahDur',
          'Más de 5 min 50 s de totalidad antes de cruzar hacia Yemen y Somalia'
        ),
        climateNote: t(
          'ec27CityJeddahClimate',
          'Cielos desérticos despejados sobre la península arábiga; preparar hidratación y protección solar.'
        ),
        xPct: 82,
        yPct: 74,
        coords: '21.49°N, 39.19°E',
      },
    ],
    [t, language]
  );

  const globalContacts = useMemo(
    () => [
      {
        code: 'C1',
        title: t('ec27ContactC1Title', 'Inicio del Eclipse Parcial'),
        utc: '07:30:11 UTC',
        detail: t('ec27ContactC1Detail', 'Primer contacto de la penumbra lunar sobre la Tierra.'),
        tone: 'sky',
      },
      {
        code: 'C2',
        title: t('ec27ContactC2Title', 'Inicio de la Totalidad'),
        utc: '08:23:29 UTC',
        detail: t('ec27ContactC2Detail', 'Primer punto terrestre donde la umbra cubre el 100% del Sol.'),
        tone: 'amber',
      },
      {
        code: t('ec27ContactMaxCode', 'MÁX'),
        title: t('ec27ContactMaxTitle', 'Máximo del Eclipse'),
        utc: '10:06:40 UTC',
        detail: t('ec27ContactMaxDetail', '6 min 23 s cerca de Luxor (25.5°N, 33.2°E) · Magnitud 1.0790.'),
        tone: 'gold',
      },
      {
        code: 'C3',
        title: t('ec27ContactC3Title', 'Fin de la Totalidad'),
        utc: '11:49:54 UTC',
        detail: t('ec27ContactC3Detail', 'Último lugar de la franja en despedir la fase total.'),
        tone: 'amber',
      },
      {
        code: 'C4',
        title: t('ec27ContactC4Title', 'Fin del Eclipse Parcial'),
        utc: '12:43:10 UTC',
        detail: t('ec27ContactC4Detail', 'Último contacto lunar al salir la penumbra del planeta.'),
        tone: 'sky',
      },
    ],
    [t, language]
  );

  const checklistItems = useMemo(
    () => [
      {
        id: 'iso_glasses',
        category: t('ec27Check1Cat', 'Seguridad'),
        label: t('ec27Check1Label', 'Gafas de eclipse certificadas ISO 12312-2 (con marcado CE) y repuesto'),
      },
      {
        id: 'front_filter',
        category: t('ec27Check2Cat', 'Óptica'),
        label: t('ec27Check2Label', 'Filtro solar frontal (objetivo) para prismáticos, telescopio o cámara'),
      },
      {
        id: 'test_shots',
        category: t('ec27Check3Cat', 'Foto'),
        label: t('ec27Check3Label', 'Pruebas de exposición solar realizadas días antes (ISO 50–100, f/8–f/16)'),
      },
      {
        id: 'local_times',
        category: t('ec27Check4Cat', 'Horarios'),
        label: t('ec27Check4Label', 'Horarios C1–C4 locales exactos anotados para tu punto de observación'),
      },
      {
        id: 'hydration_sun',
        category: t('ec27Check5Cat', 'Campo'),
        label: t('ec27Check5Label', 'Agua abundante, sombrero y protección solar para el calor de agosto'),
      },
      {
        id: 'plan_b',
        category: t('ec27Check6Cat', 'Logística'),
        label: t('ec27Check6Label', 'Ubicación alternativa (Plan B) definida según previsión de nubes'),
      },
    ],
    [t, language]
  );

  const [sectionFilter, setSectionFilter] = useState<EclipseSectionFilter>('all');
  const [selectedCityId, setSelectedCityId] = useState<string>('cadiz');
  const selectedCity = trajectoryCities.find((c) => c.id === selectedCityId) || trajectoryCities[0];

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('stellaway_eclipse2027_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarPayload, setCalendarPayload] = useState<CalendarEventPayload | null>(null);
  const [calendarLink, setCalendarLink] = useState<string | null>(null);

  useEffect(() => {
    const eclipseMax = new Date('2027-08-02T10:06:40Z').getTime();
    const updateTimer = () => {
      const diff = eclipseMax - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('stellaway_eclipse2027_checklist', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const completedCount = checklistItems.filter((i) => checkedItems[i.id]).length;

  const handleSyncCalendar = async () => {
    if (!user) {
      try {
        await signIn();
      } catch {
        return;
      }
    }
    setCalendarPayload({
      summary: t('ec27CalSummary', 'Eclipse Solar Total del 2 de Agosto de 2027'),
      description: t(
        'ec27CalDesc',
        'Máximo eclipse a las 10:06:40 UTC (6m 23s cerca de Luxor; >4m 30s en Andalucía/Tarifa). Usa siempre gafas homologadas ISO 12312-2 durante las fases parciales.'
      ),
      location: t(
        'ec27CalLoc',
        'Franja de Totalidad: Andalucía (España), Norte de África y Luxor (Egipto)'
      ),
      startDateTime: '2027-08-02T07:30:11Z',
      endDateTime: '2027-08-02T12:43:10Z',
    });
    setIsCalendarModalOpen(true);
  };

  const handleConfirmCalendar = async (payload: CalendarEventPayload) => {
    const result = await syncEventToCalendar(payload);
    setCalendarLink(result.htmlLink);
    setIsCalendarModalOpen(false);
  };

  const showSection = (key: Exclude<EclipseSectionFilter, 'all'>) =>
    sectionFilter === 'all' || sectionFilter === key;

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10 pb-28 md:pb-16 space-y-8">
      <CalendarConfirmModal
        isOpen={isCalendarModalOpen}
        eventPayload={calendarPayload}
        onClose={() => setIsCalendarModalOpen(false)}
        onConfirm={handleConfirmCalendar}
      />

      {/* Top Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>{t('mcBackBtn', 'Atrás')}</span>
            </button>
          )}
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="px-3.5 py-2 rounded-xl bg-[#24153F]/80 hover:bg-[#321C58] border border-[#FEE685]/35 text-[#FEE685] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>{t('mcHomeBtn', 'Inicio')}</span>
            </button>
          )}
        </div>

        <span className="px-3 py-1 rounded-full bg-[#130B22]/90 border border-[#FEE685]/50 text-[#FEE685] font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-wider">
          {t('ec27TopPill', '2 AGOSTO 2027 • TOTALIDAD SOLAR')}
        </span>
      </div>

      {/* HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-[#FEE685]/45 bg-[#170E28]/90 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-auto min-h-[240px] overflow-hidden">
            <img
              src={eclipseImg}
              alt={t('ec27HeroImgAlt', 'Corona solar del Eclipse Solar Total del 2 de agosto de 2027')}
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#170E28] via-[#170E28]/45 to-transparent lg:from-transparent lg:via-[#170E28]/30 lg:to-[#170E28]" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#130B22]/90 border border-[#FEE685] text-[#FEE685] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md inline-flex items-center gap-1.5 shadow-lg">
                <span className="material-symbols-outlined text-sm">wb_twilight</span>
                {t('ec27HeroBadge', 'Eclipse del Siglo • Datos NASA/GSFC')}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight leading-tight">
                {t('ec27HeroTitle', 'Eclipse Solar Total del 2 de Agosto de 2027')}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#E0F2FE]/90 leading-relaxed">
                {t(
                  'ec27HeroDesc',
                  'La franja de totalidad (~258 km de ancho) recorrerá el sur de Europa, el norte de África y Medio Oriente: España (sur de Andalucía y Gibraltar), Marruecos, Argelia, Túnez, Libia, Egipto, Arabia Saudita, Yemen y Somalia.'
                )}
              </p>
            </div>

            {/* 4 Key Data Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40">
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#7DD3FC] font-bold block">
                  {t('ec27StatDurLabel', 'Duración Máx.')}
                </span>
                <span className="text-lg sm:text-xl font-black text-[#FEE685]">6m 23s</span>
                <span className="text-[10px] text-white/75 block">{t('ec27StatDurSub', 'Cerca de Luxor')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40">
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#7DD3FC] font-bold block">
                  {t('ec27StatWidthLabel', 'Ancho Franja')}
                </span>
                <span className="text-lg sm:text-xl font-black text-white">~258 km</span>
                <span className="text-[10px] text-white/75 block">{t('ec27StatWidthSub', 'Cálculo NASA/GSFC')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40">
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#7DD3FC] font-bold block">
                  {t('ec27StatMagLabel', 'Magnitud')}
                </span>
                <span className="text-lg sm:text-xl font-black text-white">1.0790</span>
                <span className="text-[10px] text-white/75 block">{t('ec27StatMagSub', '100% Sol oculto')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#24153F]/85 border border-[#FEE685]/45">
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#FEE685] font-bold block">
                  {t('ec27StatCountLabel', 'Cuenta Atrás')}
                </span>
                <span className="text-sm sm:text-base font-black text-white font-['JetBrains_Mono']">
                  {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-[10px] text-amber-200/80 block">{t('ec27StatCountSub', '10:06:40 UTC Máx.')}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {calendarLink ? (
                <a
                  href={calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{t('ec27CalSaved', 'Guardado en Google Calendar')}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleSyncCalendar}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FEE685] to-[#E5B54F] hover:from-white hover:to-[#FEE685] text-[#120D1C] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-base">calendar_add_on</span>
                  <span>{t('ec27CalAdd', 'Añadir a Google Calendar')}</span>
                </button>
              )}

              {onExploreSpots && (
                <button
                  type="button"
                  onClick={onExploreSpots}
                  className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-[#7DD3FC]/50 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-base">near_me</span>
                  <span>{t('ec27BtnSpots', 'Miradores Starlight')}</span>
                </button>
              )}

              {onExploreWeather && (
                <button
                  type="button"
                  onClick={onExploreWeather}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-white/20 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-base">cloud_sync</span>
                  <span>{t('ec27BtnWeather', 'Previsión Nubes')}</span>
                </button>
              )}

              {onExploreShop && (
                <button
                  type="button"
                  onClick={onExploreShop}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FEE685] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-[#FEE685]/35 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  <span>{t('ec27BtnShop', 'Gafas ISO & Óptica')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NAVIGATION PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: t('ec27TabAll', 'Guía Completa'), icon: 'auto_awesome' },
          { id: 'route', label: t('ec27TabRoute', 'Ruta & Ciudades'), icon: 'map' },
          { id: 'schedule', label: t('ec27TabSchedule', 'Horarios C1–C4'), icon: 'schedule' },
          { id: 'safety', label: t('ec27TabSafety', 'Seguridad & Foto'), icon: 'photo_camera' },
          { id: 'physics', label: t('ec27TabPhysics', 'Efectos Físicos'), icon: 'thermostat' },
          { id: 'planning', label: t('ec27TabPlanning', 'Planificación & Checklist'), icon: 'checklist' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSectionFilter(tab.id as EclipseSectionFilter)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              sectionFilter === tab.id
                ? 'bg-gradient-to-r from-[#FEE685] to-[#E5B54F] text-[#120D1C] shadow-md border border-[#FEE685]'
                : 'bg-[#082F49]/75 text-white/85 hover:bg-[#082F49] border border-[#38BDF8]/35'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: RUTA Y CIUDADES */}
      {showSection('route') && (
        <section className="card-pastel-gold rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#7DD3FC] font-bold">
                {t('ec27RouteKicker', 'Trayectoria Oficial · Europa, Norte de África y Medio Oriente')}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {t('ec27RouteTitle', 'Franja de Totalidad & Ciudades Principales')}
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-[#082F49]/90 border border-[#38BDF8]/50 text-[#BAE6FD] font-bold self-start sm:self-center">
              {t('ec27RouteBadge', '9 Países en la Umbra (~258 km ancho)')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#061529] border border-[#38BDF8]/40 min-h-[280px] sm:min-h-[320px] p-4 flex flex-col justify-between">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <linearGradient id="umbraBandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                    <stop offset="65%" stopColor="#FEE685" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(125,211,252,0.12)" strokeWidth="0.3" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(125,211,252,0.12)" strokeWidth="0.3" />
                <line x1="33" y1="0" x2="33" y2="100" stroke="rgba(125,211,252,0.12)" strokeWidth="0.3" />
                <line x1="66" y1="0" x2="66" y2="100" stroke="rgba(125,211,252,0.12)" strokeWidth="0.3" />
                <path
                  d="M 5 30 Q 42 40, 68 65 T 95 84"
                  fill="none"
                  stroke="url(#umbraBandGrad)"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <path
                  d="M 5 30 Q 42 40, 68 65 T 95 84"
                  fill="none"
                  stroke="#FEE685"
                  strokeWidth="0.8"
                  strokeDasharray="2 1.5"
                />
              </svg>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#BAE6FD]">
                <span>{t('ec27MapLeft', 'SUR DE EUROPA (ANDALUCÍA)')}</span>
                <span>{t('ec27MapRight', 'NORTE DE ÁFRICA → MAR ROJO')}</span>
              </div>

              <div className="relative flex-1 my-2">
                {trajectoryCities.map((c) => {
                  const isSelected = selectedCity.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCityId(c.id)}
                      style={{ left: `${c.xPct}%`, top: `${c.yPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`w-4 h-4 rounded-full border-2 border-white transition-transform ${
                            isSelected
                              ? 'bg-[#FEE685] scale-125 shadow-[0_0_16px_rgba(254,230,133,1)]'
                              : c.highlight
                              ? 'bg-amber-400 group-hover:scale-125'
                              : 'bg-[#38BDF8] group-hover:scale-125'
                          }`}
                        />
                        <span
                          className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap shadow-md ${
                            isSelected
                              ? 'bg-[#FEE685] text-[#120D1C]'
                              : 'bg-[#082F49]/95 text-white border border-white/20'
                          }`}
                        >
                          {c.flag} {c.city.split(' (')[0].split(' &')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#BAE6FD] bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                <span>{t('ec27MapHint', 'Pulsa en cada ciudad para inspeccionar su fase y duración.')}</span>
                <span className="text-[#FEE685] font-bold">{t('ec27MapAxis', 'Eje central: máx. duración')}</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#082F49]/80 border border-[#38BDF8]/45 p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-['JetBrains_Mono'] font-bold text-[#FEE685] uppercase">
                    {selectedCity.flag} {selectedCity.country}
                  </span>
                  <span className="text-[11px] font-['JetBrains_Mono'] text-[#7DD3FC]">
                    {selectedCity.coords}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white">{selectedCity.city}</h3>
                <p className="text-xs font-semibold text-[#BAE6FD] mt-0.5">{selectedCity.regionTag}</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                    <span className="text-[10px] font-bold uppercase text-[#FEE685] block mb-1">
                      {t('ec27CityDurLabel', 'Duración & Ventana de Totalidad')}
                    </span>
                    <p className="text-white font-medium leading-relaxed">{selectedCity.durationNote}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                    <span className="text-[10px] font-bold uppercase text-[#7DD3FC] block mb-1">
                      {t('ec27CityClimateLabel', 'Clima & Logística Prevista')}
                    </span>
                    <p className="text-slate-200 leading-relaxed">{selectedCity.climateNote}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold text-white/60 block mb-2">
                  {t('ec27RouteOrderLabel', 'Recorrido completo (Oeste → Este):')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {trajectoryCities.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCityId(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        selectedCity.id === c.id
                          ? 'bg-[#FEE685] text-[#120D1C]'
                          : 'bg-white/10 text-white/85 hover:bg-white/20'
                      }`}
                    >
                      {c.flag} {c.city.split(' (')[0]}
                    </button>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/15 text-amber-200 border border-amber-400/30">
                    🇾🇪 🇸🇴 {t('ec27YemenSomalia', 'Yemen · Somalia (revisar alertas)')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: HORARIOS Y CONTACTOS C1-C4 */}
      {showSection('schedule') && (
        <section className="card-pastel-gold rounded-3xl p-5 sm:p-7 space-y-5">
          <div>
            <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#FEE685] font-bold">
              {t('ec27SchedKicker', 'Cronología Astronómica Oficial')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {t('ec27SchedTitle', 'Horarios y Contactos (C1–C4) · 2 de Agosto de 2027')}
            </h2>
            <p className="text-xs sm:text-sm text-[#E0F2FE]/85 mt-1 leading-relaxed">
              {t(
                'ec27SchedIntro',
                'Los tiempos UTC globales marcan el primer y último lugar de la Tierra en presenciar cada fase. Ajusta siempre los contactos exactos a tu latitud y huso horario local.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {globalContacts.map((c) => (
              <div
                key={c.code}
                className={`p-4 rounded-2xl border backdrop-blur-sm flex flex-col justify-between gap-2 ${
                  c.tone === 'gold'
                    ? 'bg-[#24153F]/90 border-[#FEE685] shadow-lg shadow-amber-500/10'
                    : c.tone === 'amber'
                    ? 'bg-[#082F49]/85 border-amber-300/50'
                    : 'bg-[#082F49]/70 border-[#38BDF8]/40'
                }`}
              >
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black font-['JetBrains_Mono'] uppercase mb-2 ${
                      c.tone === 'gold'
                        ? 'bg-[#FEE685] text-[#120D1C]'
                        : c.tone === 'amber'
                        ? 'bg-amber-400/20 text-amber-200 border border-amber-300/40'
                        : 'bg-[#0284C7]/35 text-[#7DD3FC] border border-[#7DD3FC]/40'
                    }`}
                  >
                    {c.code}
                  </span>
                  <h3 className="text-sm font-extrabold text-white leading-snug">{c.title}</h3>
                  <div className="mt-1.5 text-base font-black font-['JetBrains_Mono'] text-[#FEE685]">
                    {c.utc}
                  </div>
                </div>
                <p className="text-[11px] text-[#E0F2FE]/85 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#130B22]/85 border border-[#FEE685]/40 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#FEE685] text-xs font-extrabold uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">schedule</span>
                <span>{t('ec27SpainRefTitle', 'Referencia Local · Suroeste de España (Andalucía / Cádiz / Tarifa / Málaga)')}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {t('ec27SpainRefDesc1', 'En el suroeste español la fase parcial arranca en torno a las')}{' '}
                <strong className="text-white">08:32 WEST</strong>,{' '}
                {t('ec27SpainRefDesc2', 'la ventana de totalidad se sitúa alrededor de')}{' '}
                <strong className="text-[#FEE685]">10:44 – 10:53 CEST</strong>{' '}
                {t('ec27SpainRefDesc3', 'y el eclipse parcial concluye sobre las')}{' '}
                <strong className="text-white">12:15 CEST</strong>.
              </p>
            </div>
            <div className="shrink-0 px-4 py-2.5 rounded-xl bg-[#082F49]/90 border border-[#38BDF8]/40 text-xs text-[#BAE6FD]">
              <span className="block font-bold text-white">{t('ec27MagTileLabel', 'Magnitud del eclipse')}</span>
              <span className="font-['JetBrains_Mono'] text-lg font-black text-[#FEE685]">1.0790</span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: SEGURIDAD OCULAR Y FOTOGRAFÍA */}
      {showSection('safety') && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-pastel-gold rounded-3xl p-5 sm:p-7 space-y-4 border-amber-300/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FEE685] text-[#120D1C] flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-2xl font-bold">visibility</span>
              </div>
              <div>
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#FEE685] font-bold">
                  {t('ec27EyeKicker', 'Norma ISO 12312-2 · NASA & AAS')}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {t('ec27EyeTitle', 'Seguridad Ocular Imprescindible')}
                </h2>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#E0F2FE]">
              <li className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#FEE685] text-lg shrink-0 mt-0.5">verified</span>
                <span>
                  <strong className="text-white">{t('ec27Eye1Bold', 'Gafas certificadas ISO 12312-2 (marcado CE):')}</strong>{' '}
                  {t('ec27Eye1Text', 'úsalas siempre antes y después de la totalidad, compradas a fabricantes reconocidos.')}
                </span>
              </li>
              <li className="p-3 rounded-2xl bg-rose-950/40 border border-rose-400/35 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-rose-300 text-lg shrink-0 mt-0.5">block</span>
                <span>
                  <strong className="text-white">{t('ec27Eye2Bold', 'Nunca uses gafas de sol comunes ni filtros caseros:')}</strong>{' '}
                  {t('ec27Eye2Text', 'tampoco uses gafas de eclipse rasgadas, rayadas o deterioradas.')}
                </span>
              </li>
              <li className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#7DD3FC] text-lg shrink-0 mt-0.5">light_mode</span>
                <span>
                  <strong className="text-white">{t('ec27Eye3Bold', 'Prueba previa en interiores:')}</strong>{' '}
                  {t('ec27Eye3Text', 'con ellas puestas no debes distinguir objetos ordinarios (salvo fuentes muy brillantes muy tenues).')}
                </span>
              </li>
              <li className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-400/35 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-300 text-lg shrink-0 mt-0.5">auto_awesome</span>
                <span>
                  <strong className="text-white">{t('ec27Eye4Bold', 'Solo sin gafas durante la totalidad:')}</strong>{' '}
                  {t('ec27Eye4Text', 'únicamente cuando el Sol esté 100% oculto puedes retirarlas para contemplar la corona.')}
                </span>
              </li>
            </ul>
          </div>

          <div className="card-pastel-gold rounded-3xl p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#082F49] border border-[#38BDF8] text-[#7DD3FC] flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-2xl font-bold">photo_camera</span>
              </div>
              <div>
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#7DD3FC] font-bold">
                  {t('ec27OptKicker', 'Telescopios, Prismáticos & Cámaras')}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {t('ec27OptTitle', 'Observación Óptica y Astrofotografía')}
                </h2>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#E0F2FE]">
              <li className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#7DD3FC] text-lg shrink-0 mt-0.5">shield</span>
                <span>
                  <strong className="text-white">{t('ec27Opt1Bold', 'Filtro siempre en la lente frontal (objetivo):')}</strong>{' '}
                  {t('ec27Opt1Text', 'densidad neutra extrema (atenuación ~100.000× en luz visible, UV e IR), firmemente ajustado antes de apuntar.')}
                </span>
              </li>
              <li className="p-3 rounded-2xl bg-rose-950/40 border border-rose-400/35 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-rose-300 text-lg shrink-0 mt-0.5">warning</span>
                <span>
                  <strong className="text-white">{t('ec27Opt2Bold', 'Descarta filtros en el ocular:')}</strong>{' '}
                  {t('ec27Opt2Text', 'son peligrosos por sobrecalentamiento repentino y pueden dañar la vista al instante.')}
                </span>
              </li>
              <li className="p-3 rounded-2xl bg-black/25 border border-white/10 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#FEE685] text-lg shrink-0 mt-0.5">camera</span>
                <span>
                  <strong className="text-white">{t('ec27Opt3Bold', 'Ajustes recomendados:')}</strong>{' '}
                  {t('ec27Opt3Text', 'teleobjetivo largo (300–800 mm+), ISO 50–100 y diafragma medio (f/8–f/16). Haz pruebas solares días antes para calibrar exposiciones.')}
                </span>
              </li>
              <li className="p-3 rounded-2xl bg-amber-950/35 border border-[#FEE685]/35 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#FEE685] text-lg shrink-0 mt-0.5">flare</span>
                <span>
                  <strong className="text-white">{t('ec27Opt4Bold', 'Retira el filtro solo en totalidad:')}</strong>{' '}
                  {t('ec27Opt4Text', 'la corona solar es ~1 millón de veces más tenue que el disco solar; fotografíala a plena apertura únicamente durante C2–C3.')}
                </span>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* SECTION 4: EFECTOS FÍSICOS OBSERVABLES */}
      {showSection('physics') && (
        <section className="card-pastel-gold rounded-3xl p-5 sm:p-7 space-y-5">
          <div>
            <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#7DD3FC] font-bold">
              {t('ec27PhysKicker', 'Ciencia Ambiental en Tiempo Real')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {t('ec27PhysTitle', 'Efectos Físicos Observables Durante la Totalidad')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#7DD3FC]">
                <span className="material-symbols-outlined text-xl">thermostat</span>
                <h3 className="font-extrabold text-sm text-white">{t('ec27Phys1Title', 'Temperatura & Viento')}</h3>
              </div>
              <p className="text-xs text-[#E0F2FE] leading-relaxed">
                {t(
                  'ec27Phys1Body',
                  'Descenso térmico de 2–7 °C en latitudes medias (hasta ~5 °C medidos en 2017), alcanzando el mínimo 2–10 min tras la totalidad. El viento se calma (–9 % de media) sin generar ciclones.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="material-symbols-outlined text-xl">pets</span>
                <h3 className="font-extrabold text-sm text-white">{t('ec27Phys2Title', 'Fauna & Ecosistema')}</h3>
              </div>
              <p className="text-xs text-[#E0F2FE] leading-relaxed">
                {t(
                  'ec27Phys2Body',
                  'La oscuridad crepuscular súbita activa rutinas nocturnas: aves que se acallan y buscan posarse, abejas que vuelven a sus colmenas e insectos como luciérnagas que encienden su luz.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40 space-y-2">
              <div className="flex items-center gap-2 text-sky-300">
                <span className="material-symbols-outlined text-xl">satellite_alt</span>
                <h3 className="font-extrabold text-sm text-white">{t('ec27Phys3Title', 'Ionosfera, Radio & GPS')}</h3>
              </div>
              <p className="text-xs text-[#E0F2FE] leading-relaxed">
                {t(
                  'ec27Phys3Body',
                  'La menor radiación UV reduce levemente la ionización (~1 TECU). Produce variaciones débiles en radio HF y GNSS, pero no provoca apagones de GPS.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#082F49]/75 border border-[#38BDF8]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#FEE685]">
                <span className="material-symbols-outlined text-xl">waves</span>
                <h3 className="font-extrabold text-sm text-white">{t('ec27Phys4Title', 'Mareas & Gravedad')}</h3>
              </div>
              <p className="text-xs text-[#E0F2FE] leading-relaxed">
                {t(
                  'ec27Phys4Body',
                  'Ocurre en Luna Nueva, produciendo las mareas vivas habituales de sicigia (pleamar más alta y bajamar más baja). No altera la gravedad terrestre.'
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: PLANIFICACIÓN, ASTROTURISMO & CHECKLIST */}
      {showSection('planning') && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 card-pastel-gold rounded-3xl p-5 sm:p-7 space-y-4">
              <div>
                <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#FEE685] font-bold">
                  {t('ec27PlanKicker', 'Logística de Expedición')}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {t('ec27PlanTitle', 'Planificación y Astroturismo')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1.5">
                  <span className="text-[#7DD3FC] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">wb_sunny</span>
                    {t('ec27Plan1Title', 'Clima en Agosto')}
                  </span>
                  <p className="text-[#E0F2FE] leading-relaxed">
                    {t(
                      'ec27Plan1Body',
                      'Cielos despejados predominantes en Sahara y Arabia. En costas mediterráneas (España, Túnez) hay algo más de riesgo de nubes matinales; en España el interior andaluz suele estar más despejado que la costa.'
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1.5">
                  <span className="text-amber-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">travel_explore</span>
                    {t('ec27Plan2Title', 'Accesibilidad & Seguridad')}
                  </span>
                  <p className="text-[#E0F2FE] leading-relaxed">
                    {t(
                      'ec27Plan2Body',
                      'Planifica en países seguros, revisa pasaportes/visados y evita zonas con advertencias de viaje (Yemen, Somalia o partes de Libia/Siria). Reserva transporte y alojamiento con gran antelación.'
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1.5">
                  <span className="text-emerald-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">stars</span>
                    {t('ec27Plan3Title', 'Zonas Starlight & Eje Central')}
                  </span>
                  <p className="text-[#E0F2FE] leading-relaxed">
                    {t(
                      'ec27Plan3Body',
                      'Sitúate lo más cerca del eje central (Tarifa, Luxor, Jeddah) y en reservas Starlight o DarkSky (Atlas marroquí, wadis de Egipto, Andalucía interior) para disfrutar del cielo oscuro durante la totalidad.'
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-1.5">
                  <span className="text-[#FEE685] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">alt_route</span>
                    {t('ec27Plan4Title', 'Plan B & Supervivencia')}
                  </span>
                  <p className="text-[#E0F2FE] leading-relaxed">
                    {t(
                      'ec27Plan4Body',
                      'Ten un destino alternativo ante nubes (p. ej. saltar de Andalucía hacia Marruecos/Túnez). Lleva agua, sombrero y gafas de repuesto (calor extremo sobre el Sahara) y consulta NASA, AEMET y TimeandDate.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 card-pastel-gold rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FEE685]">checklist</span>
                    {t('ec27CheckTitle', 'Checklist de Campo')}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#082F49] border border-[#38BDF8]/50 text-[#7DD3FC] text-xs font-extrabold font-['JetBrains_Mono']">
                    {completedCount}/{checklistItems.length}
                  </span>
                </div>
                <p className="text-xs text-[#BAE6FD] mb-4">
                  {t('ec27CheckSub', 'Marca tu equipo antes de salir; se guarda automáticamente en tu dispositivo.')}
                </p>

                <div className="space-y-2.5">
                  {checklistItems.map((item) => {
                    const checked = Boolean(checkedItems[item.id]);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          checked
                            ? 'bg-emerald-950/45 border-emerald-400/50 text-emerald-100'
                            : 'bg-black/25 border-white/15 text-white hover:bg-black/35'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${
                            checked ? 'text-emerald-400' : 'text-white/40'
                          }`}
                        >
                          {checked ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-['JetBrains_Mono'] uppercase text-[#FEE685] block">
                            {item.category}
                          </span>
                          <span className={`text-xs font-medium leading-snug ${checked ? 'line-through opacity-80' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#081A2E]/90 border border-[#38BDF8]/35 p-4 sm:p-5 text-xs text-[#BAE6FD] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <strong className="text-white">{t('ec27SourcesBold', 'Fuentes oficiales:')}</strong>{' '}
              {t(
                'ec27SourcesText',
                'NASA/GSFC (datos astronómicos y trayectoria), TimeandDate (cronologías locales), AAS/NASA (seguridad ocular y fotografía) y estudios de la Universidad de Sheffield y US Fish & Wildlife.'
              )}
            </div>
            <div className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 font-bold">
              {t('ec27Validity', 'Vigente a noviembre de 2026 · Verificar clima y trámites antes del evento')}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
