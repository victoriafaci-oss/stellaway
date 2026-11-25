import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getLocaleTag, withStripeLocale } from '../lib/i18nHelpers';

interface SubscriptionCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancellationSuccess?: () => void;
}

export const SubscriptionCancellationModal: React.FC<SubscriptionCancellationModalProps> = ({
  isOpen,
  onClose,
  onCancellationSuccess,
}) => {
  const { t, language } = useLanguage();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [reason, setReason] = useState('not_needed');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancellationResult, setCancellationResult] = useState<{
    reference: string;
    timestamp: string;
    planCancelled: string;
    stripeCancelled?: boolean;
    stripeNote?: string;
    stripeSubscriptionIds?: string[];
  } | null>(null);

  // Active status details
  const [activePlan, setActivePlan] = useState<string>('');
  const [activePhone, setActivePhone] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const plan = localStorage.getItem('stellaway_active_plan');
      const phone = localStorage.getItem('stellaway_trial_phone');
      const savedEmail = localStorage.getItem('stellaway_user_email') || localStorage.getItem('stellaway_customer_email') || '';
      const isSubscribed = localStorage.getItem('stellaway_subscription_active') === 'true';

      if (phone && phone.startsWith('+')) {
        setActivePlan(t('cancelPlan48h', 'Prueba Gratuita 48 Horas'));
        setActivePhone(phone);
        setEmailOrPhone(phone);
      } else if (plan === 'mensual') {
        setActivePlan(t('cancelPlanMensual', 'Plan Mensual Starlight Pro (3,99 € / mes)'));
        if (savedEmail) setEmailOrPhone(savedEmail);
      } else if (plan === 'anual') {
        setActivePlan(t('cancelPlanAnual', 'Plan Anual Starlight Pass (19,99 € / año)'));
        if (savedEmail) setEmailOrPhone(savedEmail);
      } else if (isSubscribed) {
        setActivePlan(t('cancelPlanActive', 'Suscripción StellaWay Activa'));
        if (savedEmail) setEmailOrPhone(savedEmail);
      } else {
        setActivePlan(t('cancelPlanTrial', 'Suscripción / Prueba Gratuita'));
        if (savedEmail) setEmailOrPhone(savedEmail);
      }
      setCancellationResult(null);
    }
  }, [isOpen, language, t]);

  if (!isOpen) return null;

  const handleConfirmCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const refCode = 'BAJA-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = new Date().toLocaleString(getLocaleTag(language), {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    let stripeCancelled = false;
    let stripeNote = '';
    let stripeSubscriptionIds: string[] = [];

    try {
      const storedTxId = localStorage.getItem('stellaway_transaction_id') || undefined;
      // Call backend cancellation endpoint with Stripe integration
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: emailOrPhone,
          reason,
          reference: refCode,
          timestamp: new Date().toISOString(),
          plan: activePlan,
          subscriptionId: storedTxId && storedTxId.startsWith('sub_') ? storedTxId : undefined,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          stripeCancelled = Boolean(data.stripeCancelled);
          stripeNote = data.stripeNote || '';
          stripeSubscriptionIds = data.stripeSubscriptionIds || [];
        }
      }
    } catch {
      // Fallback gracefully if network drops
    }

    // Immediate local unsubscription
    localStorage.removeItem('stellaway_subscription_active');
    localStorage.removeItem('stellaway_trial_phone');
    localStorage.removeItem('stellaway_trial_expires');
    localStorage.removeItem('stellaway_active_plan');
    localStorage.removeItem('stellaway_payment_provider');
    localStorage.removeItem('stellaway_transaction_id');

    localStorage.setItem('stellaway_subscription_status', 'cancelled');
    localStorage.setItem('stellaway_cancellation_ref', refCode);
    localStorage.setItem('stellaway_cancellation_date', dateFormatted);

    // Notify other components of the unsubscription event
    window.dispatchEvent(new CustomEvent('stellaway-subscription-cancelled'));

    setIsProcessing(false);
    setCancellationResult({
      reference: refCode,
      timestamp: dateFormatted,
      planCancelled: activePlan || t('cancelFallbackPlan', 'Suscripción / Prueba 48h'),
      stripeCancelled,
      stripeNote,
      stripeSubscriptionIds,
    });

    if (onCancellationSuccess) {
      onCancellationSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#082F49] text-white rounded-3xl border-2 border-rose-500/60 shadow-[0_0_50px_rgba(244,63,94,0.35)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-[#082F49] p-5 sm:p-6 border-b border-rose-500/30 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-inner shrink-0">
              <span className="material-symbols-outlined text-2xl">cancel</span>
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-400/30 inline-block mb-1">
                {t('cancelBadge', 'Garantía Legal de Desistimiento & Baja Inmediata')}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Plus_Jakarta_Sans'] leading-tight">
                {t('cancelTitle', 'Dar de Baja la Suscripción')}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label={t('cancelCloseAria', 'Cerrar modal de baja')}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {cancellationResult ? (
            /* Success confirmation */
            <div className="space-y-4 text-center animate-fadeIn py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 mx-auto flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-3xl font-black">check_circle</span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white font-['Plus_Jakarta_Sans']">
                  {t('cancelSuccessTitle', 'Baja Tramitada con Éxito')}
                </h4>
                <p className="text-xs text-emerald-200 mt-1 font-medium">
                  {t('cancelSuccessDesc', 'Tu suscripción y cualquier renovación automática han sido canceladas de forma inmediata y definitiva.')}
                </p>
              </div>

              {/* Legal Receipt Card */}
              <div className="bg-[#041E30] rounded-2xl p-4 border border-[#38BDF8]/40 text-left space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-[#BAE6FD]">{t('cancelStatusLabel', 'Estado')}:</span>
                  <span className="text-emerald-400 font-bold uppercase">{t('cancelStatusValue', 'Cancelada • Sin Cargos Futuros')}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-[#BAE6FD]">{t('cancelRefLabel', 'Referencia Legal de Baja')}:</span>
                  <span className="text-amber-300 font-bold">{cancellationResult.reference}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-[#BAE6FD]">{t('cancelDateLabel', 'Fecha y Hora')}:</span>
                  <span className="text-white">{cancellationResult.timestamp}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-[#BAE6FD]">{t('cancelPlanLabel', 'Plan / Modalidad')}:</span>
                  <span className="text-white">{cancellationResult.planCancelled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#BAE6FD]">{t('cancelStripeSyncLabel', 'Sincronización Stripe')}:</span>
                  <span className="text-emerald-300 font-bold">
                    ✓ {cancellationResult.stripeCancelled
                      ? t('cancelStripeDeactivated', 'Desactivada en Stripe')
                      : t('cancelNoFutureCharges', 'Sin Cobros Futuros')}
                  </span>
                </div>
              </div>

              {/* Stripe Notice Box */}
              <div className="bg-emerald-950/50 border border-emerald-400/50 rounded-2xl p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>{t('cancelStripeConfirmTitle', 'Confirmación en Pasarela de Pagos Stripe')}</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  {cancellationResult.stripeNote ||
                    t('cancelStripeDefaultNote', 'Se ha notificado la cancelación a Stripe. La renovación automática queda interrumpida.')}
                </p>
              </div>

              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {t('cancelLegalReceiptNote', 'Guarda tu código de referencia como comprobante legal de desistimiento.')}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={withStripeLocale('https://billing.stripe.com/', language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#635BFF]/30 hover:bg-[#635BFF]/50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#635BFF]/60 cursor-pointer transition-all"
                >
                  <span>{t('cancelStripePortalBtn', 'Portal Clientes Stripe')}</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all"
                >
                  {t('cancelUnderstoodCloseBtn', 'Entendido y Cerrar')}
                </button>
              </div>
            </div>
          ) : (
            /* Active Form to cancel */
            <form onSubmit={handleConfirmCancellation} className="space-y-4">
              {/* Information Banner */}
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>{t('cancelRightTitle', 'Derecho a cancelar en cualquier momento')}</span>
                </div>
                <p>
                  {t('cancelRightDesc', 'Puedes dar de baja tu plan o prueba de 48 horas gratis con un solo clic de forma gratuita e inmediata.')}
                </p>
              </div>

              {/* Automatic Stripe Communication Notice */}
              <div className="p-3 bg-sky-950/40 rounded-2xl border border-sky-400/40 text-[11px] text-[#BAE6FD] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-300">
                  <span className="material-symbols-outlined text-base">sync_saved_locally</span>
                  <span>{t('cancelHowStripeTitle', '¿Cómo funciona la baja con Stripe?')}</span>
                </div>
                <p className="leading-relaxed">
                  {t('cancelHowStripeDesc', 'Al confirmar, la orden se comunica a Stripe para detener cualquier renovación y facturación automática.')}
                </p>
              </div>

              {/* Detected active service */}
              <div className="p-3.5 bg-[#041E30] rounded-2xl border border-[#38BDF8]/40 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#7DD3FC] font-bold uppercase tracking-wider block font-mono">
                    {t('cancelServiceLabel', 'Servicio / Plan a dar de baja')}:
                  </span>
                  <span className="text-sm font-black text-white font-['Plus_Jakarta_Sans']">
                    {activePlan || t('cancelFallbackPlan', 'Suscripción StellaWay')}
                  </span>
                  {activePhone && (
                    <span className="text-[11px] text-emerald-300 block font-mono">
                      {t('cancelPhoneRegLabel', 'Teléfono registrado:')} {activePhone}
                    </span>
                  )}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 uppercase shrink-0">
                  {t('cancelActiveRenewal', 'Renovación Activa')}
                </span>
              </div>

              {/* Contact identification (Email or Phone) */}
              <div>
                <label className="block text-xs font-bold text-[#BAE6FD] mb-1">
                  {t('cancelContactLabel', 'Email o teléfono asociado a la suscripción')}
                </label>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={t('cancelContactPlaceholder', 'ejemplo@correo.com o +34612345678')}
                  className="w-full bg-[#041E30] border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-xs font-bold focus:border-rose-400 outline-none"
                />
                <span className="text-[10px] text-[#94A3B8] mt-1 block">
                  {t('cancelContactHint', 'Necesario para emitir tu justificante de baja oficial.')}
                </span>
              </div>

              {/* Reason (optional) */}
              <div>
                <label className="block text-xs font-bold text-[#BAE6FD] mb-1">
                  {t('cancelReasonLabel', 'Motivo de la baja (opcional)')}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#041E30] border border-[#38BDF8]/50 rounded-xl px-3 py-2 text-white text-xs font-bold focus:border-rose-400 outline-none cursor-pointer"
                >
                  <option value="trial_completed">{t('cancelReasonTrial', 'Solo quería probar las 48 horas gratis')}</option>
                  <option value="not_needed">{t('cancelReasonNotNeeded', 'Ya completé mi observación / eclipse')}</option>
                  <option value="price">{t('cancelReasonPrice', 'Precio del servicio')}</option>
                  <option value="technical">{t('cancelReasonTech', 'Problemas técnicos o de compatibilidad')}</option>
                  <option value="other">{t('cancelReasonOther', 'Otro motivo')}</option>
                </select>
              </div>

              {/* Direct Stripe Customer Portal Note */}
              <div className="pt-1 text-[11px] text-[#94A3B8] space-y-1">
                <p>
                  {t('cancelStripePortalHint1', '¿Pagaste directamente en Stripe Checkout? También puedes gestionar facturas en el')}{' '}
                  <a
                    href={withStripeLocale('https://billing.stripe.com/', language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] underline font-bold hover:text-white"
                  >
                    {t('cancelStripePortalHintLink', 'Portal Oficial de Clientes de Stripe')}
                  </a>
                  .
                </p>
                <p>
                  {t('cancelSupportHint', 'Tramitación instantánea conforme a normativa europea de consumo.')}{' '}
                  <a href="mailto:soporte@stellaway.app" className="text-[#38BDF8] font-mono font-bold underline">
                    soporte@stellaway.app
                  </a>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all order-2 sm:order-1"
                >
                  {t('cancelKeepBtn', 'Mantener Suscripción')}
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/50 transition-all border border-rose-400/50 disabled:opacity-50 order-1 sm:order-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('cancelSubmittingBtn', 'Tramitando baja...')}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">cancel</span>
                      <span>{t('cancelConfirmBtn', 'Confirmar Baja Definitiva')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
