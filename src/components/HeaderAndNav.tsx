import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StellaLogo } from './StellaLogo';

interface HeaderAndNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  nightVision: boolean;
  setNightVision: React.Dispatch<React.SetStateAction<boolean>>;
  onGoBack?: () => void;
  openModal?: (type: any) => void;
}

export const HeaderAndNav: React.FC<HeaderAndNavProps> = ({
  activeTab,
  setActiveTab,
  nightVision,
  setNightVision,
  onGoBack,
  openModal,
}) => {
  const { t, language, languageOptions } = useLanguage();
  const currentLang = languageOptions.find((l) => l.code === language) || languageOptions[0];
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    const isLocalOrAiStudioPreview =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        (window.location.hostname.startsWith('ais-') && window.location.hostname.endsWith('.run.app')));

    // Check if user has active subscription or valid trial
    const isSubscribed = typeof window !== 'undefined' && localStorage.getItem('stellaway_subscription_active') === 'true';
    const savedExpires = typeof window !== 'undefined' ? localStorage.getItem('stellaway_trial_expires') : null;
    const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
    const hasAccess = isSubscribed || isTrialValid || isLocalOrAiStudioPreview;

    if (!hasAccess && tab !== 'welcome') {
      // Redirigir a la pantalla de planes y suscripción si no ha pagado ni verificado 48h
      setActiveTab('welcome');
      setDrawerOpen(false);
      return;
    }

    setActiveTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <nav
        className={`md:hidden fixed left-0 top-0 h-full w-80 bg-[#170E28] border-r border-[#FEE685]/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out py-8 flex flex-col justify-between ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="px-6 mb-8 flex items-center justify-between">
            <StellaLogo size="md" showSubtitle subtitleText={t('appSubtitle', 'Astroturismo')} />
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <ul className="flex flex-col gap-2 px-4 text-base">
            <li>
              <button
                onClick={() => handleNavClick('welcome')}
                className={`w-full flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'welcome'
                    ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white font-extrabold shadow-lg shadow-black/30'
                    : 'text-white/80 hover:bg-white/10 font-semibold'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'welcome' ? "'FILL' 1" : "'FILL' 0" }}>
                    stars
                  </span>
                  <span>{t('welcomePlansKicker', 'Planes & Suscripción')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                  {t('free48hBadge', '48h Gratis')}
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-[#FEE685] to-[#E5B54F] text-[#0D071B] font-extrabold border border-[#D5A02E] shadow-lg shadow-black/30'
                    : 'text-white/80 hover:bg-white/10 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>
                  dashboard
                </span>
                <span>{t('dashboard', 'Dashboard Eclipse 2027')}</span>
              </button>
            </li>


            <li>
              <button
                onClick={() => handleNavClick('events')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'bg-gradient-to-r from-[#FEE685] to-[#E5B54F] text-[#0D071B] font-extrabold border border-[#D5A02E] shadow-lg shadow-black/30'
                    : 'text-white/80 hover:bg-white/10 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'events' ? "'FILL' 1" : "'FILL' 0" }}>
                  flare
                </span>
                <span>{t('events', 'Evento estelar')}</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('weather')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'weather'
                    ? 'bg-gradient-to-r from-[#FEE685] to-[#E5B54F] text-[#0D071B] font-extrabold border border-[#D5A02E] shadow-lg shadow-black/30'
                    : 'text-white/80 hover:bg-white/10 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'weather' ? "'FILL' 1" : "'FILL' 0" }}>
                  cloud_sync
                </span>
                <span>{t('weather', 'Previsión del tiempo')}</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('assistant')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'assistant'
                    ? 'bg-gradient-to-r from-[#FEE685] to-[#E5B54F] text-[#0D071B] font-extrabold border border-[#D5A02E] shadow-lg shadow-black/30'
                    : 'text-white/80 hover:bg-white/10 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'assistant' ? "'FILL' 1" : "'FILL' 0" }}>
                  smart_toy
                </span>
                <span>{t('assistant', 'Asistente Estelar AI')}</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#FEE685] to-[#E5B54F] text-[#0D071B] font-extrabold border border-[#D5A02E] shadow-lg shadow-black/30'
                    : 'text-white/80 hover:bg-white/10 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>
                  account_circle
                </span>
                <span>{t('profile', 'Perfil y Diario')}</span>
              </button>
            </li>

            <div className="my-2 border-t border-white/10" />

            {/* Install App on Phone Button with Star and Circle Icon */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  window.dispatchEvent(new CustomEvent('open-install-modal'));
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FEE685]/15 to-[#F0DEAA]/25 hover:from-[#FEE685]/30 hover:to-[#F0DEAA]/40 text-[#FFF5D6] border border-[#F0DEAA]/50 transition-all font-bold text-xs shadow-md active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 shrink-0">
                    <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
                      <path
                        d="M 44 16 L 52 34 L 72 35 L 56.5 48 L 62 69 L 44 57.5 L 26 69 L 31.5 48 L 16 35 L 36 34 Z"
                        fill="#F0DEAA"
                      />
                      <path
                        d="M 12 66 C 9 53, 21 35, 45 28 C 64 22, 80 27, 84 38 C 88 49, 79 66, 55 73 C 34 79, 16 75, 12 66"
                        stroke="#F0DEAA"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx="73" cy="15.5" r="2.5" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <span>{t('installAppMobileBtn', 'Instalar App en Móvil')}</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#F0DEAA]">install_mobile</span>
              </button>
            </li>

            {/* Language Selection in Mobile Drawer */}
            {openModal && (
              <li>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    openModal('languages');
                  }}
                  className="w-full flex items-center justify-between px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 transition-all font-semibold text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-[#FEE685]">language</span>
                    <span>{t('languages', 'Idioma')}</span>
                  </div>
                  <span className="text-[11px] font-extrabold bg-[#24153F] text-[#FFF8D6] px-2.5 py-0.5 rounded-full border border-[#E6CA65]">
                    {currentLang.flag} {currentLang.name}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="px-6">
          <div className="bg-[#24153F] rounded-2xl p-3.5 flex items-center justify-between border border-[#FEE685]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF3B30]">visibility</span>
              <span className="text-xs font-bold text-white">{t('redLight', 'Luz Roja / Campo')}</span>
            </div>
            <button
              type="button"
              onClick={() => setNightVision((prev) => !prev)}
              aria-label={nightVision ? t('landingNvAriaOn', 'Desactivar Modo Visión Nocturna') : t('landingNvAriaOff', 'Activar Modo Luz Roja')}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                nightVision ? 'bg-[#FF3B30] justify-end' : 'bg-white/20 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
