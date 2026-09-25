import React, { useState, useEffect } from 'react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  isAfterPayment?: boolean;
  planName?: string;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  isAfterPayment = false,
  planName = 'Pro',
}) => {
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);
  const [manualGuideOpen, setManualGuideOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent;
      const isIosDevice = /iPhone|iPad|iPod/i.test(ua);
      setIsIOS(isIosDevice);

      // Check if already running standalone
      const isInStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isInStandalone);
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
          return;
        }
      } catch (err) {
        console.error('Error launching install prompt:', err);
      }
    }
    // If deferredPrompt is unavailable or was already used/dismissed, reveal guided steps
    setManualGuideOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#24143D] via-[#1A0E2E] to-[#120822] border-2 border-[#F0DEAA]/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(240,222,170,0.25)] text-white overflow-hidden my-auto">
        {/* Glow ambient circle */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#F0DEAA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Header with the EXACT Brand Logo: Star with Orbit and Diamond Sparkle */}
        <div className="text-center mb-5">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#1E1035] via-[#2A1549] to-[#381B5E] border-2 border-[#F0DEAA]/60 p-2 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#F0DEAA]/10 rounded-2xl blur-md" />
            <svg
              viewBox="0 0 100 90"
              className="w-16 h-16 relative z-10 drop-shadow-[0_0_12px_rgba(240,222,170,0.65)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ambient Golden Core Halo */}
              <circle cx="44" cy="46" r="26" fill="#F0DEAA" fillOpacity="0.25" />

              {/* 1. Main 5-Point Star Body */}
              <path
                d="M 44 16
                   L 52 34
                   L 72 35
                   L 56.5 48
                   L 62 69
                   L 44 57.5
                   L 26 69
                   L 31.5 48
                   L 16 35
                   L 36 34 Z"
                fill="#F0DEAA"
                stroke="#FFFDF2"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />

              {/* 2. Sweeping Orbital Ring / Swoosh (Wraps around star) */}
              <path
                d="M 12 66 
                   C 9 53, 21 35, 45 28
                   C 64 22, 80 27, 84 38
                   C 88 49, 79 66, 55 73
                   C 34 79, 16 75, 12 66"
                stroke="#F0DEAA"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />

              {/* 3. Four-Point Diamond Sparkle Star */}
              <path
                d="M 73 9
                   Q 73 15.5 78 15.5
                   Q 73 15.5 73 22
                   Q 73 15.5 68 15.5
                   Q 73 15.5 73 9 Z"
                fill="#FFFDF2"
              />
              <circle cx="73" cy="15.5" r="1.3" fill="#FFFFFF" />
            </svg>
          </div>

          {isAfterPayment && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>¡Acceso {planName} Activado!</span>
            </div>
          )}

          <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-white tracking-wide">
            Instalar StellaWay en tu Móvil
          </h3>
          <p className="text-xs sm:text-sm text-white/75 mt-1 leading-relaxed max-w-sm mx-auto">
            Añade el icono con la estrella dorada a la pantalla de tu teléfono para entrar con 1 solo toque, a pantalla completa y sin barras de navegación.
          </p>
        </div>

        {/* PRIMARY ACTION BUTTON: Prominent Install Button with Star & Orbit Icon */}
        {!installSuccess && (
          <div className="mb-4">
            <button
              onClick={handleNativeInstall}
              id="btn-pwa-install-action"
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#FEE685] via-[#F0DEAA] to-[#E5B54F] text-[#120822] font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(240,222,170,0.5)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-white/80"
            >
              {/* Star & Orbit Icon inside button */}
              <div className="w-7 h-7 shrink-0">
                <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
                  <path
                    d="M 44 16 L 52 34 L 72 35 L 56.5 48 L 62 69 L 44 57.5 L 26 69 L 31.5 48 L 16 35 L 36 34 Z"
                    fill="#120822"
                  />
                  <path
                    d="M 12 66 C 9 53, 21 35, 45 28 C 64 22, 80 27, 84 38 C 88 49, 79 66, 55 73 C 34 79, 16 75, 12 66"
                    stroke="#120822"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="73" cy="15.5" r="3" fill="#120822" />
                </svg>
              </div>
              <span className="font-extrabold tracking-wide">
                {isIOS ? 'Poner Icono en Mi Teléfono' : 'Instalar Icono en Pantalla'}
              </span>
            </button>
          </div>
        )}

        {installSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-center text-xs font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span>¡Icono de StellaWay añadido a tu pantalla!</span>
          </div>
        )}

        {/* Step-by-step instructions based on device (visible immediately on iOS or when user clicks on Android) */}
        {(isIOS || manualGuideOpen || !deferredPrompt) && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-left animate-fadeIn">
            {isIOS ? (
              <>
                <div className="text-[11px] font-bold text-[#F0DEAA] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">phone_iphone</span>
                  <span>En iPhone / iPad (Safari):</span>
                </div>
                <ol className="space-y-2 text-xs text-white/85">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F0DEAA]/25 text-[#F0DEAA] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>
                      Toca el botón <strong>Compartir</strong> en la barra inferior de Safari{' '}
                      <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">
                        <span className="material-symbols-outlined text-xs align-middle">ios_share</span> Compartir
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F0DEAA]/25 text-[#F0DEAA] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>
                      Baja un poco en el menú y pulsa <strong>«Añadir a la pantalla de inicio»</strong>{' '}
                      <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">➕</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F0DEAA]/25 text-[#F0DEAA] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>
                      Pulsa <strong>«Añadir»</strong> (arriba a la derecha). Verás la estrella dorada en tu pantalla.
                    </span>
                  </li>
                </ol>
              </>
            ) : (
              <>
                <div className="text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">phone_android</span>
                  <span>En tu teléfono (Chrome o navegador):</span>
                </div>
                <ol className="space-y-2 text-xs text-white/85">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#38BDF8]/25 text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>
                      Toca los <strong>tres puntos ⋮</strong> arriba a la derecha en el navegador.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#38BDF8]/25 text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>
                      Selecciona <strong>«Instalar aplicación»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#38BDF8]/25 text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>
                      Confirma pulsando <strong>«Instalar»</strong>. ¡Aparecerá el icono de la estrella dorada!
                    </span>
                  </li>
                </ol>
              </>
            )}
          </div>
        )}

        {/* Enter Dashboard Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
        >
          <span>Continuar a StellaWay</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>

        <p className="text-[10px] text-white/40 text-center mt-3">
          Puedes volver a abrir este instalador en cualquier momento desde el menú lateral o desde tu Perfil.
        </p>
      </div>
    </div>
  );
};
