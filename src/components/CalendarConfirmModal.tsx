import React, { useState } from 'react';
import { CalendarEventPayload } from '../lib/calendar';

interface CalendarConfirmModalProps {
  isOpen: boolean;
  eventPayload: CalendarEventPayload | null;
  onClose: () => void;
  onConfirm: (payload: CalendarEventPayload) => Promise<void>;
}

export const CalendarConfirmModal: React.FC<CalendarConfirmModalProps> = ({
  isOpen,
  eventPayload,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLink, setSuccessLink] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !eventPayload) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onConfirm(eventPayload);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'No se pudo conectar con Google Calendar. Por favor, asegúrate de haber concedido los permisos en tu cuenta de Google.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="card-pastel-gold w-full max-w-lg rounded-3xl p-6 md:p-8 border border-[#7DD3FC]/60 shadow-2xl space-y-5 backdrop-blur-xl">
        {/* Header Icon */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#082F49]/80 text-[#7DD3FC] border border-[#38BDF8]/50 flex items-center justify-center shrink-0 font-extrabold shadow-md">
            <span className="material-symbols-outlined text-2xl">calendar_add_on</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#7DD3FC] uppercase tracking-wider font-['JetBrains_Mono'] block">
              Integración Google Workspace
            </span>
            <h3 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              ¿Añadir a tu Google Calendar?
            </h3>
          </div>
        </div>

        {/* Confirmation Message */}
        <p className="text-sm text-[#E0F2FE] font-medium leading-relaxed">
          Estás a punto de crear una entrada oficial de evento astronómico en tu Google Calendar principal con permisos de tu cuenta:
        </p>

        {/* Event Preview Card */}
        <div className="p-4 bg-[#082F49]/80 rounded-2xl border border-[#38BDF8]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white font-['JetBrains_Mono']">
              ✨ {eventPayload.summary}
            </span>
            <span className="px-2.5 py-0.5 bg-[#0284C7] text-white border border-[#7DD3FC]/40 text-[10px] rounded-full font-extrabold">
              Google Calendar
            </span>
          </div>

          <p className="text-xs text-[#BAE6FD] whitespace-pre-line leading-relaxed font-medium">
            {eventPayload.description}
          </p>

          <div className="pt-2 border-t border-[#38BDF8]/30 flex flex-wrap justify-between text-[11px] text-[#7DD3FC] font-['JetBrains_Mono'] font-bold">
            <span>📍 {eventPayload.location || 'Observación Estelar'}</span>
            <span>📅 {new Date(eventPayload.startDateTime).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-900/40 border border-red-500/40 rounded-xl text-xs text-red-200 font-bold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-2xl bg-[#082F49]/80 hover:bg-[#082F49] text-white font-bold text-xs uppercase cursor-pointer transition-all border border-[#38BDF8]/40 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg border border-[#7DD3FC]/50 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Sincronizando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">event_available</span>
                Confirmar y Guardar en Calendar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
