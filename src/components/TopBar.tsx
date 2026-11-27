import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab, ModalType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useOfflineStorage } from '../lib/offlineStorage';
import { StellaLogo } from './StellaLogo';
import { hasAppAccess, shouldSkipLanding } from '../lib/previewAccess';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  canGoBack: boolean;
  onGoBack: () => void;
  nightVision: boolean;
  setNightVision: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: (type: ModalType) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  canGoBack,
  onGoBack,
  nightVision,
  setNightVision,
  openModal,
}) => {
  const { user } = useAuth();
  const { isOnline } = useOfflineStorage();
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const showBackButton =
    activeTab !== 'dashboard' &&
    !(activeTab === 'welcome' && shouldSkipLanding() && !hasAppAccess());

  return (
    <div className="w-full bg-[#130B22]/95 backdrop-blur-xl border-b border-[#FEE685]/20 px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/40">
      {/* Left Area: Unified 3-Bars Menu Button + (Atrás on Subpages) */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 z-10">
        {/* Unified Menu Button (Las 3 barras) */}
        <button
          onClick={() => openModal('quickMenu')}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-b from-[#FFF8D6] to-[#FEE685] hover:from-white hover:to-[#FFF3B0] border border-[#E6CA65] text-[#120D1C] font-extrabold rounded-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-md shadow-black/20 shrink-0"
          title={t('mainMenuTooltip', 'Menú Principal (Herramientas y Opciones)')}
          id="btn-top-menu-unified"
        >
          <span className="material-symbols-outlined text-base sm:text-lg font-bold">menu</span>
        </button>

        {/* ONLY ON SUBPAGES: Atrás */}
        {showBackButton && (
          <button
            onClick={onGoBack}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
            title={t('goBackTooltip', 'Página anterior / Ir atrás')}
            id="btn-nav-prev"
          >
            <span className="material-symbols-outlined text-sm sm:text-base font-bold">undo</span>
          </button>
        )}
      </div>

      {/* Center Area: Nombre de la app StellaWay con el diseño de la estrella y tipografía serif (Always cleanly positioned with no overlaps) */}
      <div
        onClick={() => setActiveTab('dashboard')}
        className="flex-1 flex items-center justify-center px-1 sm:px-2 cursor-pointer hover:opacity-95 transition-opacity select-none z-10 min-w-0"
      >
        <StellaLogo size="md" />
      </div>

      {/* Right Area: User Profile (when connected) & Night Vision */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 z-10">
        {activeTab !== 'welcome' && user && (
          <button
            onClick={() => setActiveTab('profile')}
            className="h-8 flex items-center gap-1.5 px-2 rounded-lg bg-[#24153F] border border-[#FEE685]/40 hover:bg-[#321C58] transition-all text-xs text-white cursor-pointer"
            title={user.displayName || user.email || t('memberBadge', 'Socio')}
            id="btn-top-profile"
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full border border-[#FEE685]" />
            ) : (
              <span className="material-symbols-outlined text-sm text-[#FEE685]">account_circle</span>
            )}
            <span className="hidden lg:inline font-bold text-xs text-[#FEE685] truncate max-w-[70px]">
              {user.displayName?.split(' ')[0] || t('memberBadge', 'Socio')}
            </span>
          </button>
        )}

        {/* Offline indicator if disconnected */}
        {!isOnline && (
          <button
            onClick={() => setActiveTab('spots')}
            className="h-8 px-2 sm:px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-['JetBrains_Mono'] text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm animate-pulse"
            title={t('offlineOpenBtn', 'Ver mis miradores')}
          >
            <span className="material-symbols-outlined text-xs">signal_wifi_off</span>
            <span className="hidden md:inline">{t('noCoverageBadge', 'Sin Cobertura')}</span>
          </button>
        )}

        {/* Idioma: solo icono del mundo + sigla actual junto a la luz roja */}
        <div className="relative shrink-0" ref={langMenuRef}>
          <button
            type="button"
            id="btn-top-language"
            onClick={() => setLangMenuOpen((prev) => !prev)}
            className="h-9 sm:h-10 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0"
            title={t('changeLangTooltip', 'Cambiar idioma')}
            aria-label={t('changeLangTooltip', 'Cambiar idioma')}
            aria-expanded={langMenuOpen}
          >
            <span className="material-symbols-outlined text-base sm:text-lg text-amber-300">language</span>
            <span className="uppercase tracking-wide font-mono">{language.toUpperCase()}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0D111C] border border-white/15 p-1.5 shadow-2xl z-50">
              {languageOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                    language === opt.code
                      ? 'bg-amber-300 text-slate-950'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.flag}</span>
                    <span>{opt.name}</span>
                  </span>
                  <span className="uppercase font-mono text-[10px] opacity-80">{opt.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sol / Luz Roja (Night Vision) */}
        <button
          type="button"
          onClick={() => setNightVision((prev) => !prev)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm shrink-0 ${
            nightVision
              ? 'bg-[#FF3B30] border-white text-white shadow-[0_0_16px_rgba(255,59,48,0.9)] animate-pulse'
              : 'bg-white/10 hover:bg-white/20 border-white/20 text-white/90'
          }`}
          title={nightVision ? t('deactivateRedTooltip', 'Desactivar Modo Luz Roja (Visión Nocturna)') : t('landingNvAriaOff', 'Activar Modo Luz Roja')}
          id="btn-top-red-light"
          aria-label={nightVision ? t('landingNvAriaOn', 'Desactivar Modo Visión Nocturna') : t('landingNvAriaOff', 'Activar Modo Luz Roja')}
        >
          <span className="material-symbols-outlined text-base sm:text-lg">
            {nightVision ? 'visibility_off' : 'clear_day'}
          </span>
        </button>
      </div>
    </div>
  );
};


