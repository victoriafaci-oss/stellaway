import React from 'react';
import { ActiveTab, ModalType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StellaLogo } from './StellaLogo';

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
  const { user, signIn } = useAuth();
  const { language, languageOptions } = useLanguage();

  const currentLangOption = languageOptions.find((l) => l.code === language) || languageOptions[0];

  return (
    <div className="w-full bg-[#130B22]/95 backdrop-blur-xl border-b border-[#FEE685]/20 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/40 relative">
      {/* Left Area: Unified 3-Bars Menu Button + (Atrás & Inicio ONLY on Subpages) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-10">
        {/* Unified Menu Button (Las 3 barras) */}
        <button
          onClick={() => openModal('quickMenu')}
          className="px-2.5 sm:px-3 py-2 bg-gradient-to-b from-[#FFF8D6] to-[#FEE685] hover:from-white hover:to-[#FFF3B0] border border-[#E6CA65] text-[#120D1C] font-extrabold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-md shadow-black/20"
          title="Menú Principal (Herramientas y Opciones)"
          id="btn-top-menu-unified"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl font-bold">menu</span>
        </button>

        {/* ONLY ON SUBPAGES: Atrás */}
        {activeTab !== 'dashboard' && (
          <button
            onClick={onGoBack}
            className="px-2 sm:px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-[11px] font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Página anterior / Ir atrás"
            id="btn-nav-prev"
          >
            <span className="material-symbols-outlined text-sm font-bold">undo</span>
            <span className="hidden md:inline">Atrás</span>
          </button>
        )}
      </div>

      {/* Center Area: Nombre de la app StellaWay con el diseño de la estrella y tipografía serif */}
      <div
        onClick={() => setActiveTab('dashboard')}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity select-none z-0 pointer-events-auto"
      >
        <StellaLogo size="md" />
      </div>

      {/* Right Area: Google Auth Sign In / User Profile & Night Vision */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-10">
        {user ? (
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-[#24153F] border border-[#FEE685]/40 hover:bg-[#321C58] transition-all text-xs text-white cursor-pointer"
            title={`Conectado como ${user.displayName || user.email}`}
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full border border-[#FEE685]" />
            ) : (
              <span className="material-symbols-outlined text-sm text-[#FEE685]">account_circle</span>
            )}
            <span className="hidden lg:inline font-bold text-xs text-[#FEE685] truncate max-w-[80px]">
              {user.displayName?.split(' ')[0] || 'Socio'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FFF8D6] to-[#FEE685] hover:from-white hover:to-[#FFF3B0] text-[#120D1C] font-extrabold text-[11px] border border-[#E6CA65] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Iniciar sesión con Google para sincronizar Calendario y Datos"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="hidden xs:inline font-bold">Google</span>
          </button>
        )}

        {/* Sol / Cambia color (Night Vision) */}
        <button
          onClick={() => setNightVision((prev) => !prev)}
          className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm ${
            nightVision
              ? 'bg-[#FF3B30] border-white text-white shadow-[0_0_14px_rgba(255,59,48,0.8)]'
              : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
          }`}
          title={nightVision ? 'Desactivar Luz Roja' : 'Activar Modo Luz Roja / Sol'}
          id="btn-top-red-light"
        >
          <span className="material-symbols-outlined text-base sm:text-lg">
            {nightVision ? 'visibility_off' : 'clear_day'}
          </span>
        </button>
      </div>
    </div>
  );
};


