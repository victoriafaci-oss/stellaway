import React, { useState } from 'react';
import { useOfflineStorage } from '../lib/offlineStorage';
import { useLanguage } from '../context/LanguageContext';
import { ActiveTab } from '../types';

interface OfflineBannerProps {
  onNavigateTab: (tab: ActiveTab) => void;
  nightVision: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onNavigateTab, nightVision }) => {
  const { isOnline, stats } = useOfflineStorage();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // If user is online and haven't manually requested to see offline mode, don't show the persistent warning banner
  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div
      className={`w-full py-2 px-4 transition-all duration-300 z-20 flex items-center justify-between gap-3 text-xs shadow-md border-b ${
        nightVision
          ? 'bg-[#2b0a0a] text-[#ffb4b4] border-[#ff4444]/40'
          : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white border-amber-400/30'
      }`}
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
        <span className="material-symbols-outlined text-base animate-pulse">
          signal_wifi_off
        </span>
        <div className="flex-1">
          <span className="font-extrabold uppercase tracking-wide mr-1.5 font-['JetBrains_Mono']">
            {t('offlineBannerTitle', 'Modo Sin Cobertura Activo:')}
          </span>
          <span className="opacity-90">
            {t('offlineBannerSub', 'Estás desconectado o en zona rural. Disponibles en tu teléfono:')}{' '}
            <strong className="font-black text-amber-200">
              {stats.spotsCount} {t('profileOfflineSpotsUnit', 'miradores')} · {stats.eventsCount} {t('profileOfflineEventsUnit', 'eventos')}
            </strong>{' '}
            ({stats.approxKB} KB)
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('spots')}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
          >
            {t('offlineOpenBtn', 'Ver mis miradores')}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/80 hover:text-white"
            title={t('offlineCloseNotice', 'Cerrar aviso')}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
