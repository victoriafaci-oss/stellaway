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
  planName = 'Pro'
}) => {
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

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
        }
      } catch (err) {
        console.error('Error launching install prompt:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#24143D] via-[#1A0E2E] to-[#120822] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(255,215,0,0.2)] text-white overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Header with Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-[#381E63] to-[#FFD700]/30 border border-[#FFD700]/50 p-2 shadow-lg flex items-center justify-center">
            <img src="/icon.svg" alt="StellaWay" className="w-12 h-12" />
          </div>

          {isAfterPayment && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>¡Acceso {planName} Activado!</span>
            </div>
          )}

          <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-white tracking-wide">
            Instala StellaWay en tu Móvil
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed">
            Añade el icono a tu pantalla de inicio para acceder directamente con un toque, a pantalla completa y sin barras de navegador.
          </p>
        </div>

        {/* Native Android / Desktop Chrome 1-click install if supported */}
        {deferredPrompt && !installSuccess && (
          <div className="mb-5">
            <button
              onClick={handleNativeInstall}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-[#1D0C30] font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined font-black">install_mobile</span>
              <span>Instalar en mi móvil ahora</span>
            </button>
          </div>
        )}

        {installSuccess && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center text-xs font-semibold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span>¡Instalación solicitada con éxito!</span>
          </div>
        )}

        {/* Step-by-step instructions based on device */}
        {isIOS ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-left">
            <div className="text-[11px] font-bold text-[#FFD700] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">phone_iphone</span>
              <span>Instrucciones para iPhone / iPad (Safari):</span>
            </div>
            <ol className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FFD700]/20 text-[#FFD700] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>
                  Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">
                    <span className="material-symbols-outlined text-xs align-middle">ios_share</span> Compartir
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FFD700]/20 text-[#FFD700] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>
                  Desliza hacia abajo en el menú y toca <strong>«Añadir a la pantalla de inicio»</strong>{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">➕</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FFD700]/20 text-[#FFD700] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>
                  Pulsa <strong>«Añadir»</strong> arriba a la derecha. ¡Listo! Ya tienes el icono de StellaWay en tu móvil.
                </span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-left">
            <div className="text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">phone_android</span>
              <span>En tu móvil (Chrome o navegador web):</span>
            </div>
            <ol className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>
                  Pulsa el menú de opciones (los <strong>tres puntos ⋮</strong> arriba a la derecha en el navegador).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>
                  Selecciona <strong>«Instalar aplicación»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>
                  Confirma pulsando <strong>«Instalar»</strong> para tener la app siempre a mano como cualquier app nativa.
                </span>
              </li>
            </ol>
          </div>
        )}

        {/* Enter Dashboard Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/20"
        >
          <span>Continuar a StellaWay</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>

        <p className="text-[10px] text-white/40 text-center mt-3">
          Puedes volver a ver estas instrucciones en cualquier momento desde tu Perfil o Ajustes.
        </p>
      </div>
    </div>
  );
};
