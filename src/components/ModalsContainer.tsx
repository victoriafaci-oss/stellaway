import React, { useState, useEffect } from 'react';
import { ModalType, ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../data/translations';

interface ModalsContainerProps {
  modalType: ModalType;
  closeModal: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  openModal: (type: ModalType) => void;
}

export const ModalsContainer: React.FC<ModalsContainerProps> = ({
  modalType,
  closeModal,
  setActiveTab,
  openModal,
}) => {
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const [settingsTab, setSettingsTab] = useState<'perfil' | 'tarifas' | 'pagos' | 'idiomas'>('tarifas');
  const [selectedPlan, setSelectedPlan] = useState<'free2days' | 'mensual' | 'anual'>('free2days');
  const [tempLanguage, setTempLanguage] = useState<SupportedLanguage>(language);
  const [langSuccessMsg, setLangSuccessMsg] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [sosActive, setSosActive] = useState<boolean>(false);

  useEffect(() => {
    setTempLanguage(language);
  }, [language, modalType]);

  const handleConfirmLanguage = (targetLang?: SupportedLanguage) => {
    const langToApply = targetLang || tempLanguage;
    setLanguage(langToApply);
    setTempLanguage(langToApply);
    const foundOpt = languageOptions.find((o) => o.code === langToApply);
    setLangSuccessMsg(`¡Idioma cambiado a ${foundOpt?.name || langToApply} correctamente!`);
    setTimeout(() => {
      setLangSuccessMsg(null);
    }, 3000);
  };


  // New card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [addCardSuccess, setAddCardSuccess] = useState(false);

  // Phone verification state for free trial (2 Días Gratis)
  const [phoneInput, setPhoneInput] = useState('');
  const [smsCodeInput, setSmsCodeInput] = useState('');
  const [smsSentStep, setSmsSentStep] = useState(false);
  const [trialErrorMsg, setTrialErrorMsg] = useState('');
  const [registeredTrialPhone, setRegisteredTrialPhone] = useState<string | null>(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem('stellaway_trial_phone');
    if (savedPhone) {
      setRegisteredTrialPhone(savedPhone);
    }
  }, []);

  if (!modalType) return null;

  const handleGoHome = () => {
    closeModal();
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={closeModal} />

      {/* MODAL 1: AJUSTES (SETTINGS) */}
      {modalType === 'settings' && (
        <div className="card-pastel-gold relative w-full max-w-xl border-2 border-[#38BDF8] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation: Atrás (curved arrow) & Inicio (casita) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#38BDF8]/60 mb-4 gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-black shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">settings</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-black text-[#030712] font-['Plus_Jakarta_Sans'] truncate">
                  Ajustes & Configuración
                </h2>
                <p className="text-[11px] text-[#082F49] font-black truncate">Perfil, suscripciones y métodos de pago</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={closeModal}
                className="px-2.5 py-1.5 bg-white hover:bg-[#F0F9FF] text-[#030712] border border-[#38BDF8] rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                title="Atrás (Volver)"
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">Atrás</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#0369A1] hover:bg-[#0284C7] text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-md"
                title="Ir a Inicio"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">Inicio</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white hover:bg-[#F0F9FF] text-[#030712] hover:text-black border border-[#38BDF8] transition-all cursor-pointer shadow-xs"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-base font-bold">close</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Tarifas & Suscripción | Perfil | Idiomas | Métodos de pago */}
          <div className="flex border-b border-[#38BDF8]/60 mb-4 gap-1 sm:gap-3 overflow-x-auto shrink-0">
            <button
              onClick={() => setSettingsTab('tarifas')}
              className={`pb-2.5 px-2.5 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-black transition-all relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                settingsTab === 'tarifas' ? 'text-[#0284C7]' : 'text-[#082F49] hover:text-[#030712]'
              }`}
            >
              <span className="material-symbols-outlined text-base">stars</span>
              Tarifas & Suscripción
              {settingsTab === 'tarifas' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0284C7] rounded-t-full shadow-[0_0_6px_#0284C7]" />
              )}
            </button>

            <button
              onClick={() => setSettingsTab('perfil')}
              className={`pb-2.5 px-2.5 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-black transition-all relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                settingsTab === 'perfil' ? 'text-[#0284C7]' : 'text-[#082F49] hover:text-[#030712]'
              }`}
            >
              <span className="material-symbols-outlined text-base">account_circle</span>
              Perfil
              {settingsTab === 'perfil' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#24153F] rounded-t-full shadow-[0_0_6px_#24153F]" />
              )}
            </button>

            <button
              onClick={() => setSettingsTab('idiomas')}
              className={`pb-2.5 px-2.5 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-extrabold transition-all relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                settingsTab === 'idiomas' ? 'text-[#24153F]' : 'text-[#594A70] hover:text-[#120D1C]'
              }`}
            >
              <span className="material-symbols-outlined text-base">language</span>
              Idiomas
              {settingsTab === 'idiomas' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#24153F] rounded-t-full shadow-[0_0_6px_#24153F]" />
              )}
            </button>

            <button
              onClick={() => setSettingsTab('pagos')}
              className={`pb-2.5 px-2.5 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-extrabold transition-all relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                settingsTab === 'pagos' ? 'text-[#24153F]' : 'text-[#594A70] hover:text-[#120D1C]'
              }`}
            >
              <span className="material-symbols-outlined text-base">credit_card</span>
              Métodos de pago
              {settingsTab === 'pagos' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#24153F] rounded-t-full shadow-[0_0_6px_#24153F]" />
              )}
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            {/* TAB TARIFAS DE SUSCRIPCIÓN */}
            {settingsTab === 'tarifas' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#082F49]/80 rounded-2xl border border-[#38BDF8]/40 text-xs text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8] block mb-0.5 font-['JetBrains_Mono']">
                    Planes & Tarifas StellaWay Astroturismo
                  </span>
                  <p className="text-[#BAE6FD] font-medium">
                    Elige tu suscripción para acceso ilimitado a telemetría, mapas Bortle 1-9 satelitales y cobertura del Eclipse 2026.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Plan 1: 48 Horas Gratis (Única opción con verificación por número de teléfono) */}
                  <div
                    onClick={() => {
                      setSelectedPlan('free2days');
                      setTrialErrorMsg('');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      selectedPlan === 'free2days'
                        ? 'bg-white border-2 border-[#0284C7] shadow-lg text-[#082F49]'
                        : 'bg-white/80 border border-[#38BDF8]/40 hover:bg-white text-[#082F49]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 bg-sky-100 text-sky-900 border border-sky-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Prueba Gratuita
                          </span>
                          {selectedPlan === 'free2days' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                              ✓ Seleccionado
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#082F49] font-['Plus_Jakarta_Sans']">
                          48 Horas Gratis (Acceso Total Ilimitado)
                        </h4>
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                          Acceso total a todas las herramientas durante 48 horas sin coste.
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                          📱 Verificación única por número de teléfono móvil (1 prueba por dispositivo).
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[#0284C7] font-['JetBrains_Mono']">0 €</span>
                        <span className="text-[10px] text-[#64748B] font-bold block">48 horas</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan 2: Cuota Mensual */}
                  <div
                    onClick={() => {
                      setSelectedPlan('mensual');
                      setTrialErrorMsg('');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      selectedPlan === 'mensual'
                        ? 'bg-white border-2 border-[#0284C7] shadow-lg text-[#082F49]'
                        : 'bg-white/80 border border-[#38BDF8]/40 hover:bg-white text-[#082F49]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 bg-[#0284C7] text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                            Plan Mensual
                          </span>
                          {selectedPlan === 'mensual' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                              ✓ Seleccionado
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#082F49] font-['Plus_Jakarta_Sans']">
                          Cuota Mensual Starlight Pro
                        </h4>
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                          Acceso ilimitado continuo con Stripe o PayPal. Cancelación en cualquier momento.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[#0284C7] font-['JetBrains_Mono']">3,99 €</span>
                        <span className="text-[10px] text-[#64748B] font-bold block">/ mes</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan 3: Cuota Anual */}
                  <div
                    onClick={() => {
                      setSelectedPlan('anual');
                      setTrialErrorMsg('');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      selectedPlan === 'anual'
                        ? 'bg-white border-2 border-amber-500 shadow-lg text-[#082F49]'
                        : 'bg-white/80 border border-[#38BDF8]/40 hover:bg-white text-[#082F49]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 bg-amber-200 text-amber-900 border border-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                            ⭐ Recomendado (Ahorro 58%)
                          </span>
                          {selectedPlan === 'anual' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                              ✓ Seleccionado
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#082F49] font-['Plus_Jakarta_Sans']">
                          Cuota Anual Starlight Pass
                        </h4>
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                          12 meses de cobertura completa para el Gran Eclipse Total 2026 y lluvias estelares.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[#0284C7] font-['JetBrains_Mono']">19,99 €</span>
                        <span className="text-[10px] text-[#64748B] font-bold block">/ año</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Verification Box for Phone Number when 48h Free Trial is Selected */}
                {selectedPlan === 'free2days' && (
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#38BDF8] space-y-3 my-2 shadow-sm text-[#082F49]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#0284C7] text-lg">smartphone</span>
                      <h5 className="text-xs font-black text-[#082F49] uppercase tracking-wider">
                        Verificación por Número de Teléfono (48 Horas Gratis)
                      </h5>
                    </div>

                    <p className="text-xs text-[#334155] leading-relaxed font-medium">
                      Para garantizar 1 sola prueba de 48 horas por persona y dispositivo, introduce tu número de teléfono móvil para recibir un código SMS gratuito.
                    </p>

                    {registeredTrialPhone ? (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                          <div>
                            <span className="font-black text-[#082F49] block">Prueba de 48 Horas Activa</span>
                            <span className="text-[11px] text-emerald-900 font-['JetBrains_Mono'] font-bold">Teléfono: {registeredTrialPhone}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-full uppercase">Acceso Total</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {!smsSentStep ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              setTrialErrorMsg('');
                              const cleanPhone = phoneInput.trim().replace(/\s+/g, '');
                              if (cleanPhone.length < 9) {
                                setTrialErrorMsg('Ingresa un número de teléfono válido (mínimo 9 dígitos).');
                                return;
                              }

                              const usedPhones = JSON.parse(localStorage.getItem('stellaway_used_trial_phones') || '[]');
                              const deviceUsed = localStorage.getItem('stellaway_device_trial_used');

                              if (usedPhones.includes(cleanPhone) || deviceUsed === 'true') {
                                setTrialErrorMsg(`⚠️ El teléfono (${cleanPhone}) o este dispositivo ya ha disfrutado de los 2 Días Gratis. Para continuar con acceso ilimitado, selecciona el Plan Mensual (3,99 €) o Anual (19,99 €).`);
                                return;
                              }

                              setSmsSentStep(true);
                            }}
                            className="space-y-2"
                          >
                            <div>
                              <label className="text-[11px] font-black text-[#082F49] block mb-1">
                                Número de Teléfono Móvil
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="tel"
                                  required
                                  value={phoneInput}
                                  onChange={(e) => {
                                    setPhoneInput(e.target.value);
                                    setTrialErrorMsg('');
                                  }}
                                  placeholder="+34 612 345 678"
                                  className="flex-1 px-3 py-2 bg-[#F0F9FF] border border-[#38BDF8] rounded-xl text-[#082F49] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#0284C7] font-bold"
                                />
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-black rounded-xl text-xs uppercase cursor-pointer transition-all shrink-0 shadow-md"
                                >
                                  Enviar SMS
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const cleanPhone = phoneInput.trim().replace(/\s+/g, '');
                              const usedPhones = JSON.parse(localStorage.getItem('stellaway_used_trial_phones') || '[]');
                              if (!usedPhones.includes(cleanPhone)) {
                                usedPhones.push(cleanPhone);
                                localStorage.setItem('stellaway_used_trial_phones', JSON.stringify(usedPhones));
                              }
                              localStorage.setItem('stellaway_device_trial_used', 'true');
                              localStorage.setItem('stellaway_trial_phone', cleanPhone);
                              localStorage.setItem('stellaway_trial_expires', String(Date.now() + 172800000));
                              localStorage.setItem('stellaway_subscription_active', 'true');

                              setRegisteredTrialPhone(cleanPhone);
                              setSmsSentStep(false);
                              setTrialErrorMsg('');
                            }}
                            className="space-y-2 bg-[#F0F9FF] p-3.5 rounded-xl border border-[#38BDF8]"
                          >
                            <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">sms</span>
                              Código de verificación SMS enviado a {phoneInput}.
                            </p>
                            <div>
                              <label className="text-[10px] text-[#082F49] font-bold block mb-0.5">Código SMS (Ej: 1234)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  required
                                  value={smsCodeInput}
                                  onChange={(e) => setSmsCodeInput(e.target.value)}
                                  placeholder="1234"
                                  className="flex-1 px-3 py-1.5 bg-white border border-[#38BDF8] rounded-lg text-[#082F49] text-xs font-mono font-bold focus:outline-none focus:border-[#0284C7]"
                                />
                                <button
                                  type="submit"
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs uppercase cursor-pointer transition-all shrink-0 shadow-md"
                                >
                                  Activar 48 Horas Gratis
                                </button>
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    {trialErrorMsg && (
                      <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-900 leading-relaxed font-bold">
                        {trialErrorMsg}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      closeModal();
                      setActiveTab('welcome');
                    }}
                    className="flex-1 py-3 bg-[#082F49] hover:bg-[#0C4A6E] text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#38BDF8]/40 shadow-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    <span>Portal de Suscripciones Completo</span>
                  </button>

                  <button
                    onClick={() => setSettingsTab('pagos')}
                    className="flex-1 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">credit_card</span>
                    <span>Pasarela de Pago</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB PERFIL */}
            {settingsTab === 'perfil' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/70 p-3 sm:p-4 rounded-2xl border border-[#E6CA65]">
                  <div className="w-12 h-12 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center text-lg font-extrabold shadow-md shrink-0">
                    AS
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#24153F] text-[#FEE685] text-[9px] font-extrabold uppercase tracking-wider block w-fit">
                      Observador Experto
                    </span>
                    <h3 className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] mt-0.5 truncate">
                      Astrónomo Starlight
                    </h3>
                    <p className="text-[11px] text-[#594A70] font-bold truncate">astronomo.starlight@stellaway.org</p>
                  </div>

                  <button
                    onClick={() => {
                      closeModal();
                      setActiveTab('profile');
                    }}
                    className="px-3 py-1.5 bg-[#24153F] text-[#FFF8D6] rounded-xl text-[11px] font-extrabold hover:bg-black transition-all cursor-pointer shrink-0"
                  >
                    Ver Perfil
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#E6CA65]">
                    <span className="text-[#594A70] block font-['JetBrains_Mono'] uppercase text-[10px] font-bold">Ubicación Preferida</span>
                    <span className="text-xs font-extrabold text-[#120D1C] mt-0.5 block truncate">Castellón / Penyagolosa</span>
                  </div>

                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#E6CA65]">
                    <span className="text-[#594A70] block font-['JetBrains_Mono'] uppercase text-[10px] font-bold">Registros Guardados</span>
                    <span className="text-xs font-extrabold text-[#24153F] mt-0.5 block">18 Sesiones</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB MÉTODOS DE PAGO */}
            {settingsTab === 'pagos' && (
              <div className="space-y-4">
                {/* Active Subscription Banner */}
                <div className="bg-white/80 p-4 rounded-2xl border-2 border-[#D4AF37] flex items-center justify-between gap-2 shadow-sm">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#24153F] font-['JetBrains_Mono'] block">
                      SUSCRIPCIÓN SELECCIONADA / ACTIVA
                    </span>
                    <h4 className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">
                      {selectedPlan === 'free2days'
                        ? '2 Días Gratis (Acceso Total Ilimitado)'
                        : selectedPlan === 'mensual'
                        ? 'Plan Mensual Starlight Pro (3,99 € / mes)'
                        : 'Plan Anual Starlight Pass (19,99 € / año)'}
                    </h4>
                    <p className="text-[11px] text-[#594A70] font-bold">
                      {selectedPlan === 'free2days'
                        ? registeredTrialPhone
                          ? `Verificado por teléfono: ${registeredTrialPhone} (48h de acceso ilimitado)`
                          : 'Requiere verificación por número de móvil (1 uso por usuario/dispositivo)'
                        : 'Telemetría en tiempo real, mapas HD y acceso ilimitado sin restricciones'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold rounded-full shrink-0">
                    Activa
                  </span>
                </div>

                {/* Saved Payment Methods */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#120D1C] mb-2 font-['Plus_Jakarta_Sans']">
                    Métodos de pago guardados
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-2xl border border-[#E6CA65] text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white tracking-widest">
                          VISA
                        </div>
                        <div>
                          <span className="font-extrabold text-[#120D1C] block">Visa termina en 4821</span>
                          <span className="text-[10px] text-[#594A70] font-bold">Caduca 08/2028</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-2xl border border-[#E6CA65] text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-6 rounded bg-[#0070BA] flex items-center justify-center font-black text-[10px] text-white">
                          PP
                        </div>
                        <div>
                          <span className="font-extrabold text-[#120D1C] block">PayPal Express</span>
                          <span className="text-[10px] text-[#594A70] font-bold">usuario@paypal.com</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-2xl border border-[#E6CA65] text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-6 rounded bg-white text-black border border-gray-300 flex items-center justify-center font-bold text-[10px]">
                          GPay
                        </div>
                        <div>
                          <span className="font-extrabold text-[#120D1C] block">Google Pay</span>
                          <span className="text-[10px] text-[#594A70] font-bold">Conectado</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    </div>
                  </div>
                </div>

                {/* Add New Card Form Toggle */}
                {!showAddCard ? (
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="w-full py-2.5 border-2 border-dashed border-[#D4AF37] hover:border-[#24153F] text-[#24153F] rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_card</span>
                    Añadir Nuevo Método de Pago
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setAddCardSuccess(true);
                      setTimeout(() => {
                        setAddCardSuccess(false);
                        setShowAddCard(false);
                      }, 1800);
                    }}
                    className="bg-white/80 p-3.5 rounded-2xl border-2 border-[#D4AF37] space-y-2.5"
                  >
                    <h5 className="text-[11px] font-extrabold text-[#24153F] uppercase tracking-wider">
                      Añadir Tarjeta de Crédito / Débito
                    </h5>

                    <div>
                      <label className="text-[10px] text-[#594A70] font-bold block mb-0.5">Titular de la tarjeta</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Ej. Nombre Apellido"
                        className="w-full px-3 py-2 bg-white border border-[#E6CA65] rounded-xl text-[#120D1C] text-xs focus:outline-none focus:border-[#24153F] font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#594A70] font-bold block mb-0.5">Número de tarjeta</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4500 **** **** 1234"
                          className="w-full px-3 py-2 bg-white border border-[#E6CA65] rounded-xl text-[#120D1C] text-xs focus:outline-none focus:border-[#24153F] font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#594A70] font-bold block mb-0.5">Expiración (MM/AA)</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/28"
                          className="w-full px-3 py-2 bg-white border border-[#E6CA65] rounded-xl text-[#120D1C] text-xs focus:outline-none focus:border-[#24153F] font-bold"
                        />
                      </div>
                    </div>

                    {addCardSuccess && (
                      <p className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        ¡Guardado correctamente!
                      </p>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddCard(false)}
                        className="px-3 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-bold"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold rounded-xl text-xs"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB IDIOMAS */}
            {settingsTab === 'idiomas' && (
              <div className="space-y-4">
                <p className="text-xs text-[#120D1C] font-['Plus_Jakarta_Sans'] font-medium">
                  Selecciona el idioma de la aplicación StellaWay Astroturismo:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleConfirmLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        language === lang.code
                          ? 'bg-white border-2 border-[#24153F] text-[#120D1C] font-extrabold shadow-md'
                          : 'bg-white/60 border border-[#E6CA65] text-[#120D1C] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="text-left">
                          <span className="text-xs block font-bold text-[#120D1C]">{lang.name}</span>
                          <span className="text-[10px] text-[#594A70] font-['JetBrains_Mono'] font-bold">{lang.note}</span>
                        </div>
                      </div>

                      {language === lang.code && (
                        <span className="material-symbols-outlined text-[#24153F] text-lg font-bold">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {langSuccessMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-extrabold flex items-center gap-2 animate-fadeIn">
                    <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                    <span>{langSuccessMsg}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: MENÚ RÁPIDO DESPLEGABLE (QUICK MENU) - COMPACT */}
      {modalType === 'quickMenu' && (
        <div className="card-pastel-gold relative w-full max-w-lg border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col">
          {/* Header with Navigation: Atrás (curved arrow) & Inicio (casita) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6CA65] mb-4 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center font-extrabold shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">
                  Menú StellaWay
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Accesos directos de navegación</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={closeModal}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title="Atrás (Volver)"
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">Atrás</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title="Ir a Inicio"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">Inicio</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Menu items compact grid */}
          <div className="overflow-y-auto space-y-2.5 pr-1">
            {/* 0. Stella IA (Featured at top) */}
            <button
              onClick={() => {
                closeModal();
                setActiveTab('assistant');
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0284C7]/20 via-[#38BDF8]/25 to-[#0284C7]/20 hover:from-[#0284C7]/30 hover:to-[#0284C7]/30 border-2 border-[#0284C7] shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl text-amber-300">smart_toy</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-[#082F49] group-hover:text-[#0284C7] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                    Stella IA (Asistente Estelar)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[#0369A1] font-bold truncate">Consultas astronómicas, telescopios y eclipse 2027</p>
              </div>
              <span className="material-symbols-outlined text-[#0284C7] text-base shrink-0">arrow_forward</span>
            </button>

            {/* 1. Hostelería */}
            <button
              onClick={() => {
                openModal('hosteleria');
              }}
              className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-[#E6CA65] hover:border-[#24153F] shadow-sm transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">hotel</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#120D1C] group-hover:text-[#24153F] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                  Hostelería Starlight
                </h3>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Alojamientos y cenas astronómicas</p>
              </div>
              <span className="material-symbols-outlined text-[#594A70] group-hover:text-[#24153F] text-base shrink-0">arrow_forward</span>
            </button>

            {/* 3. Emergencias */}
            <button
              onClick={() => {
                openModal('emergencias');
              }}
              className="p-3.5 rounded-2xl bg-red-100/80 hover:bg-red-100 border border-red-300 hover:border-red-500 shadow-sm transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">emergency</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-red-950 group-hover:text-red-800 transition-colors font-['Plus_Jakarta_Sans'] truncate">
                  Emergencias Starlight SOS
                </h3>
                <p className="text-[11px] text-red-900 font-bold truncate">Seguridad nocturna y llamada 112</p>
              </div>
              <span className="material-symbols-outlined text-red-700 text-base shrink-0">arrow_forward</span>
            </button>

            {/* 4. Accesorios */}
            <button
              onClick={() => {
                openModal('accesorios');
              }}
              className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-[#E6CA65] hover:border-[#24153F] shadow-sm transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-900 flex items-center justify-center shrink-0 border border-cyan-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">shopping_bag</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#120D1C] group-hover:text-[#24153F] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                  Accesorios & Tienda
                </h3>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Filtros solares ISO 12312-2 y linternas rojas</p>
              </div>
              <span className="material-symbols-outlined text-[#594A70] group-hover:text-[#24153F] text-base shrink-0">arrow_forward</span>
            </button>

            {/* 5. Idiomas */}
            <button
              onClick={() => {
                openModal('languages');
              }}
              className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-[#E6CA65] hover:border-[#24153F] shadow-sm transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 border border-blue-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">language</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#120D1C] group-hover:text-[#24153F] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                    {t('languages', 'Idiomas / Languages')}
                  </h3>
                  <span className="text-[10px] font-extrabold bg-[#24153F] text-[#FFF8D6] px-2 py-0.5 rounded-full border border-[#E6CA65]">
                    {language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                  </span>
                </div>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Cambiar entre Español e English</p>
              </div>
              <span className="material-symbols-outlined text-[#594A70] group-hover:text-[#24153F] text-base shrink-0">arrow_forward</span>
            </button>

            {/* 6. Ajustes, Tarifas & Perfil */}
            <button
              onClick={() => {
                openModal('settings');
              }}
              className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-[#E6CA65] hover:border-[#24153F] shadow-sm transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[#24153F] text-[#FEE685] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">settings</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#120D1C] group-hover:text-[#24153F] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                  Ajustes, Tarifas & Perfil
                </h3>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Suscripciones, cuotas y métodos de pago</p>
              </div>
              <span className="material-symbols-outlined text-[#594A70] group-hover:text-[#24153F] text-base shrink-0">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: HOSTELERÍA STARLIGHT - COMPACT */}
      {modalType === 'hosteleria' && (
        <div className="card-pastel-gold relative w-full max-w-xl border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation: Atrás (curved arrow) & Inicio (casita) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6CA65] mb-3 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center font-extrabold shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">hotel</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">
                  Hostelería Starlight
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Información y enlaces directos a webs oficiales</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title="Atrás (Volver)"
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">Atrás</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title="Ir a Inicio"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">Inicio</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Informational Disclaimer Banner */}
          <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs flex items-center gap-2 mb-3 shrink-0 font-medium">
            <span className="material-symbols-outlined text-[#B45309] text-base shrink-0 font-bold">info</span>
            <span>StellaWay es un portal informativo. Haz clic en <strong>Acceder sitio</strong> para consultar o reservar en la web oficial en tu navegador.</span>
          </div>

          <div className="overflow-y-auto space-y-3 pr-1">
            {[
              {
                title: 'Hotel Rural Penyagolosa Starlight',
                location: 'Vistabella del Maestrat (Castellón)',
                desc: 'Mirador privado con telescopio Goto y menú degustación astronómica.',
                badge: 'Certificado Starlight Gold',
                stars: '5.0 ★',
                url: 'https://www.google.com/search?q=Hotel+Rural+Penyagolosa+Vistabella+del+Maestrat',
              },
              {
                title: 'Parador de Morella',
                location: 'Morella (Castellón)',
                desc: 'Alojamiento histórico dentro de las murallas medievales con terrazas.',
                badge: 'Punto Clave Eclipse',
                stars: '4.9 ★',
                url: 'https://www.parador.es/es/paradores/parador-de-morella',
              },
              {
                title: 'Masía El Scurral Starlight Lodging',
                location: 'Culla (Castellón)',
                desc: 'Cabañas de madera con domo superior transparente.',
                badge: 'Cabañas Domo Cristal',
                stars: '4.8 ★',
                url: 'https://www.google.com/search?q=Masia+El+Scurral+Culla',
              },
              {
                title: 'Posada Sierra de Gúdar',
                location: 'Teruel - Cielos Negros',
                desc: 'Alojamiento para astrónomos con almacén de telescopios.',
                badge: 'Especializado Astrónomos',
                stars: '4.9 ★',
                url: 'https://www.google.com/search?q=Posada+Sierra+de+Gudar+Teruel',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/80 rounded-2xl p-3.5 border border-[#E6CA65] hover:border-[#24153F] shadow-sm transition-all">
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <div>
                    <span className="text-[10px] font-black text-[#B45309] uppercase font-['JetBrains_Mono'] block">
                      {item.badge}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#594A70] font-bold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs text-[#24153F]">location_on</span>
                      {item.location}
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#24153F] bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg shrink-0">
                    {item.stars}
                  </span>
                </div>

                <p className="text-xs text-[#2B2538] leading-relaxed mb-2.5 font-medium">{item.desc}</p>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6CA65]">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>Acceder sitio</span>
                    <span className="material-symbols-outlined text-sm font-bold">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 4: EMERGENCIAS STARLIGHT SOS - COMPACT */}
      {modalType === 'emergencias' && (
        <div className="card-pastel-gold relative w-full max-w-lg border-2 border-red-500 rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation: Atrás (curved arrow) & Inicio (casita) */}
          <div className="flex items-center justify-between pb-3 border-b border-red-300 mb-3 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center font-extrabold shrink-0 shadow-md shadow-red-600/30">
                <span className="material-symbols-outlined text-lg">emergency</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-red-950 font-['Plus_Jakarta_Sans'] truncate">
                  Emergencias SOS
                </h2>
                <p className="text-[11px] text-red-800 font-['JetBrains_Mono'] font-bold truncate">Información y teléfonos oficiales</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title="Atrás (Volver)"
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">Atrás</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title="Ir a Inicio"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">Inicio</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 rounded-2xl bg-red-100 border border-red-300 text-red-950 text-xs flex items-center gap-2 mb-3 shrink-0 font-medium">
            <span className="material-symbols-outlined text-red-600 text-base shrink-0 font-bold">warning</span>
            <span>StellaWay es un portal informativo y no presta servicio de rescate o asistencia propia. Contacta con organismos oficiales.</span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1">
            {/* GPS Coordinates Box */}
            <div className="bg-white/90 p-3.5 rounded-2xl border-2 border-red-300 flex items-center justify-between gap-2 shadow-sm">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-black text-red-900 font-['JetBrains_Mono'] block">
                  MIS COORDENADAS GPS
                </span>
                <span className="text-xs font-black text-[#120D1C] font-['JetBrains_Mono'] mt-0.5 block truncate">
                  40° 25' 12" N, 0° 12' 45" W (Castellón)
                </span>
              </div>
              <button
                onClick={() => alert('Coordenadas copiadas al portapapeles.')}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 shadow-md"
              >
                Copiar
              </button>
            </div>

            {/* Direct Link: Emergencias territoriales de ubicación exacta */}
            <a
              href="https://www.google.com/search?q=servicios+emergencias+112+comunidades+autonomas+espana"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3.5 bg-white/80 hover:bg-white text-[#24153F] border border-[#E6CA65] font-extrabold rounded-2xl flex items-center justify-center gap-2 text-xs font-['Plus_Jakarta_Sans'] transition-all shadow-sm text-center"
            >
              <span className="material-symbols-outlined text-base text-[#24153F]">travel_explore</span>
              <span>Acceder a emergencias territoriales de ubicación exacta</span>
              <span className="material-symbols-outlined text-sm font-bold">open_in_new</span>
            </a>

            {/* Direct Official Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="tel:112"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                112 Emergencias España
              </a>

              <a
                href="tel:062"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-lg">local_police</span>
                062 Guardia Civil
              </a>
            </div>

            {/* Flash screen SOS signal */}
            <button
              onClick={() => setSosActive(!sosActive)}
              className={`w-full py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                sosActive
                  ? 'bg-red-600 text-white border-white animate-pulse shadow-lg'
                  : 'bg-white/80 text-red-950 border-red-300 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">light_mode</span>
              {sosActive ? 'DETENER LUZ PARPADEANTE SOS' : 'ACTIVAR DESTELLO ROJO SOS'}
            </button>

            {/* First Aid tips */}
            <div className="bg-white/70 p-3.5 rounded-2xl border border-[#E6CA65] text-xs text-[#2B2538] space-y-1 font-medium">
              <h4 className="font-extrabold text-[#120D1C] flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-base text-red-600">medical_services</span>
                Guía de Seguridad Nocturna:
              </h4>
              <p>• Permanece cerca de tu vehículo o zona balizada en el mirador.</p>
              <p>• En caso de hipotermia o viento extremo, mantén tu manta térmica.</p>
              <p>• Facilita tus coordenadas GPS exactas al llamar al 112.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ACCESORIOS & EQUIPAMIENTO - COMPACT */}
      {modalType === 'accesorios' && (
        <div className="card-pastel-gold relative w-full max-w-xl border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation: Atrás (curved arrow) & Inicio (casita) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6CA65] mb-4 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center font-extrabold shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">
                  Accesorios Starlight
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Equipamiento homologado Eclipse 2026</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title="Atrás (Volver)"
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">Atrás</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title="Ir a Inicio"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">Inicio</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto space-y-2.5 pr-1">
            {[
              {
                title: 'Gafas Filtro Solar ISO 12312-2 (Pack 4u)',
                price: '12.90 €',
                desc: 'Observación segura de las fases parciales del Eclipse Solar 2026.',
                icon: 'visibility',
              },
              {
                title: 'Linterna LED de Luz Roja Regulable astronómica',
                price: '19.50 €',
                desc: 'Preserva 100% tu visión nocturna en el campo de observación.',
                icon: 'highlight',
              },
              {
                title: 'Adaptador Smartphone para Telescopio',
                price: '24.90 €',
                desc: 'Captura fotos de la Luna y planetas alineando la cámara.',
                icon: 'photo_camera',
              },
              {
                title: 'Ocular Baader Hyperion 13mm Gran Campo 68°',
                price: '145.00 €',
                desc: 'Nitidez cristalina para espacio profundo y la corona solar.',
                icon: 'auto_awesome',
              },
            ].map((prod, idx) => (
              <div key={idx} className="bg-white/80 rounded-2xl p-3.5 border border-[#E6CA65] flex items-center justify-between gap-3 shadow-sm hover:border-[#24153F] transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">{prod.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">{prod.title}</h3>
                    <p className="text-[11px] text-[#594A70] font-bold line-clamp-1">{prod.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-[#24153F] block font-['JetBrains_Mono'] mb-1">
                    {prod.price}
                  </span>
                  <button
                    onClick={() => alert(`Artículo "${prod.title}" añadido al carrito de compras.`)}
                    className="px-3 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL IDIOMAS */}
      {modalType === 'languages' && (
        <div className="card-pastel-gold relative w-full max-w-xl border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation: Atrás (curved arrow) & Inicio (casita) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6CA65] mb-4 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center font-extrabold shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">language</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">
                  Idiomas de la App
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">Selecciona tu idioma preferido</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title="Volver al Menú"
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">Atrás</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title="Ir a Inicio"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">Inicio</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            <p className="text-xs text-[#120D1C] font-['Plus_Jakarta_Sans'] font-medium">
              Selecciona tu idioma preferido (se aplicará al instante en toda la aplicación):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleConfirmLanguage(lang.code)}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    language === lang.code
                      ? 'bg-white border-2 border-[#24153F] text-[#120D1C] font-extrabold shadow-lg scale-[1.02]'
                      : 'bg-white/60 border border-[#E6CA65] text-[#120D1C] hover:bg-white hover:border-[#24153F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="text-left">
                      <span className="text-sm block font-extrabold text-[#120D1C]">{lang.name}</span>
                      <span className="text-[10px] text-[#594A70] font-['JetBrains_Mono'] font-bold">{lang.note}</span>
                    </div>
                  </div>

                  {language === lang.code && (
                    <span className="material-symbols-outlined text-[#24153F] text-xl font-bold">check_circle</span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification / Banner */}
            {langSuccessMsg && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-extrabold flex items-center gap-2 animate-fadeIn shadow-sm">
                <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                <span>{langSuccessMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-[#24153F] hover:bg-black text-[#FFF8D6] font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">done_all</span>
                <span>Guardar y Volver</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
