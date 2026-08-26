import React, { useState, useEffect } from 'react';
import { PLANETARY_ENERGIES, CELESTIAL_EVENTS } from '../data/stellaData';
import { CelestialEvent, PlanetaryEnergy } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CalendarConfirmModal } from './CalendarConfirmModal';
import { CalendarEventPayload } from '../lib/calendar';

export const EventsView: React.FC = () => {
  const { user, signIn, syncEventToCalendar } = useAuth();
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'energy'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [timeFilter, setTimeFilter] = useState<'active_upcoming' | 'archived_past'>('active_upcoming');
  const [currentDateString, setCurrentDateString] = useState<string>('25 de Agosto de 2026');
  const [currentTimeString, setCurrentTimeString] = useState<string>('13:42');

  // Real-time live date reference
  const todayISO = '2026-08-25'; // Current synchronized live date reference

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Spanish / European format
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeString(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const [selectedEnergy, setSelectedEnergy] = useState<PlanetaryEnergy | null>(PLANETARY_ENERGIES[0]);
  const [selectedEvent, setSelectedEvent] = useState<CelestialEvent | null>(CELESTIAL_EVENTS[0]);

  // Calendar sync modal state
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [pendingEventPayload, setPendingEventPayload] = useState<CalendarEventPayload | null>(null);
  const [syncedEvents, setSyncedEvents] = useState<{ [evtId: string]: string }>({}); // map evtId to googleLink

  // Helper to check if event is in the future/active vs past
  const isEventUpcoming = (evt: CelestialEvent) => {
    return evt.endDateISO >= todayISO;
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (startDateISO: string) => {
    const today = new Date(`${todayISO}T00:00:00Z`).getTime();
    const eventDate = new Date(`${startDateISO}T00:00:00Z`).getTime();
    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Finalizado', isPast: true, days: diffDays };
    if (diffDays === 0) return { label: '¡HOY!', isPast: false, isToday: true, days: 0 };
    if (diffDays === 1) return { label: 'Mañana', isPast: false, days: 1 };
    if (diffDays < 30) return { label: `En ${diffDays} días`, isPast: false, days: diffDays };
    if (diffDays < 60) return { label: `En ${Math.round(diffDays / 7)} semanas`, isPast: false, days: diffDays };
    const months = Math.round(diffDays / 30.5);
    return { label: `En ${months} meses (${diffDays} días)`, isPast: false, days: diffDays };
  };

  // Split events into upcoming and past
  const allUpcomingEvents = CELESTIAL_EVENTS.filter((e) => isEventUpcoming(e));
  const allPastEvents = CELESTIAL_EVENTS.filter((e) => !isEventUpcoming(e));

  // Current list based on timeFilter
  const baseList = timeFilter === 'active_upcoming' ? allUpcomingEvents : allPastEvents;

  // Filter by category
  const filteredEvents = selectedCategory === 'todos'
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
      description: `${evt.description}\n\nPico: ${evt.peakTime}\nZona recomendada: ${evt.bestVisibilityZone}\nEquipamiento: ${evt.equipmentNeeded}`,
      location: evt.bestVisibilityZone || 'Observación Estelar España',
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
            Agenda en vivo:
          </span>
          <span className="text-white font-extrabold">
            {currentDateString} • {currentTimeString} h (Hora España CEST)
          </span>
          <span className="text-[#38BDF8] text-[11px] font-medium hidden sm:inline">
            | Eventos pasados filtrados automáticamente
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
                    Elemento {selectedEnergy.element} • {selectedEnergy.planet}
                  </span>
                  <span className="text-xs font-['JetBrains_Mono'] text-[#BAE6FD] font-bold">
                    Tránsito Astrológico & Astronómico
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
                      Detalle Astronómico Real
                    </h3>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {selectedEnergy.astronomicalDetail}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#38BDF8]">auto_awesome</span>
                      Consejo de Observación & Enfoque
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
              Selecciona un Planeta o Tránsito
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
                <span>Eventos Próximos ({allUpcomingEvents.length})</span>
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
                <span>Historial Pasado ({allPastEvents.length})</span>
              </button>
            </div>

            <div className="text-xs font-['JetBrains_Mono'] text-[#7DD3FC] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">update</span>
              {timeFilter === 'active_upcoming'
                ? 'Mostrando solo eventos astronómicos activos a partir de hoy'
                : 'Eventos astronómicos ya finalizados'}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: t('categoryAll', 'Todos los Eventos') },
              { id: 'eclipse', label: t('categoryEclipses', 'Eclipses (Solar/Lunar)') },
              { id: 'lluvia_estrellas', label: t('categoryMeteors', 'Lluvias de Estrellas') },
              { id: 'alineacion', label: t('categoryPlanets', 'Alineación de Planetas') },
              { id: 'visualizacion_planetas', label: 'Visualización de Planetas' },
              { id: 'fase_lunar', label: 'Fases Lunares' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-[#0284C7] text-white border border-[#7DD3FC]'
                    : 'bg-[#082F49]/60 text-white/80 hover:bg-[#082F49] border border-[#38BDF8]/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List of Celestial Events */}
          <div className="space-y-5">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-[#082F49]/60 rounded-3xl border border-[#38BDF8]/30 text-white/70">
                <span className="material-symbols-outlined text-4xl mb-2 text-[#7DD3FC]">event_busy</span>
                <p className="font-extrabold text-white text-base">No hay eventos en esta categoría para el filtro seleccionado.</p>
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const countdown = getDaysRemaining(evt.startDateISO);
                return (
                  <div
                    key={evt.id}
                    className={`card-pastel-gold card-pastel-gold-hover rounded-3xl p-6 md:p-8 shadow-xl transition-all border ${
                      countdown.isPast ? 'border-gray-500/50 opacity-85' : 'border-[#7DD3FC]/50'
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
                              {evt.categoryLabel}
                            </span>
                            {/* Days remaining badge */}
                            <span
                              className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase font-['JetBrains_Mono'] shadow-sm ${
                                countdown.isPast
                                  ? 'bg-gray-700 text-gray-200'
                                  : countdown.days < 30
                                  ? 'bg-[#DC2626] text-white animate-pulse'
                                  : 'bg-[#0284C7] text-white'
                              }`}
                            >
                              {countdown.isPast ? 'Finalizado' : `⏳ ${countdown.label}`}
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mt-1 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                            {evt.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-left md:text-right bg-[#082F49]/80 backdrop-blur-sm p-3 rounded-2xl border border-[#38BDF8]/40 shadow-sm">
                        <span className="block text-sm font-extrabold text-white font-['JetBrains_Mono']">
                          📅 {evt.date}
                        </span>
                        <span className="text-xs text-[#BAE6FD] font-bold">
                          ⏰ Pico: {evt.peakTime}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-[#E0F2FE] font-medium leading-relaxed mb-4 font-['Plus_Jakarta_Sans']">
                      {evt.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#38BDF8]/30 text-xs mb-4">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="material-symbols-outlined text-base text-[#7DD3FC]">location_on</span>
                        <span><strong>Zona óptima:</strong> {evt.bestVisibilityZone}</span>
                      </div>

                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="material-symbols-outlined text-base text-[#7DD3FC]">visibility</span>
                        <span><strong>Equipamiento:</strong> {evt.equipmentNeeded}</span>
                      </div>
                    </div>

                    {/* Google Calendar Sync Action Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#38BDF8]/30">
                      {countdown.isPast ? (
                        <span className="text-xs font-bold text-[#BAE6FD] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-gray-400">task_alt</span>
                          Evento pasado registrado en el histórico estelar
                        </span>
                      ) : syncedEvents[evt.id] ? (
                        <a
                          href={syncedEvents[evt.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Añadido a Google Calendar (Ver en Google)
                        </a>
                      ) : (
                        <button
                          onClick={() => handleOpenCalendarSync(evt)}
                          className="px-5 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md border border-[#7DD3FC]/50"
                        >
                          <span className="material-symbols-outlined text-base">calendar_add_on</span>
                          Añadir / Sincronizar en Google Calendar
                        </button>
                      )}

                      <span className="text-[11px] text-[#BAE6FD] font-['JetBrains_Mono'] font-bold hidden sm:inline">
                        Integración oficial Google Workspace
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

