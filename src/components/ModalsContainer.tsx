import React, { useState, useEffect } from 'react';
import { ModalType, ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SubscriptionCancellationModal } from './SubscriptionCancellationModal';
import { withStripeLocale } from '../lib/i18nHelpers';
import { persistAppAccess } from '../lib/previewAccess';
import {
  watchLivePosition,
  formatCoordinatesDMS,
  buildGoogleMapsPinUrl,
  LiveCoordinates,
  GeolocationErrorCode,
} from '../lib/locationService';

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
  const { user, userLogs, saveUserProfileData } = useAuth();
  const currentLang = languageOptions.find((l) => l.code === language) || languageOptions[0];
  const [settingsTab, setSettingsTab] = useState<'perfil' | 'tarifas' | 'pagos' | 'idiomas'>('tarifas');
  const [selectedPlan, setSelectedPlan] = useState<'free2days' | 'mensual' | 'anual'>('free2days');
  const [tempLanguage, setTempLanguage] = useState<typeof language>(language);
  const [langSuccessMsg, setLangSuccessMsg] = useState<string | null>(null);
  const [sosCoords, setSosCoords] = useState<LiveCoordinates | null>(null);
  const [sosGpsError, setSosGpsError] = useState<GeolocationErrorCode | null>(null);
  const [sosLocating, setSosLocating] = useState<boolean>(false);
  const [sosRetryKey, setSosRetryKey] = useState<number>(0);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  useEffect(() => {
    setTempLanguage(language);
  }, [language, modalType]);

  // Real-time GPS tracking while SOS Emergencies modal is open
  useEffect(() => {
    if (modalType !== 'emergencias') return;
    setSosLocating(true);
    setSosGpsError(null);

    const stopWatching = watchLivePosition(
      (coords) => {
        setSosCoords(coords);
        setSosGpsError(null);
        setSosLocating(false);
      },
      (errCode) => {
        setSosGpsError(errCode);
        setSosLocating(false);
      }
    );

    return () => {
      stopWatching();
    };
  }, [modalType, sosRetryKey]);

  const handleConfirmLanguage = (targetLang?: typeof language) => {
    const langToApply = targetLang || tempLanguage;
    setLanguage(langToApply);
    setTempLanguage(langToApply);
    const foundOpt = languageOptions.find((o) => o.code === langToApply);
    setLangSuccessMsg(`${t('langChangedPrefix', '¡Idioma cambiado a')} ${foundOpt?.name || langToApply} ${t('langChangedSuffix', 'correctamente!')}`);
    setTimeout(() => {
      setLangSuccessMsg(null);
    }, 3000);
  };

  // Name + Email verification state for free trial (2 Días Gratis)
  const [trialFirstName, setTrialFirstName] = useState('');
  const [trialLastName, setTrialLastName] = useState('');
  const [trialEmailInput, setTrialEmailInput] = useState('');
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [emailSentStep, setEmailSentStep] = useState(false);
  const [trialErrorMsg, setTrialErrorMsg] = useState('');
  const [registeredTrialEmail, setRegisteredTrialEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedTrialContact =
      localStorage.getItem('stellaway_trial_email') || localStorage.getItem('stellaway_trial_phone');
    if (savedTrialContact) {
      setRegisteredTrialEmail(savedTrialContact);
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
                  {t('mcSettingsTitle', 'Ajustes & Configuración')}
                </h2>
                <p className="text-[11px] text-[#082F49] font-black truncate">{t('mcSettingsSubtitle', 'Perfil, suscripciones y métodos de pago')}</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={closeModal}
                className="px-2.5 py-1.5 bg-white hover:bg-[#F0F9FF] text-[#030712] border border-[#38BDF8] rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                title={t('mcBackBtn', 'Atrás')}
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">{t('mcBackBtn', 'Atrás')}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#0369A1] hover:bg-[#0284C7] text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-md"
                title={t('mcHomeBtn', 'Inicio')}
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">{t('mcHomeBtn', 'Inicio')}</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white hover:bg-[#F0F9FF] text-[#030712] hover:text-black border border-[#38BDF8] transition-all cursor-pointer shadow-xs"
                title={t('mcCloseBtn', 'Cerrar')}
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
              {t('mcTabTariffs', 'Tarifas & Suscripción')}
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
              {t('mcTabProfile', 'Perfil')}
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
              {t('mcTabLangs', 'Idiomas')}
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
              {t('mcTabCards', 'Métodos de pago')}
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
                    {t('mcTariffsBannerTitle', 'Planes & Tarifas StellaWay Astroturismo')}
                  </span>
                  <p className="text-[#BAE6FD] font-medium">
                    {t('mcTariffsIntro', 'Elige tu suscripción para acceso ilimitado a enclaves Starlight, DarkSky, previsión meteorológica real y cobertura del Eclipse 2026–2027.')}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Plan 1: 48 Horas Gratis (Verificación por nombre y email) */}
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
                            {t('mcFreeTrialPill', 'Prueba Gratuita')}
                          </span>
                          {selectedPlan === 'free2days' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                              {t('mcSelectedPill', '✓ Seleccionado')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#082F49] font-['Plus_Jakarta_Sans']">
                          {t('mcPlan48Title', '48 Horas Gratis (Acceso Total Ilimitado)')}
                        </h4>
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                          {t('mcPlan48Desc', 'Acceso total a todas las herramientas durante 48 horas sin coste.')}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                          {t('mcTrialDeviceTag', '✉️ Verificación única por email y nombre (1 prueba por dispositivo).')}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[#0284C7] font-['JetBrains_Mono']">0 €</span>
                        <span className="text-[10px] text-[#64748B] font-bold block">{t('mcPlanFreeHours', '48 horas')}</span>
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
                            {t('mcPlanMonthlyBadge', 'Plan Mensual')}
                          </span>
                          {selectedPlan === 'mensual' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                              {t('mcSelectedPill', '✓ Seleccionado')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#082F49] font-['Plus_Jakarta_Sans']">
                          {t('mcPlanMonthlyTitle', 'Cuota Mensual Starlight Pro')}
                        </h4>
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                          {t('mcPlanMonthlyDesc', 'Acceso ilimitado continuo con Stripe o PayPal. Cancelación en cualquier momento.')}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[#0284C7] font-['JetBrains_Mono']">{t('mcPlanMonthlyPrice', '3,99 €')}</span>
                        <span className="text-[10px] text-[#64748B] font-bold block">{t('mcPerMonth', '/ mes')}</span>
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
                            {t('mcRecommendedSave', '⭐ Recomendado (Ahorro 58%)')}
                          </span>
                          {selectedPlan === 'anual' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                              {t('mcSelectedPill', '✓ Seleccionado')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#082F49] font-['Plus_Jakarta_Sans']">
                          {t('mcPlanAnnualTitle', 'Cuota Anual Starlight Pass')}
                        </h4>
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                          {t('mcPlanAnnualDesc', '12 meses de cobertura completa para el Gran Eclipse Total y lluvias estelares.')}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-[#0284C7] font-['JetBrains_Mono']">{t('mcPlanAnnualPrice', '19,99 €')}</span>
                        <span className="text-[10px] text-[#64748B] font-bold block">{t('mcPerYear', '/ año')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Verification Box for Email + Name when 48h Free Trial is Selected */}
                {selectedPlan === 'free2days' && (
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#38BDF8] space-y-3 my-2 shadow-sm text-[#082F49]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#0284C7] text-lg">mail</span>
                      <h5 className="text-xs font-black text-[#082F49] uppercase tracking-wider">
                        {t('mcVerifyPhoneBoxTitle', 'Verificación por Email (48 Horas Gratis)')}
                      </h5>
                    </div>

                    <p className="text-xs text-[#334155] leading-relaxed font-medium">
                      {t('mcVerifyPhoneBoxDesc', 'Introduce tu nombre, apellidos y correo electrónico para recibir tu código de verificación gratuito (1 prueba por cuenta).')}
                    </p>

                    {registeredTrialEmail ? (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                          <div>
                            <span className="font-black text-[#082F49] block">{t('mcTrialActiveTitle', 'Prueba de 48 Horas Activa')}</span>
                            <span className="text-[11px] text-emerald-900 font-['JetBrains_Mono'] font-bold">{t('mcPhonePrefix', 'Email:')} {registeredTrialEmail}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-full uppercase">{t('mcFullAccessPill', 'Acceso Total')}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {!emailSentStep ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              setTrialErrorMsg('');
                              const cleanFirst = trialFirstName.trim();
                              const cleanLast = trialLastName.trim();
                              const cleanEmail = trialEmailInput.trim().toLowerCase();
                              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

                              if (cleanFirst.length < 2 || cleanLast.length < 2) {
                                setTrialErrorMsg(t('welcomeErrInvalidName', 'Introduce tu nombre y apellidos.'));
                                return;
                              }

                              if (!isValidEmail) {
                                setTrialErrorMsg(t('mcSettingsErrPhone', 'Ingresa un correo electrónico válido.'));
                                return;
                              }

                              const usedEmails = JSON.parse(localStorage.getItem('stellaway_used_trial_emails') || '[]');
                              const deviceUsed = localStorage.getItem('stellaway_device_trial_used');

                              if (usedEmails.includes(cleanEmail) || deviceUsed === 'true') {
                                setTrialErrorMsg(t('mcErrUsedDevice', '⚠️ Este email o dispositivo ya ha disfrutado de los 2 Días Gratis. Selecciona el Plan Mensual (3,99 €) o Anual (19,99 €).'));
                                return;
                              }

                              fetch('/api/verify-trial-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ firstName: cleanFirst, lastName: cleanLast, email: cleanEmail, language }),
                              }).catch(() => {});

                              setEmailSentStep(true);
                            }}
                            className="space-y-2"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[11px] font-black text-[#082F49] block mb-1">
                                  {t('welcomeFirstNameLabel', 'Nombre')}
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={trialFirstName}
                                  onChange={(e) => {
                                    setTrialFirstName(e.target.value);
                                    setTrialErrorMsg('');
                                  }}
                                  placeholder={t('welcomeFirstNamePlaceholder', 'Tu nombre')}
                                  className="w-full px-3 py-2 bg-[#F0F9FF] border border-[#38BDF8] rounded-xl text-[#082F49] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#0284C7] font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-black text-[#082F49] block mb-1">
                                  {t('welcomeLastNameLabel', 'Apellidos')}
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={trialLastName}
                                  onChange={(e) => {
                                    setTrialLastName(e.target.value);
                                    setTrialErrorMsg('');
                                  }}
                                  placeholder={t('welcomeLastNamePlaceholder', 'Tus apellidos')}
                                  className="w-full px-3 py-2 bg-[#F0F9FF] border border-[#38BDF8] rounded-xl text-[#082F49] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#0284C7] font-bold"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[11px] font-black text-[#082F49] block mb-1">
                                {t('mcPlan48PhoneLabel', 'Correo Electrónico')}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="email"
                                  required
                                  value={trialEmailInput}
                                  onChange={(e) => {
                                    setTrialEmailInput(e.target.value);
                                    setTrialErrorMsg('');
                                  }}
                                  placeholder={t('mcPlan48PhonePlaceholder', 'tu@email.com')}
                                  className="flex-1 px-3 py-2 bg-[#F0F9FF] border border-[#38BDF8] rounded-xl text-[#082F49] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#0284C7] font-bold"
                                />
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-black rounded-xl text-xs uppercase cursor-pointer transition-all shrink-0 shadow-md"
                                >
                                  {t('mcPlan48BtnSend', 'Enviar Código')}
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const cleanFirst = trialFirstName.trim();
                              const cleanLast = trialLastName.trim();
                              const cleanEmail = trialEmailInput.trim().toLowerCase();
                              const trialExpiresAt = Date.now() + 172800000;

                              persistAppAccess({
                                planId: 'free2days',
                                email: cleanEmail,
                                name: `${cleanFirst} ${cleanLast}`.trim(),
                                trialExpiresAt,
                                provider: 'StellaWay 48h Trial',
                              });

                              if (user) {
                                saveUserProfileData({
                                  subscriptionPlan: 'free2days',
                                  accessActive: true,
                                  trialEmail: cleanEmail,
                                  trialExpiresAt,
                                  paymentProvider: 'StellaWay 48h Trial',
                                }).catch(() => {});
                              }

                              fetch('/api/verify-trial-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  firstName: cleanFirst,
                                  lastName: cleanLast,
                                  email: cleanEmail,
                                  code: emailCodeInput,
                                  language,
                                }),
                              }).catch(() => {});

                              setRegisteredTrialEmail(cleanEmail);
                              setEmailSentStep(false);
                              setTrialErrorMsg('');
                            }}
                            className="space-y-2 bg-[#F0F9FF] p-3.5 rounded-xl border border-[#38BDF8]"
                          >
                            <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">mail</span>
                              {t('mcPlan48SmsSent', 'Código de verificación enviado a')} {trialEmailInput}.
                            </p>
                            <div>
                              <label className="text-[10px] text-[#082F49] font-bold block mb-0.5">{t('mcSmsLabelHint', 'Código de verificación (Ej: 1234)')}</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  required
                                  value={emailCodeInput}
                                  onChange={(e) => setEmailCodeInput(e.target.value)}
                                  placeholder="1234"
                                  className="flex-1 px-3 py-1.5 bg-white border border-[#38BDF8] rounded-lg text-[#082F49] text-xs font-mono font-bold focus:outline-none focus:border-[#0284C7]"
                                />
                                <button
                                  type="submit"
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs uppercase cursor-pointer transition-all shrink-0 shadow-md"
                                >
                                  {t('mcPlan48BtnVerify', 'Activar 48 Horas Gratis')}
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

                {/* DERECHO DE DESISTIMIENTO Y BAJA DIRECTA DE SUSCRIPCIÓN (COMPLIANCE LEGAL CONSUMIDORES) */}
                <div className="p-4 bg-gradient-to-r from-rose-950/50 via-rose-900/40 to-[#082F49] rounded-2xl border-2 border-rose-500/70 text-white space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-400 text-xl">cancel</span>
                      <h5 className="text-xs font-black text-white uppercase tracking-wider">
                        {t('mcCancelBoxTitle', 'Dar de baja la suscripción o prueba gratuita')}
                      </h5>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-[9px] font-black uppercase">
                      {t('mcCancelImmediateBadge', 'Baja Inmediata Stripe')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#BAE6FD] leading-relaxed">
                    {t('mcCancelBoxDesc', 'Conforme a la normativa legal de protección a consumidores y usuarios, puedes tramitar la baja o cancelación de la renovación en cualquier momento. La baja se comunica a Stripe para frenar de inmediato cualquier cobro futuro.')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="flex-1 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all border border-rose-300/60"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                      <span>{t('mcCancelBoxBtn', 'Dar de baja la suscripción')}</span>
                    </button>
                    <a
                      href={withStripeLocale('https://billing.stripe.com/', language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-3 bg-white/10 hover:bg-white/20 text-[#7DD3FC] hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-white/20 transition-all"
                    >
                      <span>{t('mcStripePortalBtn', 'Portal Stripe')}</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      closeModal();
                      setActiveTab('welcome');
                    }}
                    className="flex-1 py-3 bg-[#082F49] hover:bg-[#0C4A6E] text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#38BDF8]/40 shadow-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    <span>{t('mcFullPortalBtn', 'Portal de Suscripciones Completo')}</span>
                  </button>

                  <button
                    onClick={() => setSettingsTab('pagos')}
                    className="flex-1 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">credit_card</span>
                    <span>{t('mcPaymentGatewayBtn', 'Pasarela de Pago')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB PERFIL */}
            {settingsTab === 'perfil' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/70 p-3 sm:p-4 rounded-2xl border border-[#E6CA65]">
                  <div className="w-12 h-12 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center text-lg font-extrabold shadow-md shrink-0 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'Usuario'} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user?.displayName || 'SW').slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#24153F] text-[#FEE685] text-[9px] font-extrabold uppercase tracking-wider block w-fit">
                      {user ? t('profileFirebaseSync', 'Sincronizado en Nube Firebase') : t('profileObserverLocal', 'Modo Observador Local')}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] mt-0.5 truncate">
                      {user?.displayName || t('profileObserverLocal', 'Modo Observador Local')}
                    </h3>
                    <p className="text-[11px] text-[#594A70] font-bold truncate">
                      {user?.email || t('profileDefaultLoc', 'Cuenta local sin sesión Google')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      closeModal();
                      setActiveTab('profile');
                    }}
                    className="px-3 py-1.5 bg-[#24153F] text-[#FFF8D6] rounded-xl text-[11px] font-extrabold hover:bg-black transition-all cursor-pointer shrink-0"
                  >
                    {t('mcViewProfileBtn', 'Ver Perfil')}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#E6CA65]">
                    <span className="text-[#594A70] block font-['JetBrains_Mono'] uppercase text-[10px] font-bold">{t('mcSavedLogsLabel', 'Registros en Diario')}</span>
                    <span className="text-xs font-extrabold text-[#24153F] mt-0.5 block">
                      {userLogs.length} {t('profileSessionsUnit', 'observaciones')}
                    </span>
                  </div>

                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#E6CA65]">
                    <span className="text-[#594A70] block font-['JetBrains_Mono'] uppercase text-[10px] font-bold">{t('mcSelectedActiveSub', 'Estado de Acceso')}</span>
                    <span className="text-xs font-extrabold text-[#120D1C] mt-0.5 block truncate">
                      {registeredTrialEmail ? `${t('mcTrialActiveTitle', 'Prueba 48h')}: ${registeredTrialEmail}` : t('mcFullAccessReady', 'Configurado en Ajustes')}
                    </span>
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
                      {t('mcSelectedActiveSub', 'SUSCRIPCIÓN SELECCIONADA / ACTIVA')}
                    </span>
                    <h4 className="text-sm font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans']">
                      {selectedPlan === 'free2days'
                        ? t('mcPlan48hUnlimited', '2 Días Gratis (Acceso Total Ilimitado)')
                        : selectedPlan === 'mensual'
                        ? t('mcPlanMonthlyProFull', 'Plan Mensual Starlight Pro (3,99 € / mes)')
                        : t('mcPlanAnnualPassFull', 'Plan Anual Starlight Pass (19,99 € / año)')}
                    </h4>
                    <p className="text-[11px] text-[#594A70] font-bold">
                      {selectedPlan === 'free2days'
                        ? registeredTrialEmail
                          ? `${t('mcPhoneVerifiedDesc', 'Verificado por email (48h de acceso ilimitado):')} ${registeredTrialEmail}`
                          : t('mcPhoneReqDesc', 'Requiere nombre, apellidos y verificación por email (1 uso por cuenta/dispositivo)')
                        : t('mcPaidPlanDesc', 'Telemetría en tiempo real, mapas HD y acceso ilimitado sin restricciones')}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold rounded-full shrink-0">
                    {t('mcActiveStatus', 'Activa')}
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 underline cursor-pointer py-1"
                  >
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    <span>{t('mcCancelBoxBtn', 'Dar de baja la suscripción')}</span>
                  </button>
                </div>

                {/* Official Stripe Links for Active Plans */}
                <div className="bg-[#F0F9FF] p-4 rounded-2xl border border-[#38BDF8]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0284C7] font-['JetBrains_Mono']">
                      {t('mcStripeLinksHeader', 'Pasarela Oficial Stripe StellaWay')}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black rounded-full">
                      {t('mcVerifiedLinksBadge', '✓ Enlaces Verificados')}
                    </span>
                  </div>
                  <p className="text-xs text-[#082F49] font-medium">
                    {t('mcStripeLinksDesc', 'Puedes activar tu prueba o abonar tu suscripción mediante los enlaces oficiales seguros de Stripe de StellaWay:')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <a
                      href={withStripeLocale('https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06', language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white border border-[#38BDF8] rounded-xl flex items-center justify-between hover:border-[#0284C7] transition-all group"
                    >
                      <div>
                        <span className="font-black text-xs text-[#082F49] block">{t('mcStripeTrialCardTitle', 'Prueba 48h (0,00 €)')}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{t('mcStripeTrialCardSub', 'Registro Gratuito')}</span>
                      </div>
                      <span className="material-symbols-outlined text-[#0284C7] group-hover:translate-x-0.5 transition-transform text-base">
                        open_in_new
                      </span>
                    </a>

                    <a
                      href={withStripeLocale('https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04', language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white border border-[#38BDF8] rounded-xl flex items-center justify-between hover:border-[#0284C7] transition-all group"
                    >
                      <div>
                        <span className="font-black text-xs text-[#082F49] block">{t('mcStripeMonthlyCardTitle', 'Plan Mensual (3,99 €)')}</span>
                        <span className="text-[10px] text-[#64748B]">{t('mcStripeMonthlyCardSub', 'Enlace Directo Stripe')}</span>
                      </div>
                      <span className="material-symbols-outlined text-[#0284C7] group-hover:translate-x-0.5 transition-transform text-base">
                        open_in_new
                      </span>
                    </a>

                    <a
                      href={withStripeLocale('https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05', language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white border border-[#38BDF8] rounded-xl flex items-center justify-between hover:border-[#0284C7] transition-all group"
                    >
                      <div>
                        <span className="font-black text-xs text-[#082F49] block">{t('mcStripeAnnualCardTitle', 'Plan Anual (19,99 €)')}</span>
                        <span className="text-[10px] text-[#64748B]">{t('mcStripeAnnualCardSub', 'Enlace Directo Stripe')}</span>
                      </div>
                      <span className="material-symbols-outlined text-[#0284C7] group-hover:translate-x-0.5 transition-transform text-base">
                        open_in_new
                      </span>
                    </a>
                  </div>
                </div>

                {/* Stripe Customer Billing Portal (Real external management) */}
                <div className="bg-white/80 p-4 rounded-2xl border border-[#E6CA65] space-y-2.5 text-xs">
                  <h4 className="font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#0284C7]">shield_lock</span>
                    <span>{t('mcSavedMethodsTitle', 'Gestión de tarjetas y facturación en Stripe')}</span>
                  </h4>
                  <p className="text-[11px] text-[#334155] leading-relaxed">
                    {t('mcStripeBillingPortalDesc', 'Tus tarjetas, Apple Pay, Google Pay y facturas se gestionan directamente en los servidores cifrados de Stripe, sin almacenar datos bancarios en esta aplicación.')}
                  </p>
                  <a
                    href={withStripeLocale('https://billing.stripe.com/', language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    <span>{t('mcStripePortalBtn', 'Abrir Portal Stripe')}</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB IDIOMAS */}
            {settingsTab === 'idiomas' && (
              <div className="space-y-4">
                <p className="text-xs text-[#120D1C] font-['Plus_Jakarta_Sans'] font-medium">
                  {t('mcLangSelectIntro', 'Selecciona el idioma de la aplicación StellaWay Astroturismo:')}
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
                  {t('mcQuickMenuTitle', 'Menú StellaWay')}
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">{t('mcQuickMenuSubtitle', 'Accesos directos de navegación')}</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={closeModal}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title={t('mcBackBtn', 'Atrás')}
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">{t('mcBackBtn', 'Atrás')}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title={t('mcHomeBtn', 'Inicio')}
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">{t('mcHomeBtn', 'Inicio')}</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title={t('mcCloseBtn', 'Cerrar')}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Menu items compact grid */}
          <div className="overflow-y-auto space-y-2.5 pr-1">
            {/* Eclipse Total 2 Ago 2027 */}
            <button
              onClick={() => {
                closeModal();
                setActiveTab('eclipse2027');
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#170E28] via-[#24153F] to-[#170E28] hover:from-[#24153F] hover:to-[#321C58] border-2 border-[#FEE685]/60 shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEE685] text-[#120D1C] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">wb_twilight</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FEE685] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                    {t('ec27QuickTitle', 'Eclipse Solar Total · 2 Ago 2027')}
                  </h3>
                  <span className="text-[10px] font-bold text-[#FEE685] tracking-wide">
                    · 6m 23s
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 font-semibold truncate">{t('ec27QuickSub', 'Ruta, horarios C1–C4, seguridad ISO y checklist')}</p>
              </div>
              <span className="material-symbols-outlined text-[#FEE685] text-base shrink-0">arrow_forward</span>
            </button>

            {/* 0. Tienda Astronómica (inside 3-bars menu) */}
            <button
              onClick={() => {
                closeModal();
                setActiveTab('shop');
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FEE685]/20 via-[#E5B54F]/25 to-[#FEE685]/20 hover:from-[#FEE685]/35 hover:to-[#E5B54F]/35 border-2 border-[#D4AF37] shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[#24153F] text-[#FEE685] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform border border-[#FEE685]/40">
                <span className="material-symbols-outlined text-xl">storefront</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FEE685] transition-colors font-['Plus_Jakarta_Sans'] truncate">
                    {t('mcQuickShopTitle', 'Tienda Astronómica')}
                  </h3>
                  <span className="text-[10px] font-bold text-[#FEE685] tracking-wide">
                    · {t('mcQuickShopBadge', 'Equipo')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 font-semibold truncate">{t('mcQuickShopDesc', 'Telescopios, prismáticos, astrofotografía y gafas ISO')}</p>
              </div>
              <span className="material-symbols-outlined text-[#FEE685] text-base shrink-0">arrow_forward</span>
            </button>

            {/* Instalar App en el móvil */}
            <button
              onClick={() => {
                closeModal();
                window.dispatchEvent(new CustomEvent('open-install-modal'));
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-300 shadow-sm transition-all flex items-center gap-3 text-left group cursor-pointer w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">install_mobile</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-amber-950 font-['Plus_Jakarta_Sans'] truncate">
                    {t('mcQuickInstallTitle', 'Instalar StellaWay en el Móvil')}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[9px] font-black uppercase tracking-wider">
                    PWA
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 font-bold truncate">{t('mcQuickInstallDesc', 'Añadir icono a la pantalla de inicio')}</p>
              </div>
              <span className="material-symbols-outlined text-amber-800 text-base shrink-0">arrow_forward</span>
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
                  {t('mcQuickSosTitle', 'Emergencias Starlight SOS')}
                </h3>
                <p className="text-[11px] text-red-900 font-bold truncate">{t('mcQuickSosDesc', 'Seguridad nocturna y llamada 112')}</p>
              </div>
              <span className="material-symbols-outlined text-red-700 text-base shrink-0">arrow_forward</span>
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
                    {t('languages', 'Idiomas')}
                  </h3>
                  <span className="text-[10px] font-extrabold bg-[#24153F] text-[#FFF8D6] px-2 py-0.5 rounded-full border border-[#E6CA65]">
                    {currentLang.flag} {currentLang.name}
                  </span>
                </div>
                <p className="text-[11px] text-[#594A70] font-bold truncate">{t('mcQuickLangSwitchDesc', 'Cambiar idioma entre Español, English, Français, Português, Italiano y Deutsch')}</p>
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
                  {t('mcQuickSettingsTitle', 'Ajustes, Tarifas & Perfil')}
                </h3>
                <p className="text-[11px] text-[#594A70] font-bold truncate">{t('mcQuickSettingsDesc', 'Suscripciones, cuotas y métodos de pago')}</p>
              </div>
              <span className="material-symbols-outlined text-[#594A70] group-hover:text-[#24153F] text-base shrink-0">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: HOSTELERÍA STARLIGHT - COMPACT */}
      {modalType === 'hosteleria' && (
        <div className="card-pastel-gold relative w-full max-w-xl border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6CA65] mb-3 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center font-extrabold shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">hotel</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">
                  {t('mcHosteleriaTitle', 'Hostelería Starlight')}
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">{t('mcHosteleriaSub', 'Información y enlaces directos a webs oficiales')}</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title={t('mcBackBtn', 'Atrás')}
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">{t('mcBackBtn', 'Atrás')}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title={t('mcHomeBtn', 'Inicio')}
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">{t('mcHomeBtn', 'Inicio')}</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title={t('mcCloseBtn', 'Cerrar')}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Informational Disclaimer Banner */}
          <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs flex items-center gap-2 mb-3 shrink-0 font-medium">
            <span className="material-symbols-outlined text-[#B45309] text-base shrink-0 font-bold">info</span>
            <span>{t('mcHosteleriaNotice', 'StellaWay es un portal informativo. Haz clic en Acceder sitio para consultar o reservar en la web oficial en tu navegador.')}</span>
          </div>

          <div className="overflow-y-auto space-y-3 pr-1">
            {[
              {
                title: 'Hotel Rural Penyagolosa Starlight',
                location: 'Vistabella del Maestrat (Castellón)',
                desc: t('mcHosteleria1Desc', 'Mirador privado con telescopio Goto y menú degustación astronómica.'),
                badge: t('mcHosteleria1Badge', 'Certificado Starlight Gold'),
                stars: '5.0 ★',
                url: 'https://www.google.com/search?q=Hotel+Rural+Penyagolosa+Vistabella+del+Maestrat',
              },
              {
                title: 'Parador de Morella',
                location: 'Morella (Castellón)',
                desc: t('mcHosteleria2Desc', 'Alojamiento histórico dentro de las murallas medievales con terrazas.'),
                badge: t('mcHosteleria2Badge', 'Punto Clave Eclipse'),
                stars: '4.9 ★',
                url: 'https://www.parador.es/es/paradores/parador-de-morella',
              },
              {
                title: 'Masía El Scurral Starlight Lodging',
                location: 'Culla (Castellón)',
                desc: t('mcHosteleria3Desc', 'Cabañas de madera con domo superior transparente.'),
                badge: t('mcHosteleria3Badge', 'Cabañas Domo Cristal'),
                stars: '4.8 ★',
                url: 'https://www.google.com/search?q=Masia+El+Scurral+Culla',
              },
              {
                title: 'Posada Sierra de Gúdar',
                location: 'Teruel - Cielos Negros',
                desc: t('mcHosteleria4Desc', 'Alojamiento para astrónomos con almacén de telescopios.'),
                badge: t('mcHosteleria4Badge', 'Especializado Astrónomos'),
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
                    <span>{t('mcHosteleriaVisitBtn', 'Acceder sitio')}</span>
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
          {/* Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-red-300 mb-3 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center font-extrabold shrink-0 shadow-md shadow-red-600/30">
                <span className="material-symbols-outlined text-lg">emergency</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-red-950 font-['Plus_Jakarta_Sans'] truncate">
                  {t('mcSosTitle', 'Emergencias SOS')}
                </h2>
                <p className="text-[11px] text-red-800 font-['JetBrains_Mono'] font-bold truncate">{t('mcSosSub', 'Información y teléfonos oficiales')}</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title={t('mcBackBtn', 'Atrás')}
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">{t('mcBackBtn', 'Atrás')}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title={t('mcHomeBtn', 'Inicio')}
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">{t('mcHomeBtn', 'Inicio')}</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title={t('mcCloseBtn', 'Cerrar')}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 rounded-2xl bg-red-100 border border-red-300 text-red-950 text-xs flex items-center gap-2 mb-3 shrink-0 font-medium">
            <span className="material-symbols-outlined text-red-600 text-base shrink-0 font-bold">warning</span>
            <span>{t('mcSosDisclaimer', 'StellaWay es un portal informativo y no presta servicio de rescate o asistencia propia. Contacta con organismos oficiales.')}</span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1">
            {/* Real-Time GPS Coordinates Box */}
            <div className="bg-white/95 p-3.5 rounded-2xl border-2 border-red-300 space-y-2.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-black text-red-900 font-['JetBrains_Mono']">
                      {t('mcSosCoordsLabel', 'MIS COORDENADAS GPS')}
                    </span>
                    {sosCoords && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase">
                        ● GPS{sosCoords.accuracyMeters ? ` ±${sosCoords.accuracyMeters}m` : ''}
                      </span>
                    )}
                  </div>

                  {sosCoords ? (
                    <div className="mt-1 space-y-0.5">
                      <span className="text-xs sm:text-sm font-black text-[#120D1C] font-['JetBrains_Mono'] block">
                        {formatCoordinatesDMS(sosCoords.lat, sosCoords.lng)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 font-['JetBrains_Mono'] block">
                        {sosCoords.lat.toFixed(6)}, {sosCoords.lng.toFixed(6)}
                      </span>
                    </div>
                  ) : sosLocating ? (
                    <span className="text-xs font-bold text-slate-700 mt-1 block">
                      {t('spotsGpsObtaining', 'Obteniendo coordenadas GPS de tu dispositivo...')}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-700 mt-1 block">
                      {sosGpsError === 'denied'
                        ? t('gpsErrDenied', 'Permiso GPS denegado. Activa la ubicación en tu navegador/móvil para obtener tus coordenadas reales.')
                        : sosGpsError === 'unsupported'
                        ? t('gpsErrUnsupported', 'Tu navegador no soporta geolocalización GPS.')
                        : t('gpsErrUnavailable', 'No se pudo obtener señal GPS todavía. Comprueba la ubicación del dispositivo.')}
                    </span>
                  )}
                </div>

                {sosCoords ? (
                  <button
                    type="button"
                    onClick={() => {
                      const dms = formatCoordinatesDMS(sosCoords.lat, sosCoords.lng);
                      const text = `${dms} (${sosCoords.lat.toFixed(6)}, ${sosCoords.lng.toFixed(6)})`;
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(text).catch(() => {});
                      }
                      setCopiedCoords(true);
                      setTimeout(() => setCopiedCoords(false), 2500);
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 shadow-md"
                  >
                    {copiedCoords ? t('mcSosCopiedBtn', '¡Copiadas!') : t('mcSosCopyBtn', 'Copiar')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSosRetryKey((k) => k + 1)}
                    disabled={sosLocating}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 shadow-md"
                  >
                    {t('gpsRetryBtn', 'Activar GPS')}
                  </button>
                )}
              </div>

              {sosCoords && (
                <a
                  href={buildGoogleMapsPinUrl(sosCoords.lat, sosCoords.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#120D1C] border border-slate-300 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-red-600">location_on</span>
                  <span>{t('gpsOpenMyLocationMaps', 'Ver mi ubicación exacta en Google Maps')}</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              )}
            </div>

            {/* Direct Official Numbers: Only 112 and 062 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="tel:112"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                {t('mcSosCall112', '112 Emergencias España / UE')}
              </a>

              <a
                href="tel:062"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-lg">local_police</span>
                {t('mcSosCall062', '062 Guardia Civil')}
              </a>
            </div>

            {/* First Aid tips */}
            <div className="bg-white/70 p-3.5 rounded-2xl border border-[#E6CA65] text-xs text-[#2B2538] space-y-1 font-medium">
              <h4 className="font-extrabold text-[#120D1C] flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-base text-red-600">medical_services</span>
                {t('mcSosGuideTitle', 'Guía de Seguridad Nocturna:')}
              </h4>
              <p>{t('mcSosTip1', '• Permanece cerca de tu vehículo o zona balizada en el mirador.')}</p>
              <p>{t('mcSosTip2', '• En caso de hipotermia o viento extremo, mantén tu manta térmica.')}</p>
              <p>{t('mcSosTip3', '• Facilita tus coordenadas GPS exactas al llamar al 112.')}</p>
            </div>
          </div>
        </div>
      )}



      {/* MODAL IDIOMAS */}
      {modalType === 'languages' && (
        <div className="card-pastel-gold relative w-full max-w-xl border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6CA65] mb-4 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#24153F] text-[#FEE685] flex items-center justify-center font-extrabold shadow-md shrink-0">
                <span className="material-symbols-outlined text-lg">language</span>
              </div>
              <div className="truncate">
                <h2 className="text-base sm:text-lg font-extrabold text-[#120D1C] font-['Plus_Jakarta_Sans'] truncate">
                  {t('languagesTitle', 'Idiomas de la App')}
                </h2>
                <p className="text-[11px] text-[#594A70] font-bold truncate">{t('languagesSubtitle', 'Selecciona tu idioma preferido')}</p>
              </div>
            </div>

            {/* Header Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openModal('quickMenu')}
                className="px-2.5 py-1.5 bg-white/70 hover:bg-white text-[#120D1C] border border-[#E6CA65] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                title={t('mcBackBtn', 'Atrás')}
              >
                <span className="material-symbols-outlined text-sm">undo</span>
                <span className="hidden xs:inline">{t('mcBackBtn', 'Atrás')}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="px-2.5 py-1.5 bg-[#24153F] hover:bg-black text-[#FFF8D6] rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
                title={t('mcHomeBtn', 'Inicio')}
              >
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="hidden xs:inline">{t('mcHomeBtn', 'Inicio')}</span>
              </button>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-[#24153F] hover:text-black border border-[#E6CA65] transition-all cursor-pointer"
                title={t('mcCloseBtn', 'Cerrar')}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            <p className="text-xs text-[#120D1C] font-['Plus_Jakarta_Sans'] font-medium">
              {t('mcLangModalIntro', 'Selecciona tu idioma preferido (se aplicará al instante en toda la aplicación, pasarela de pago, buscadores e IA):')}
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
                <span>{t('mcLangSaveReturnBtn', 'Guardar y Volver')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Cancellation Modal */}
      <SubscriptionCancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancellationSuccess={() => {
          setRegisteredTrialEmail(null);
          setTrialEmailInput('');
          setTrialFirstName('');
          setTrialLastName('');
          setEmailSentStep(false);
        }}
      />
    </div>
  );
};
