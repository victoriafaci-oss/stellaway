import React, { useState, useEffect } from 'react';
import { PLANETARY_ENERGIES, CELESTIAL_EVENTS } from '../data/stellaData';
import { CelestialEvent, PlanetaryEnergy } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CalendarConfirmModal } from './CalendarConfirmModal';
import { CalendarEventPayload } from '../lib/calendar';
import { useOfflineStorage } from '../lib/offlineStorage';
import {
  getLocaleTag,
  translateElement,
  translateEventCategory,
} from '../lib/i18nHelpers';

function getTodayMadridISO(): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    if (y && m && d) return `${y}-${m}-${d}`;
  } catch {
    // Fallback below
  }
  return new Date().toISOString().slice(0, 10);
}

export const EventsView: React.FC = () => {
  const { user, signIn, syncEventToCalendar } = useAuth();
  const { t, language } = useLanguage();
  const { savedEvents, isEventSaved, toggleSaveEvent, stats } = useOfflineStorage();
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'energy'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [timeFilter, setTimeFilter] = useState<'active_upcoming' | 'archived_past'>('active_upcoming');
  const [showDossier, setShowDossier] = useState<boolean>(true);
  const [todayISO, setTodayISO] = useState<string>(() => getTodayMadridISO());
  const [currentDateString, setCurrentDateString] = useState<string>('');
  const [currentTimeString, setCurrentTimeString] = useState<string>('');

  useEffect(() => {
    const localeTag = getLocaleTag(language);

    const updateDateAndTime = () => {
      const iso = getTodayMadridISO();
      setTodayISO(iso);
      try {
        const formattedDate = new Intl.DateTimeFormat(localeTag, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Europe/Madrid',
        }).format(new Date());
        setCurrentDateString(formattedDate);
      } catch {
        setCurrentDateString(iso);
      }

      try {
        const now = new Date();
        const madridTimeStr = now.toLocaleTimeString(localeTag, {
          timeZone: 'Europe/Madrid',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setCurrentTimeString(madridTimeStr && madridTimeStr.includes(':') ? madridTimeStr : '');
      } catch {
        setCurrentTimeString('');
      }
    };

    updateDateAndTime();
    const interval = setInterval(updateDateAndTime, 30000);
    return () => clearInterval(interval);
  }, [language]);

  const [selectedEnergy, setSelectedEnergy] = useState<PlanetaryEnergy | null>(PLANETARY_ENERGIES[0]);
  const [selectedEvent, setSelectedEvent] = useState<CelestialEvent | null>(CELESTIAL_EVENTS[0]);

  // Calendar sync modal state
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [pendingEventPayload, setPendingEventPayload] = useState<CalendarEventPayload | null>(null);
  const [syncedEvents, setSyncedEvents] = useState<{ [evtId: string]: string }>({}); // map evtId to googleLink

  // Helper to check if event is active/upcoming vs archived past (purely date-based)
  const isEventUpcoming = (evt: CelestialEvent) => {
    return evt.endDateISO >= todayISO;
  };

  // Strictly chronological sorting: upcoming ascending, archived descending
  const allUpcomingEvents = [...CELESTIAL_EVENTS]
    .filter((e) => isEventUpcoming(e))
    .sort((a, b) => a.startDateISO.localeCompare(b.startDateISO));

  const allPastEvents = [...CELESTIAL_EVENTS]
    .filter((e) => !isEventUpcoming(e))
    .sort((a, b) => b.startDateISO.localeCompare(a.startDateISO));

  // Current list based on timeFilter
  const baseList = timeFilter === 'active_upcoming' ? allUpcomingEvents : allPastEvents;

  // Filter by category (including offline saved events)
  const filteredEvents = selectedCategory === 'offline'
    ? savedEvents
    : selectedCategory === 'todos'
    ? baseList
    : baseList.filter((e) => e.category === selectedCategory);

  const handleOpenCalendarSync = async (evt: CelestialEvent) => {
    if (!user) {
      // Prompt user to sign in first
      try {
        await signIn();
      } catch (e) {
        return;
      }
    }

    // Build start/end ISO string for the event date using precise ISO properties
    const startISO = `${evt.startDateISO}T21:00:00Z`;
    const endISO = `${evt.endDateISO}T23:59:50Z`;

    const payload: CalendarEventPayload = {
      summary: evt.title,
      description: `${evt.description}\n\n${t('eventsPeakLabel')}: ${evt.peakTime}\n${t('eventsZoneLabel')}: ${evt.bestVisibilityZone}\n${t('eventsEquipLabel')}: ${evt.equipmentNeeded}`,
      location: evt.bestVisibilityZone || t('calDefaultLocation'),
      startDateTime: startISO,
      endDateTime: endISO,
    };

    setPendingEventPayload(payload);
    setSelectedEvent(evt);
    setIsCalendarModalOpen(true);
  };

  const handleConfirmSync = async (payload: CalendarEventPayload) => {
    const result = await syncEventToCalendar(payload);
    if (selectedEvent) {
      setSyncedEvents((prev) => ({
        ...prev,
        [selectedEvent.id]: result.htmlLink,
      }));
    }
    setIsCalendarModalOpen(false);
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-7xl mx-auto w-full pt-20 md:pt-12 pb-28 md:pb-16">
      {/* Calendar Confirmation Modal */}
      <CalendarConfirmModal
        isOpen={isCalendarModalOpen}
        eventPayload={pendingEventPayload}
        onClose={() => setIsCalendarModalOpen(false)}
        onConfirm={handleConfirmSync}
      />

      {/* Header */}
      <header className="py-6 md:py-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
          <span className="material-symbols-outlined text-sm">flare</span>
          {t('eventsTag', 'Astronomía & Energía Cósmica')}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('eventsTitle', 'Eventos Estelares & Transición Planetaria')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t('eventsSubtitle', 'Consulta el calendario de efemérides, alineaciones y eclipses próximos, y explora la influencia y energía planetaria de cada tránsito.')}
        </p>

        {/* Live Date & Real-Time Sync Indicator */}
        <div className="mt-4 inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#082F49]/70 border border-[#38BDF8]/40 backdrop-blur-md text-xs font-bold text-[#E0F2FE] shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_8px_#34D399]" />
          <span className="font-['JetBrains_Mono'] text-[#7DD3FC] uppercase tracking-wider">
            {t('eventsLiveAgenda')}:
          </span>
          <span className="text-white font-extrabold">
            {currentDateString}{currentTimeString ? ` • ${currentTimeString} h (${t('eventsSpainTime')} CET)` : ''}
          </span>
          <span className="text-[#38BDF8] text-[11px] font-medium hidden sm:inline">
            | Diciembre 2026 actualizado
          </span>
        </div>
      </header>

      {/* Main Two Sub-Tabs Selector: LEFT = Eventos Próximos, RIGHT = Energía Planetaria */}
      <div className="flex border-b border-white/12 mb-8 gap-4">
        <button
          onClick={() => setActiveSubTab('upcoming')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2.5 cursor-pointer ${
            activeSubTab === 'upcoming'
              ? 'text-[#FFD700]'
              : 'text-white/60 hover:text-white'
          }`}
          id="tab-sub-upcoming"
        >
          <span className="material-symbols-outlined text-2xl">event</span>
          {t('upcomingTab', 'Eventos Próximos & Eclipses')}
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40">
            {allUpcomingEvents.length}
          </span>
          {activeSubTab === 'upcoming' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('energy')}
          className={`pb-4 px-2 font-['Plus_Jakarta_Sans'] text-base md:text-lg font-bold transition-all relative flex items-center gap-2.5 cursor-pointer ${
            activeSubTab === 'energy'
              ? 'text-[#FFD700]'
              : 'text-white/60 hover:text-white'
          }`}
          id="tab-sub-energy"
        >
          <span className="material-symbols-outlined text-2xl">cyclone</span>
          {t('energyTab', 'Energía Planetaria')}
          {activeSubTab === 'energy' && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#FFD700] rounded-t-full shadow-[0_0_12px_#FFD700]" />
          )}
        </button>
      </div>

      {/* SUB-TAB 1: ENERGÍA PLANETARIA */}
      {activeSubTab === 'energy' && (
        <div className="space-y-8">
          {/* Main Selected Energy Spotlight in Celestial Sky Blue Glass */}
          {selectedEnergy && (
            <div className="card-pastel-gold rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-[#7DD3FC]/50 backdrop-blur-md">
              <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none text-9xl font-serif text-[#7DD3FC]">
                {selectedEnergy.symbol}
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#082F49]/90 text-[#7DD3FC] border border-[#38BDF8]/50 text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                    {t('eventsElementPrefix')} {translateElement(selectedEnergy.element, language)} • {selectedEnergy.planet}
                  </span>
                  <span className="text-xs font-['JetBrains_Mono'] text-[#BAE6FD] font-bold">
                    {t('eventsTransitType')}
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 font-['Plus_Jakarta_Sans'] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {selectedEnergy.signOrTransit}: {selectedEnergy.title}
                </h2>

                <p className="text-base md:text-lg text-[#BAE6FD] font-bold mb-6 font-['Plus_Jakarta_Sans'] italic">
                  "{selectedEnergy.energySummary}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#082F49]/70 backdrop-blur-md rounded-2xl p-6 border border-[#38BDF8]/40 shadow-sm">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#38BDF8]">telescope</span>
                      {t('eventsAstroDetail')}
                    </h3>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {selectedEnergy.astronomicalDetail}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#38BDF8]">auto_awesome</span>
                      {t('eventsObserveTip')}
                    </h3>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {selectedEnergy.stargazingRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Planetary Energies */}
          <div>
            <h3 className="text-xl font-extrabold text-white mb-4 font-['Plus_Jakarta_Sans']">
              {t('eventsPickTransit')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLANETARY_ENERGIES.map((pe) => {
                const isSelected = selectedEnergy?.id === pe.id;
                return (
                  <div
                    key={pe.id}
                    onClick={() => setSelectedEnergy(pe)}
                    className={`p-5 rounded-3xl transition-all cursor-pointer flex items-start gap-4 shadow-lg backdrop-blur-md ${
                      isSelected
                        ? 'card-pastel-gold border-2 border-[#7DD3FC] ring-4 ring-[#38BDF8]/50 scale-[1.02]'
                        : 'card-pastel-gold border border-[#7DD3FC]/40 opacity-90 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#082F49]/80 border border-[#38BDF8]/50 text-[#7DD3FC] flex items-center justify-center text-2xl shrink-0 font-serif font-bold shadow-sm">
                      {pe.symbol}
                    </div>

                    <div className="flex-1">
                      <span className="text-[11px] text-[#BAE6FD] font-['JetBrains_Mono'] uppercase font-bold block mb-0.5">
                        {pe.signOrTransit}
                      </span>
                      <h4 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-1">
                        {pe.title}
                      </h4>
                      <p className="text-xs text-[#E0F2FE] font-medium line-clamp-2">
                        {pe.energySummary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EVENTOS PRÓXIMOS & ECLIPSES */}
      {activeSubTab === 'upcoming' && (
        <div className="space-y-6">
          {/* Status Mode Selector: PRÓXIMOS (Activos) vs HISTORIAL PASADO */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-[#082F49]/70 border border-[#38BDF8]/40 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeFilter('active_upcoming')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  timeFilter === 'active_upcoming'
                    ? 'bg-[#0284C7] text-white shadow-md border border-[#7DD3FC]/50'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                id="btn-filter-upcoming"
              >
                <span className="material-symbols-outlined text-sm">event_available</span>
                <span>{t('eventsUpcomingBtn')} ({allUpcomingEvents.length})</span>
              </button>

              <button
                onClick={() => setTimeFilter('archived_past')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  timeFilter === 'archived_past'
                    ? 'bg-[#0284C7] text-white shadow-md border border-[#7DD3FC]/50'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                id="btn-filter-past"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                <span>{t('eventsPastBtn')} ({allPastEvents.length})</span>
              </button>
            </div>

            <div className="text-xs font-['JetBrains_Mono'] text-[#7DD3FC] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">update</span>
              {timeFilter === 'active_upcoming'
                ? t('eventsActiveFilterHint')
                : t('eventsPastFilterHint')}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: t('categoryAll', 'Todos los Eventos') },
              { id: 'offline', label: `🎒 ${t('eventsOfflineCat')} (${stats.eventsCount})` },
              { id: 'eclipse', label: t('categoryEclipses', 'Eclipses (Solar/Lunar)') },
              { id: 'lluvia_estrellas', label: t('categoryMeteors', 'Lluvias de Estrellas') },
              { id: 'alineacion', label: t('categoryPlanets', 'Alineación de Planetas') },
              { id: 'visualizacion_planetas', label: t('eventsPlanetViewCat') },
              { id: 'fase_lunar', label: t('eventsMoonPhaseCat') },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                  selectedCategory === cat.id
                    ? cat.id === 'offline'
                      ? 'bg-amber-400 text-black border border-amber-300 font-black shadow-amber-400/20'
                      : 'bg-[#0284C7] text-white border border-[#7DD3FC]'
                    : 'bg-[#082F49]/60 text-white/80 hover:bg-[#082F49] border border-[#38BDF8]/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Structured December 2026 Summary Dossier */}
          <div className="rounded-3xl bg-[#081A2E]/85 border border-[#38BDF8]/40 backdrop-blur-md overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => setShowDossier((prev) => !prev)}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                    Guía Rápida Diciembre 2026 · Fases Lunares, Lanzamientos y Auroras
                  </h3>
                  <p className="text-xs text-[#BAE6FD] truncate">
                    Horarios UTC/CET, lluvias menores, lanzamientos espaciales, zonas Starlight/DarkSky y nota de eclipses
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#7DD3FC] shrink-0">
                {showDossier ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showDossier && (
              <div className="px-5 pb-5 pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Fases Lunares Diciembre 2026 */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold uppercase tracking-wider text-[11px]">
                    <span className="material-symbols-outlined text-base">nightlight</span>
                    <span>Fases Lunares (Dic 2026)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    <li><strong className="text-white">9 Dic · 00:51 UTC</strong> (01:51 CET) — Luna Nueva (0%)</li>
                    <li><strong className="text-white">17 Dic · 05:42 UTC</strong> (06:42 CET) — Primer Cuarto (~50%)</li>
                    <li><strong className="text-white">24 Dic · 01:28 UTC</strong> (02:28 CET) — Luna Llena “Luna Fría” / Superluna ~358.000 km (100%, salida atardecer 23 Dic)</li>
                    <li><strong className="text-white">30 Dic · 18:59 UTC</strong> (19:59 CET) — Último Cuarto (~50%)</li>
                  </ul>
                  <p className="text-[11px] text-sky-300 pt-1 border-t border-white/10">
                    <strong>Eclipses:</strong> Sin eclipses solares ni lunares en diciembre de 2026. Próximo gran eclipse total: <strong>2 Ago 2027</strong>.
                  </p>
                </div>

                {/* Lanzamientos Espaciales, Satélites y Lluvias Menores */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 font-extrabold uppercase tracking-wider text-[11px]">
                    <span className="material-symbols-outlined text-base">rocket_launch</span>
                    <span>Lanzamientos & Satélites (Dic 2026)</span>
                  </div>
                  <ul className="space-y-1 text-slate-200">
                    <li><strong className="text-white">2 Dic:</strong> SpaceX NROL-132 (Falcon 9 · EE. UU.)</li>
                    <li><strong className="text-white">4 Dic:</strong> SpaceX CHORUS C (Falcon 9 · Canadá)</li>
                    <li><strong className="text-white">10 Dic:</strong> CASC SatNet LEO (CZ-12 · China)</li>
                    <li><strong className="text-white">18 Dic:</strong> Ariane 6 / Vega-C MetOp-SG B1 (Europa)</li>
                    <li><strong className="text-white">30 Dic:</strong> SpaceX Globalstar 2R / Telesat & Vulcan NROL-64</li>
                  </ul>
                  <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
                    <strong>Satélites y lluvias menores:</strong> Pases de la ISS (hasta mag -3) y trenes Starlink al crepúsculo. Lluvias débiles: φ-Casiopeidas (6 Dic), Monocerótidas (9 Dic), σ-Hídridas (12 Dic), Comae Berenícidas (17 Dic) y Leónidas Menores (21 Dic).
                  </p>
                </div>

                {/* Auroras, Zonas Certificadas & Consejos */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold uppercase tracking-wider text-[11px]">
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    <span>Auroras, Cielos Oscuros & Campo</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    <strong className="text-white">Auroras Dic 2026:</strong> Noches largas árticas con tormentas previstas de <strong>Kp ≥ 5</strong> (Tromsø, Abisko, Kiruna, Fairbanks, Yellowknife, Murmansk) y brotes australes ocasionales (Patagonia, Tasmania, Isla Sur NZ).
                  </p>
                  <p className="text-slate-200 leading-relaxed">
                    <strong className="text-white">Zonas recomendadas:</strong> Montsec, Teide, La Palma, Fuerteventura, Mont-Mégantic, Aoraki Mackenzie, NamibRand y Torres del Paine.
                  </p>
                  <p className="text-[11px] text-amber-200/90 pt-1 border-t border-white/10">
                    <strong>Astrofoto:</strong> RAW, f/2.8, ISO 1600–3200, 15–30 s, enfoque manual en estrella brillante, trípode sólido, abrigo térmico y linterna de luz roja.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* List of Celestial Events */}
          <div className="space-y-5">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-[#082F49]/60 rounded-3xl border border-[#38BDF8]/30 text-white/70">
                <span className="material-symbols-outlined text-4xl mb-2 text-[#7DD3FC]">event_busy</span>
                <p className="font-extrabold text-white text-base">{t('eventsEmptyCat')}</p>
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const isPast = !isEventUpcoming(evt);
                return (
                  <div
                    key={evt.id}
                    className={`card-pastel-gold card-pastel-gold-hover rounded-3xl p-6 md:p-8 shadow-xl transition-all border ${
                      isPast ? 'border-gray-500/50 opacity-85' : 'border-[#7DD3FC]/50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-[#082F49]/80 border border-[#38BDF8]/50 text-[#7DD3FC] flex items-center justify-center shrink-0 shadow-md">
                          <span className="material-symbols-outlined text-2xl font-bold">
                            {evt.category === 'eclipse' && 'flare'}
                            {evt.category === 'lluvia_estrellas' && 'auto_awesome'}
                            {evt.category === 'alineacion' && 'grain'}
                            {evt.category === 'visualizacion_planetas' && 'public'}
                            {evt.category === 'fase_lunar' && 'nightlight'}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-0.5 rounded-full bg-[#082F49]/90 text-[#7DD3FC] border border-[#38BDF8]/40 text-[11px] font-extrabold font-['JetBrains_Mono'] uppercase">
                              {translateEventCategory(evt.categoryLabel, language)}
                            </span>
                            {evt.isMajor && !isPast && (
                              <span className="px-3 py-0.5 rounded-full bg-amber-300/20 text-amber-200 border border-amber-300/50 text-[11px] font-extrabold font-['JetBrains_Mono'] uppercase">
                                ★ Destacado
                              </span>
                            )}
                            {isPast && (
                              <span className="px-3 py-0.5 rounded-full bg-gray-700 text-gray-200 text-[11px] font-extrabold uppercase font-['JetBrains_Mono']">
                                Archivo
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mt-1 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                            {evt.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-left md:text-right bg-[#082F49]/80 backdrop-blur-sm p-3 rounded-2xl border border-[#38BDF8]/40 shadow-sm shrink-0">
                        <span className="block text-sm font-extrabold text-white font-['JetBrains_Mono']">
                          📅 {evt.date}
                        </span>
                        <span className="text-xs text-[#BAE6FD] font-bold">
                          ⏰ {evt.peakTime}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-[#E0F2FE] font-medium leading-relaxed mb-4 font-['Plus_Jakarta_Sans']">
                      {evt.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#38BDF8]/30 text-xs mb-4">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="material-symbols-outlined text-base text-[#7DD3FC]">location_on</span>
                        <span><strong>{t('eventsZoneLabel')}:</strong> {evt.bestVisibilityZone}</span>
                      </div>

                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="material-symbols-outlined text-base text-[#7DD3FC]">visibility</span>
                        <span><strong>{t('eventsEquipLabel')}:</strong> {evt.equipmentNeeded}</span>
                      </div>
                    </div>

                    {/* Actions: Google Calendar Sync + Selective Offline Save */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#38BDF8]/30">
                      <div className="flex flex-wrap items-center gap-2">
                        {isPast ? (
                          <span className="text-xs font-bold text-[#BAE6FD] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-gray-400">task_alt</span>
                            {t('eventsPastRecorded')}
                          </span>
                        ) : syncedEvents[evt.id] ? (
                          <a
                            href={syncedEvents[evt.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            {t('eventsInGCal')}
                          </a>
                        ) : (
                          <button
                            onClick={() => handleOpenCalendarSync(evt)}
                            className="px-4 py-2 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md border border-[#7DD3FC]/50"
                          >
                            <span className="material-symbols-outlined text-base">calendar_add_on</span>
                            {t('eventsSyncCalBtn')}
                          </button>
                        )}

                        <button
                          onClick={() => toggleSaveEvent(evt)}
                          className={`px-3.5 py-2 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                            isEventSaved(evt.id)
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400/40'
                              : 'bg-[#082F49] hover:bg-[#0c3e60] text-white/90 border border-[#38BDF8]/40'
                          }`}
                          title={isEventSaved(evt.id) ? t('eventsSavedOfflineBtn') : t('eventsSaveOfflineBtn')}
                        >
                          <span className="material-symbols-outlined text-base text-amber-300">
                            {isEventSaved(evt.id) ? 'bookmark_added' : 'bookmark_add'}
                          </span>
                          <span>{isEventSaved(evt.id) ? t('eventsSavedOfflineBtn') : t('eventsSaveOfflineBtn')}</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-[#BAE6FD] font-['JetBrains_Mono'] font-bold hidden sm:inline">
                        {t('eventsFooterSyncNote')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>
      )}
    </div>
  );
};

