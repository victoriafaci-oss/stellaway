import React, { useState } from 'react';
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
  const [selectedEnergy, setSelectedEnergy] = useState<PlanetaryEnergy | null>(PLANETARY_ENERGIES[0]);
  const [selectedEvent, setSelectedEvent] = useState<CelestialEvent | null>(CELESTIAL_EVENTS[0]);

  // Calendar sync modal state
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [pendingEventPayload, setPendingEventPayload] = useState<CalendarEventPayload | null>(null);
  const [syncedEvents, setSyncedEvents] = useState<{ [evtId: string]: string }>({}); // map evtId to googleLink

  const filteredEvents = selectedCategory === 'todos'
    ? CELESTIAL_EVENTS
    : CELESTIAL_EVENTS.filter((e) => e.category === selectedCategory);

  const handleOpenCalendarSync = async (evt: CelestialEvent) => {
    if (!user) {
      // Prompt user to sign in first
      try {
        await signIn();
      } catch (e) {
        return;
      }
    }

    // Build start/end ISO string for the event date
    let startISO = `${evt.date}T21:00:00Z`;
    let endISO = `${evt.date}T23:59:50Z`;

    // Normalize date format if spanish format (e.g. 12/08/2026 -> 2026-08-12)
    if (evt.date.includes('/')) {
      const parts = evt.date.split('/');
      if (parts.length === 3) {
        startISO = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T21:00:00Z`;
        endISO = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T23:59:50Z`;
      }
    }

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">flare</span>
          {t('eventsTag', 'Astronomía & Energía Cósmica')}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
          {t('eventsTitle', 'Eventos Estelares & Transición Planetaria')}
        </h1>
        <p className="text-base text-[#e1e3e4]/80 leading-relaxed font-['Plus_Jakarta_Sans']">
          {t('eventsSubtitle', 'Consulta el calendario de efemérides, alineaciones y eclipses próximos, y explora la influencia y energía planetaria de cada tránsito.')}
        </p>
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
          {/* Main Selected Energy Spotlight in Luxury Pastel Yellow */}
          {selectedEnergy && (
            <div className="card-pastel-gold rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border-2 border-[#D4AF37]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl font-serif text-[#120D1C]">
                {selectedEnergy.symbol}
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#24153F] text-[#FEE685] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                    Elemento {selectedEnergy.element} • {selectedEnergy.planet}
                  </span>
                  <span className="text-xs font-['JetBrains_Mono'] text-[#594A70] font-bold">
                    Tránsito Astrológico & Astronómico
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-[#120D1C] mb-2 font-['Plus_Jakarta_Sans']">
                  {selectedEnergy.signOrTransit}: {selectedEnergy.title}
                </h2>

                <p className="text-base md:text-lg text-[#24153F] font-bold mb-6 font-['Plus_Jakarta_Sans'] italic">
                  "{selectedEnergy.energySummary}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/70 rounded-2xl p-6 border border-[#E6CA65]">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24153F] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#24153F]">telescope</span>
                      Detalle Astronómico Real
                    </h3>
                    <p className="text-sm text-[#120D1C] font-medium leading-relaxed">
                      {selectedEnergy.astronomicalDetail}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24153F] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#24153F]">auto_awesome</span>
                      Consejo de Observación & Enfoque
                    </h3>
                    <p className="text-sm text-[#120D1C] font-medium leading-relaxed">
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
                    className={`p-5 rounded-3xl transition-all cursor-pointer flex items-start gap-4 shadow-lg ${
                      isSelected
                        ? 'card-pastel-gold ring-4 ring-[#FEE685] scale-[1.02]'
                        : 'card-pastel-gold opacity-85 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center text-2xl shrink-0 font-serif font-bold shadow-sm">
                      {pe.symbol}
                    </div>

                    <div className="flex-1">
                      <span className="text-[11px] text-[#594A70] font-['JetBrains_Mono'] uppercase font-extrabold block mb-0.5">
                        {pe.signOrTransit}
                      </span>
                      <h4 className="text-base font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] mb-1">
                        {pe.title}
                      </h4>
                      <p className="text-xs text-[#2B2538] font-medium line-clamp-2">
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
        <div className="space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: t('categoryAll', 'Todos los Eventos') },
              { id: 'eclipse', label: t('categoryEclipses', 'Eclipses (Solar/Lunar)') },
              { id: 'lluvia_estrellas', label: t('categoryMeteors', 'Lluvias de Estrellas') },
              { id: 'alineacion', label: t('categoryPlanets', 'Alineación de Planetas') },
              { id: 'visualizacion_planetas', label: 'Visualización de Planetas' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#FFF8D6] to-[#FEE685] text-[#120D1C] border border-[#E6CA65]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List of Celestial Events */}
          <div className="space-y-5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="card-pastel-gold card-pastel-gold-hover rounded-3xl p-6 md:p-8 shadow-xl transition-all border border-[#E6CA65]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-2xl font-bold">
                        {evt.category === 'eclipse' && 'flare'}
                        {evt.category === 'lluvia_estrellas' && 'auto_awesome'}
                        {evt.category === 'alineacion' && 'grain'}
                        {evt.category === 'visualizacion_planetas' && 'public'}
                        {evt.category === 'fase_lunar' && 'nightlight'}
                      </span>
                    </div>

                    <div>
                      <span className="px-3 py-0.5 rounded-full bg-[#24153F] text-[#FEE685] text-[10px] font-extrabold font-['JetBrains_Mono'] uppercase">
                        {evt.categoryLabel}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] mt-1">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-left md:text-right bg-white/60 p-2.5 rounded-xl border border-[#E6CA65]/60">
                    <span className="block text-sm font-extrabold text-[#120D1C] font-['JetBrains_Mono']">
                      📅 {evt.date}
                    </span>
                    <span className="text-xs text-[#594A70] font-bold">
                      ⏰ Pico: {evt.peakTime}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#2B2538] font-medium leading-relaxed mb-4 font-['Plus_Jakarta_Sans']">
                  {evt.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E6CA65] text-xs mb-4">
                  <div className="flex items-center gap-2 text-[#120D1C] font-medium">
                    <span className="material-symbols-outlined text-base text-[#24153F]">location_on</span>
                    <span><strong>Zona óptima:</strong> {evt.bestVisibilityZone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#120D1C] font-medium">
                    <span className="material-symbols-outlined text-base text-[#24153F]">visibility</span>
                    <span><strong>Equipamiento:</strong> {evt.equipmentNeeded}</span>
                  </div>
                </div>

                {/* Google Calendar Sync Action Button */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E6CA65]">
                  {syncedEvents[evt.id] ? (
                    <a
                      href={syncedEvents[evt.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-2xl bg-[#0D5C35] text-white text-xs font-extrabold flex items-center gap-1.5 hover:bg-black transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Añadido a Google Calendar (Ver en Google)
                    </a>
                  ) : (
                    <button
                      onClick={() => handleOpenCalendarSync(evt)}
                      className="px-5 py-2.5 rounded-2xl bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">calendar_add_on</span>
                      Añadido / Sincronizar en Google Calendar
                    </button>
                  )}

                  <span className="text-[11px] text-[#594A70] font-['JetBrains_Mono'] font-bold hidden sm:inline">
                    Integración oficial Google Workspace
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};
