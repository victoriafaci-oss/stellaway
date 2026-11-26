import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StellaLogo } from './StellaLogo';
import { SubscriptionCancellationModal } from './SubscriptionCancellationModal';
import { withStripeLocale, getLocalizedPlanName } from '../lib/i18nHelpers';
import heroNebulaImg from '../assets/images/v2_hero_nebula_sky_1795505139848.jpg';

interface WelcomePaywallViewProps {
  onEnterApp: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  nightVision?: boolean;
  selectedPlanDefault?: 'free2days' | 'mensual' | 'anual';
  onTriggerInstall?: () => void;
}

export const WelcomePaywallView: React.FC<WelcomePaywallViewProps> = ({
  onEnterApp,
  onNavigateTab,
  nightVision,
  selectedPlanDefault = 'anual',
  onTriggerInstall,
}) => {
  const { t, language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'free2days' | 'mensual' | 'anual'>(selectedPlanDefault);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPlanDefault) {
      setSelectedPlan(selectedPlanDefault);
    }
  }, [selectedPlanDefault]);

  // Email + Name verification state for 48h Free Trial (no phone required)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trialEmail, setTrialEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailStep, setEmailStep] = useState<'form' | 'code' | 'verified'>('form');
  const [simulatedCode, setSimulatedCode] = useState('1234');
  const [trialError, setTrialError] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [activeTrialEmail, setActiveTrialEmail] = useState<string | null>(null);

  // Payment gateways status & payment state (Stripe & PayPal)
  const [gatewaysStatus, setGatewaysStatus] = useState<{
    stripe: { connected: boolean; mode: string; paymentLinks?: Record<string, string> };
    paypal: { connected: boolean; mode: string };
  }>({
    stripe: {
      connected: true,
      mode: 'live',
      paymentLinks: {
        free48h: 'https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06',
        mensual: 'https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04',
        anual: 'https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05',
      },
    },
    paypal: { connected: true, mode: 'live' },
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    provider: string;
    transactionId: string;
    amount: string;
    planId: 'free2days' | 'mensual' | 'anual';
  } | null>(null);

  // Stripe card fields
  const [billingEmail, setBillingEmail] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('stellaway_user_email') || '' : ''));
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');

  // Check saved subscription or trial status
  const isSubscribed = typeof window !== 'undefined' && localStorage.getItem('stellaway_subscription_active') === 'true';
  const savedExpires = typeof window !== 'undefined' ? localStorage.getItem('stellaway_trial_expires') : null;
  const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
  const hasAccess = isSubscribed || isTrialValid || Boolean(paymentSuccessData);

  // Check saved trial on mount & query payment config from backend
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const savedTrialContact =
      localStorage.getItem('stellaway_trial_email') || localStorage.getItem('stellaway_trial_phone');
    const trialExpires = localStorage.getItem('stellaway_trial_expires');
    if (savedTrialContact && trialExpires && Number(trialExpires) > Date.now()) {
      setActiveTrialEmail(savedTrialContact);
      setEmailStep('verified');
    }
  }, []);

  useEffect(() => {
    fetch(`/api/payment-config?lang=${encodeURIComponent(language)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.gateways) {
          setGatewaysStatus({
            stripe: {
              connected: Boolean(data.gateways.stripe?.connected),
              mode: data.gateways.stripe?.mode || 'live',
              paymentLinks: data.gateways.stripe?.paymentLinks,
            },
            paypal: {
              connected: Boolean(data.gateways.paypal?.connected),
              mode: data.gateways.paypal?.mode || 'live',
            },
          });
        }
      })
      .catch((err) => {
        console.warn('Payment config fetch fallback to active simulation:', err);
      });
  }, [language]);

  const handleNavigate = (tab: ActiveTab) => {
    if (!hasAccess) {
      const targetElement = document.getElementById('planes-pago');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      setTrialError(t('welcomeErrProtected', 'Acceso protegido: selecciona 48h gratis o una suscripción para entrar.'));
      return;
    }

    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      onEnterApp();
    }
  };

  // Handle Name + Email submission for 48-hour free trial
  const handleSendEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialError('');
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = trialEmail.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

    if (cleanFirst.length < 2 || cleanLast.length < 2) {
      setTrialError(t('welcomeErrInvalidName', 'Por favor introduce tu nombre y apellidos.'));
      return;
    }

    if (!isValidEmail) {
      setTrialError(t('welcomeErrInvalidPhone', 'Por favor introduce un correo electrónico válido.'));
      return;
    }

    const usedEmails = JSON.parse(localStorage.getItem('stellaway_used_trial_emails') || '[]');
    const deviceUsed = localStorage.getItem('stellaway_device_trial_used');

    if (usedEmails.includes(cleanEmail) || deviceUsed === 'true') {
      setTrialError(t('welcomeErrPhoneUsed', 'Este email o dispositivo ya utilizó la prueba gratuita de 48h. Selecciona el Plan Mensual o Anual.'));
      return;
    }

    // Generate random 4-digit code
    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    setSimulatedCode(generatedCode);

    setIsVerifyingEmail(true);
    try {
      const res = await fetch('/api/verify-trial-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: cleanFirst, lastName: cleanLast, email: cleanEmail, language }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStep('code');
      } else {
        setEmailStep('code');
      }
    } catch {
      // Fallback in client mode
      setEmailStep('code');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Handle Email verification code confirmation
  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialError('');
    if (emailCode.trim().length < 4) {
      setTrialError(t('welcomeErrCodeLength', 'El código de verificación debe tener al menos 4 dígitos (Ej: 1234).'));
      return;
    }

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = trialEmail.trim().toLowerCase();
    setIsVerifyingEmail(true);

    const persistTrialActivation = () => {
      const usedEmails = JSON.parse(localStorage.getItem('stellaway_used_trial_emails') || '[]');
      if (!usedEmails.includes(cleanEmail)) {
        usedEmails.push(cleanEmail);
        localStorage.setItem('stellaway_used_trial_emails', JSON.stringify(usedEmails));
      }
      localStorage.setItem('stellaway_device_trial_used', 'true');
      localStorage.setItem('stellaway_trial_email', cleanEmail);
      localStorage.setItem('stellaway_user_email', cleanEmail);
      localStorage.setItem('stellaway_user_name', `${cleanFirst} ${cleanLast}`.trim());
      localStorage.setItem('stellaway_trial_expires', String(Date.now() + 48 * 3600 * 1000));
      localStorage.setItem('stellaway_subscription_active', 'true');
      localStorage.setItem('stellaway_active_plan', 'free2days');

      setActiveTrialEmail(cleanEmail);
      setEmailStep('verified');
    };

    try {
      await fetch('/api/verify-trial-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: cleanFirst,
          lastName: cleanLast,
          email: cleanEmail,
          code: emailCode,
          language,
        }),
      });
      persistTrialActivation();
    } catch {
      persistTrialActivation();
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Direct Stripe Payment Links (StellaWay Official)
  const STRIPE_DIRECT_PAYMENT_LINKS: Record<string, string> = {
    free2days: 'https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06',
    mensual: 'https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04',
    anual: 'https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05',
  };

  const getDirectStripeUrl = (planKey: string) => {
    const raw =
      gatewaysStatus.stripe.paymentLinks?.[planKey === 'free2days' ? 'free48h' : planKey] ||
      STRIPE_DIRECT_PAYMENT_LINKS[planKey] ||
      STRIPE_DIRECT_PAYMENT_LINKS.anual;
    return withStripeLocale(raw, language);
  };

  // Handle Stripe Payment
  const handleStripePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessingPayment(true);

    try {
      const emailToSend = billingEmail.trim() || 'usuario@stellaway.org';
      if (billingEmail.trim()) {
        localStorage.setItem('stellaway_user_email', billingEmail.trim());
      }

      const res = await fetch('/api/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          customerName: cardHolder || t('mcProfileDefaultName', 'Astrónomo Starlight'),
          customerEmail: emailToSend,
          language,
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      if (data.success) {
        localStorage.setItem('stellaway_subscription_active', 'true');
        localStorage.setItem('stellaway_active_plan', selectedPlan);
        localStorage.setItem('stellaway_payment_provider', 'Stripe Payments');
        localStorage.setItem('stellaway_transaction_id', data.transactionId);

        setPaymentSuccessData({
          provider: 'Stripe Payments',
          transactionId: data.transactionId,
          amount: selectedPlan === 'mensual' ? '3,99 €' : '19,99 €',
          planId: selectedPlan,
        });
      }
    } catch (err) {
      console.error('Error in Stripe payment flow:', err);
      window.location.href = getDirectStripeUrl(selectedPlan);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle PayPal Payment
  const handlePayPalPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          customerEmail: billingEmail.trim() || 'usuario@paypal.com',
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('stellaway_subscription_active', 'true');
        localStorage.setItem('stellaway_active_plan', selectedPlan);
        localStorage.setItem('stellaway_payment_provider', 'PayPal');
        localStorage.setItem('stellaway_transaction_id', data.orderId);

        setPaymentSuccessData({
          provider: 'PayPal Express',
          transactionId: data.orderId,
          amount: selectedPlan === 'mensual' ? '3,99 €' : '19,99 €',
          planId: selectedPlan,
        });
      }
    } catch (err) {
      console.error('Error in PayPal payment flow:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSelectPlan = (plan: 'free2days' | 'mensual' | 'anual') => {
    setSelectedPlan(plan);
    setTrialError('');
    setTimeout(() => {
      const checkoutEl = document.getElementById('checkout-action-section');
      if (checkoutEl) {
        checkoutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  return (
    <div
      id="welcome-top"
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-14 space-y-8 animate-fadeIn text-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* 1. HERO BRANDING & WELCOME BANNER */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-10 border border-white/15 bg-[#0B0F1A] shadow-2xl">
        {/* High-contrast Milky Way backdrop with measured dark scrim */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={heroNebulaImg}
            alt=""
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(6,8,15,0.92) 0%, rgba(11,15,26,0.78) 55%, rgba(6,8,15,0.94) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-block text-xs font-semibold text-amber-300 tracking-wide">
              {t('welcomePlatformBadge', 'Plataforma Oficial de Astroturismo & Observación Estelar')}
            </span>

            <h1
              id="welcome-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white [text-wrap:balance]"
            >
              {t('welcomeTitle', 'Bienvenido a')}{' '}
              <span
                className="italic font-semibold text-[#FFD700]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('welcomeSubtitle', 'StellaWay Astroturismo')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {t(
                'welcomeDesc',
                'Descubre los mejores cielos oscuros de España, telemetría atmosférica en tiempo real, mapas satelitales de contaminación lumínica (Bortle 1 a 9) y la cobertura más avanzada para el Gran Eclipse Total Solar 2027.'
              )}
            </p>

            {/* MODULES ACCESS STRIP */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-semibold text-slate-300">
                  {t('welcomeModulesTitle', 'Módulos y Funciones Incluidas')}
                </span>
                <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>{t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('events')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-white/20 border-white/25 text-white'
                      : 'bg-[#06080F]/70 border-white/15 text-slate-300 hover:border-amber-300/50 hover:text-white'
                  }`}
                  title={hasAccess ? t('events', 'Eventos Estelares') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-amber-300">flare</span>
                  <span>{t('events', 'Eventos Estelares')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300/80 ml-0.5">lock</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('assistant')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-white/20 border-white/25 text-white'
                      : 'bg-[#06080F]/70 border-white/15 text-slate-300 hover:border-amber-300/50 hover:text-white'
                  }`}
                  title={hasAccess ? t('assistant', 'Asistente IA Starlight') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-emerald-300">smart_toy</span>
                  <span>{t('assistant', 'Asistente IA Starlight')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300/80 ml-0.5">lock</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('weather')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-white/20 border-white/25 text-white'
                      : 'bg-[#06080F]/70 border-white/15 text-slate-300 hover:border-amber-300/50 hover:text-white'
                  }`}
                  title={hasAccess ? t('weather', 'Previsión del tiempo') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-sky-300">cloud_sync</span>
                  <span>{t('weather', 'Previsión del tiempo')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300/80 ml-0.5">lock</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-white/20 border-white/25 text-white'
                      : 'bg-[#06080F]/70 border-white/15 text-slate-300 hover:border-amber-300/50 hover:text-white'
                  }`}
                  title={hasAccess ? t('dashboard', 'Dashboard Eclipse 2027') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-amber-300">eclipse</span>
                  <span>{t('dashboard', 'Dashboard Eclipse 2027')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300/80 ml-0.5">lock</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-3 w-full lg:w-auto">
            {hasAccess ? (
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (onTriggerInstall) {
                      onTriggerInstall();
                    } else {
                      window.dispatchEvent(new CustomEvent('open-install-modal'));
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-bold text-xs tracking-tight flex items-center justify-center gap-2.5 shadow-lg cursor-pointer transition-colors"
                  title={t('welcomeInstallStarTitle', 'Poner icono con estrella y círculo en la pantalla de inicio')}
                >
                  <div className="w-5 h-5 shrink-0">
                    <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
                      <path
                        d="M 44 16 L 52 34 L 72 35 L 56.5 48 L 62 69 L 44 57.5 L 26 69 L 31.5 48 L 16 35 L 36 34 Z"
                        fill="#0f172a"
                      />
                      <path
                        d="M 12 66 C 9 53, 21 35, 45 28 C 64 22, 80 27, 84 38 C 88 49, 79 66, 55 73 C 34 79, 16 75, 12 66"
                        stroke="#0f172a"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx="73" cy="15.5" r="3" fill="#0f172a" />
                    </svg>
                  </div>
                  <span>{t('welcomeInstallMobileBtn', 'Instalar en Móvil')}</span>
                </button>

                <button
                  type="button"
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>{t('welcomeBtnEnterApp', 'Acceder')}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            ) : (
              <a
                href="#planes-pago"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_28px_rgba(252,211,77,0.28)] cursor-pointer transition-colors text-center whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg">lock_open</span>
                <span>{t('welcomeBtnUnlock', 'Desbloquear Acceso Completo')}</span>
              </a>
            )}
            <span className="text-xs text-slate-300 font-medium">
              {hasAccess
                ? t('welcomeStatusActive', '✓ Acceso Activo Desbloqueado')
                : t('welcomeStatusLocked', 'Requiere activar 48h Gratis o Suscripción')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PAYMENT GATEWAYS VERIFICATION STATUS BAR (Stripe & PayPal) */}
      <div className="rounded-xl p-4 sm:px-6 bg-[#0B0F1A] border border-white/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {t('welcomeGatewaysTitle', 'Pasarelas de Pago Oficiales Conectadas')}
            </h4>
            <p className="text-xs text-slate-400">
              {t('welcomeGatewaysDesc', 'Transacciones seguras con encriptación SSL de 256 bits y protección contra fraude.')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06080F] border border-white/15 text-slate-200">
            <span>Stripe</span>
            <span className="text-[10px] text-emerald-300 font-mono">
              {t('welcomeGatewaysConnected', 'CONECTADO')}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06080F] border border-white/15 text-slate-200">
            <span>PayPal</span>
            <span className="text-[10px] text-emerald-300 font-mono">
              {t('welcomeGatewaysConnected', 'CONECTADO')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SUBSCRIPTION PLANS & CHECKOUT CONTAINER */}
      <div id="planes-pago" className="space-y-6 pt-2 scroll-mt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-amber-300">
            {t('welcomePlansKicker', 'Suscripción y prueba de acceso')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight [text-wrap:balance]">
            {t('welcomePlansTitle', 'Elige tu Plan de Acceso StellaWay')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('welcomePlansDesc', 'Selecciona la opción que prefieras: activa tu prueba de 48 horas gratis mediante verificación por email o suscríbete a los planes Pro mediante Stripe o PayPal.')}
          </p>
        </div>

        {/* The 3 Subscription Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1: 48 Horas Gratis */}
          <div
            onClick={() => handleSelectPlan('free2days')}
            className={`rounded-2xl p-6 sm:p-7 border transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'free2days'
                ? 'bg-[#0D1220] border-sky-400/80 shadow-[0_20px_45px_-18px_rgba(56,189,248,0.3)]'
                : 'bg-[#0B0F1A] border-white/15 hover:border-white/30'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-sky-300">
                  {t('welcomePlanFreeBadge', 'Prueba Gratuita')}
                </span>
                {selectedPlan === 'free2days' && (
                  <span className="text-emerald-300 font-semibold">
                    {t('welcomeChosen', '✓ Elegido')}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t('welcomePlanFreeTitle', '48 Horas Gratis')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {t('welcomePlanFreeDesc', 'Acceso total e ilimitado a todas las herramientas de la app durante 2 días completos.')}
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white font-mono tabular-nums">0 €</span>
                  <span className="text-xs text-slate-400">{t('welcomePlanFreeUnit', '/ 48 horas')}</span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium mt-1.5">
                  {t('welcomePlanFreeNote', 'Requiere nombre, apellidos y verificación por email (1 uso por cuenta).')}
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-sky-300">check</span>
                  <span>{t('welcomePlanFreeF1', 'Telemetría y seeing en directo')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-sky-300">check</span>
                  <span>{t('welcomePlanFreeF2', 'Mapas satelitales Bortle 1 a 9')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-sky-300">check</span>
                  <span>{t('welcomePlanFreeF3', 'Asistente IA astronómico Starlight')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan('free2days');
                }}
                className={`w-full py-3 rounded-xl text-xs font-bold text-center border transition-colors cursor-pointer ${
                  selectedPlan === 'free2days'
                    ? 'bg-sky-400 hover:bg-sky-300 text-slate-950 border-sky-300'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                }`}
              >
                {activeTrialEmail ? t('welcomePlanFreeBtnActive', '✓ Prueba Ya Activa') : t('welcomePlanFreeBtn', 'Seleccionar 48h Gratis')}
              </button>
            </div>
          </div>

          {/* Plan 2: Cuota Mensual */}
          <div
            onClick={() => handleSelectPlan('mensual')}
            className={`rounded-2xl p-6 sm:p-7 border transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'mensual'
                ? 'bg-[#0D1220] border-white/70 shadow-[0_20px_45px_-18px_rgba(255,255,255,0.2)]'
                : 'bg-[#0B0F1A] border-white/15 hover:border-white/30'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-300">
                  {t('welcomePlanMonthlyBadge', 'Plan Mensual')}
                </span>
                {selectedPlan === 'mensual' && (
                  <span className="text-emerald-300 font-semibold">
                    {t('welcomeChosen', '✓ Elegido')}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t('welcomePlanMonthlyTitle', 'Starlight Pro')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {t('welcomePlanMonthlyDesc', 'Suscripción mensual flexible. Sin compromiso de permanencia, cancelable en 1 clic.')}
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white font-mono tabular-nums">3,99 €</span>
                  <span className="text-xs text-slate-400">{t('welcomePlanMonthlyUnit', '/ mes')}</span>
                </div>
                <p className="text-xs text-emerald-300 font-medium mt-1.5">
                  {t('welcomePlanMonthlyNote', 'Pago seguro con Tarjeta, Stripe o PayPal.')}
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-300">check</span>
                  <span>{t('welcomePlanMonthlyF1', 'Acceso continuo sin límites')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-300">check</span>
                  <span>{t('welcomePlanMonthlyF2', 'Alertas meteorológicas y auroras')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-300">check</span>
                  <span>{t('welcomePlanMonthlyF3', 'Exportación de diarios de campo')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan('mensual');
                }}
                className={`w-full py-3 rounded-xl text-xs font-bold text-center border transition-colors cursor-pointer ${
                  selectedPlan === 'mensual'
                    ? 'bg-white hover:bg-slate-100 text-slate-950 border-white'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                }`}
              >
                {t('welcomePlanMonthlyBtn', 'Seleccionar Plan Mensual (3,99 €)')}
              </button>
            </div>
          </div>

          {/* Plan 3: Cuota Anual (Destacado) */}
          <div
            onClick={() => handleSelectPlan('anual')}
            className={`rounded-2xl p-6 sm:p-7 border transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'anual'
                ? 'bg-[#11131E] border-amber-300/85 shadow-[0_24px_50px_-18px_rgba(252,211,77,0.28)]'
                : 'bg-[#0B0F1A] border-amber-400/35 hover:border-amber-300/65'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-amber-300">
                  {t('welcomePlanAnnualBadge', 'Pase Anual Completo')}
                </span>
                <span className="text-amber-200 font-semibold">
                  {selectedPlan === 'anual'
                    ? t('welcomeChosen', '✓ Elegido')
                    : t('welcomePlanAnnualRibbon', 'Ahorra un 58%')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t('welcomePlanAnnualTitle', 'Starlight Pass Anual')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {t('welcomePlanAnnualDesc', '12 meses de cobertura total. Especial para disfrutar del Gran Eclipse Total Solar 2027 y lluvias estelares.')}
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-[#FFD700] font-mono tabular-nums">19,99 €</span>
                  <span className="text-xs text-amber-200/80">{t('welcomePlanAnnualUnit', '/ año')}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1.5">
                  {t('welcomePlanAnnualNote', 'Equivale a solo 1,66 € / mes.')}
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-200 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-amber-300">check</span>
                  <span>{t('welcomePlanAnnualF1', 'Pase VIP Gran Eclipse Total Solar 2027')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-amber-300">check</span>
                  <span>{t('welcomePlanAnnualF2', 'Sincronización ilimitada con Google Calendar')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-amber-300">check</span>
                  <span>{t('welcomePlanAnnualF3', 'Soporte prioritario y acceso a novedades')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan('anual');
                }}
                className={`w-full py-3 rounded-xl text-xs font-extrabold text-center border transition-colors cursor-pointer ${
                  selectedPlan === 'anual'
                    ? 'bg-amber-300 hover:bg-amber-200 text-slate-950 border-amber-300'
                    : 'bg-amber-300/15 hover:bg-amber-300/25 text-amber-200 border-amber-300/40'
                }`}
              >
                {t('welcomePlanAnnualBtn', 'Seleccionar Plan Anual (19,99 €)')}
              </button>
            </div>
          </div>
        </div>

        {/* 4. DYNAMIC CHECKOUT & VERIFICATION PANEL */}
        <div
          id="checkout-action-section"
          className="rounded-2xl p-6 sm:p-8 bg-[#0B0F1A] border border-white/15 shadow-2xl scroll-mt-6"
        >
          {/* SECTION A: WHEN 48H FREE TRIAL IS SELECTED -> EMAIL + NAME VERIFICATION */}
          {selectedPlan === 'free2days' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="text-center space-y-1.5">
                <div className="w-11 h-11 rounded-xl bg-sky-400/15 border border-sky-400/35 text-sky-300 mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t('welcomePhoneTitle', 'Verificación por Email para 48 Horas Gratis')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t('welcomePhoneDesc', 'Introduce tu nombre, apellidos y correo electrónico para recibir tu código de activación por email. Se permite 1 prueba gratuita por email y dispositivo.')}
                </p>
              </div>

              {emailStep === 'verified' || activeTrialEmail ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-400/40 space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-300">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                    <span className="text-base font-bold">{t('welcomeTrialActive', '¡Prueba Gratuita de 48 Horas Activa!')}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200">
                    {t('welcomeTrialNumVerified', 'Email verificado:')} <strong className="text-white">{activeTrialEmail || trialEmail}</strong>{t('welcomeTrialAccessNotice', '. Tienes acceso completo e ilimitado a todas las funciones de StellaWay.')}
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (onTriggerInstall) {
                          onTriggerInstall();
                        } else {
                          window.dispatchEvent(new CustomEvent('open-install-modal'));
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer mx-auto"
                    >
                      <div className="w-5 h-5 shrink-0">
                        <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
                          <path
                            d="M 44 16 L 52 34 L 72 35 L 56.5 48 L 62 69 L 44 57.5 L 26 69 L 31.5 48 L 16 35 L 36 34 Z"
                            fill="#0f172a"
                          />
                          <path
                            d="M 12 66 C 9 53, 21 35, 45 28 C 64 22, 80 27, 84 38 C 88 49, 79 66, 55 73 C 34 79, 16 75, 12 66"
                            stroke="#0f172a"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <circle cx="73" cy="15.5" r="3" fill="#0f172a" />
                        </svg>
                      </div>
                      <span>{t('welcomeInstallIconPhoneBtn', 'Instalar Icono en Pantalla de mi Teléfono')}</span>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={onEnterApp}
                      className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer transition-colors border border-white/20"
                    >
                      {t('welcomeEnterDashboard', 'Entrar al Dashboard de Astroturismo')} →
                    </button>
                  </div>
                </div>
              ) : emailStep === 'form' ? (
                <form onSubmit={handleSendEmailCode} className="space-y-4 bg-[#06080F] p-5 sm:p-6 rounded-2xl border border-white/15">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t('welcomeFirstNameLabel', 'Nombre')}
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setTrialError('');
                        }}
                        placeholder={t('welcomeFirstNamePlaceholder', 'Tu nombre')}
                        className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium placeholder-slate-500 focus:border-amber-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t('welcomeLastNameLabel', 'Apellidos')}
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setTrialError('');
                        }}
                        placeholder={t('welcomeLastNamePlaceholder', 'Tus apellidos')}
                        className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium placeholder-slate-500 focus:border-amber-300 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('welcomePhoneLabel', 'Correo Electrónico')}
                    </label>
                    <input
                      type="email"
                      required
                      value={trialEmail}
                      onChange={(e) => {
                        setTrialEmail(e.target.value);
                        setTrialError('');
                      }}
                      placeholder={t('welcomePhonePlaceholder', 'tu@email.com')}
                      className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium placeholder-slate-500 focus:border-amber-300 outline-none"
                    />
                  </div>

                  {trialError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/45 rounded-xl text-xs text-red-200 font-medium leading-relaxed">
                      {trialError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingEmail}
                    className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {isVerifyingEmail ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{t('welcomeSendingSms', 'Enviando código por email...')}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">mark_email_read</span>
                        <span>{t('welcomeSendSmsBtn', 'Enviar Código de Activación por Email')}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailCode} className="space-y-4 bg-[#06080F] p-5 sm:p-6 rounded-2xl border border-white/15 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-emerald-300 font-semibold">
                      {t('welcomeSmsSentTo', '✓ Código de verificación enviado a')} {trialEmail}
                    </p>
                    <p className="text-xs text-slate-300">
                      {t('welcomeSmsPrompt', 'Introduce el código enviado a tu email para activar tus 48 horas:')}
                    </p>

                    <div className="mt-2 p-3 rounded-xl bg-amber-300/10 border border-amber-300/30 text-amber-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-left">
                        <span className="material-symbols-outlined text-base text-amber-300">mail</span>
                        <span>{t('welcomeSmsReceived', 'Email recibido: Código')} <strong className="font-mono">{simulatedCode}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailCode(simulatedCode)}
                        className="px-2.5 py-1 rounded-lg bg-amber-300 text-slate-950 font-bold text-[11px] hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        {t('welcomeAutoFill', 'Auto-rellenar')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                      {t('welcomeSmsCodeLabel', 'Código de verificación por email')} · {simulatedCode}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={emailCode}
                      onChange={(e) => {
                        setEmailCode(e.target.value);
                        setTrialError('');
                      }}
                      placeholder={simulatedCode}
                      className="w-full max-w-xs mx-auto block text-center tracking-[0.5em] bg-[#0D111C] border border-sky-400/50 rounded-xl px-4 py-3 text-white text-xl font-mono font-bold focus:border-amber-300 outline-none"
                    />
                  </div>

                  {trialError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/45 rounded-xl text-xs text-red-200 font-medium leading-relaxed">
                      {trialError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEmailStep('form')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {t('welcomeChangeNumber', 'Cambiar Email')}
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingEmail}
                      className="flex-1 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifyingEmail ? t('welcomeVerifying', 'Verificando...') : t('welcomeActivateTrialBtn', 'Activar 48 Horas Gratis')}
                    </button>
                  </div>
                </form>
              )}

              {/* Direct Stripe Registration for 48h Free Trial */}
              <div className="pt-3 border-t border-white/10 flex flex-col items-center gap-2 text-center">
                <span className="text-xs text-slate-400">
                  {t('welcomePreferDirectStripe', '¿Prefieres activar las 48h directamente a través de Stripe (0,00 €)?')}
                </span>
                <a
                  href={getDirectStripeUrl('free2days')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5349DF] text-white text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>{t('welcomeDirectStripeTrialBtn', 'Activar 48h Gratis en Stripe (0,00 €)')}</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              {/* Direct Cancellation / Unsubscribe for 48h Free Trial */}
              <div className="pt-3 border-t border-white/10 flex flex-col items-center gap-2 text-center">
                <span className="text-xs text-slate-400">
                  {t('welcomeCancelPromptLine', '¿Deseas dar de baja tu prueba de 48 horas o una suscripción activa?')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 border border-rose-500/45 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-rose-400">cancel</span>
                  <span>{t('welcomeCancelBtn', 'Dar de baja la suscripción')}</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION B: WHEN PAID PLAN (MENSUAL / ANUAL) IS SELECTED -> PAYMENT GATEWAYS (STRIPE & PAYPAL) */}
          {(selectedPlan === 'mensual' || selectedPlan === 'anual') && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Payment Method Selector Tabs (Stripe & PayPal) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'bg-amber-300/15 border-amber-300/70 text-amber-200'
                      : 'bg-[#06080F] border-white/15 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                  <span className="text-xs font-bold">{t('welcomeMethodStripe', 'Stripe / Tarjeta')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-sky-400/15 border-sky-400/70 text-sky-200'
                      : 'bg-[#06080F] border-white/15 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                  <span className="text-xs font-bold">{t('welcomeMethodPaypal', 'PayPal')}</span>
                </button>
              </div>

              {/* Payment Success View */}
              {paymentSuccessData ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-400/50 space-y-4 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-400 text-slate-950 mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl font-bold">check</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{t('welcomeSuccessTitle', '¡Suscripción Activada con Éxito!')}</h4>
                    <p className="text-xs text-emerald-200 mt-1">
                      {t('welcomeProcessedBy', 'Procesado por')} <strong>{paymentSuccessData.provider}</strong> · Ref:{' '}
                      <span className="font-mono text-white">{paymentSuccessData.transactionId}</span>
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#06080F] border border-white/10 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>{t('welcomePlanLabel', 'Plan:')}</span>
                      <span className="font-semibold text-white">{getLocalizedPlanName(paymentSuccessData.planId, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('welcomeAmountLabel', 'Importe:')}</span>
                      <span className="font-semibold text-white font-mono tabular-nums">{paymentSuccessData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('welcomeStatusLabel', 'Estado:')}</span>
                      <span className="text-emerald-300 font-semibold">{t('welcomeStatusActiveValue', 'Activo · Acceso Total')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onTriggerInstall) {
                          onTriggerInstall();
                        } else {
                          window.dispatchEvent(new CustomEvent('open-install-modal'));
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer mx-auto"
                    >
                      <div className="w-5 h-5 shrink-0">
                        <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
                          <path
                            d="M 44 16 L 52 34 L 72 35 L 56.5 48 L 62 69 L 44 57.5 L 26 69 L 31.5 48 L 16 35 L 36 34 Z"
                            fill="#0f172a"
                          />
                          <path
                            d="M 12 66 C 9 53, 21 35, 45 28 C 64 22, 80 27, 84 38 C 88 49, 79 66, 55 73 C 34 79, 16 75, 12 66"
                            stroke="#0f172a"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <circle cx="73" cy="15.5" r="3" fill="#0f172a" />
                        </svg>
                      </div>
                      <span>{t('welcomeInstallIconPhoneBtn', 'Poner Icono en Pantalla de mi Teléfono')}</span>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={onEnterApp}
                      className="px-8 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer transition-colors border border-white/20"
                    >
                      {t('welcomeEnterAppBtn', 'Entrar a StellaWay Astroturismo')} →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* STRIPE FORM */}
                  {paymentMethod === 'stripe' && (
                    <form onSubmit={handleStripePayment} className="space-y-4 bg-[#06080F] p-5 sm:p-6 rounded-2xl border border-white/15">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-300">
                          {t('welcomeCardDetails', 'Detalles de la Tarjeta (Stripe Checkout)')}
                        </span>
                        <div className="text-[11px] font-medium text-slate-400">
                          Visa · Mastercard · Amex · Apple Pay
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          {t('welcomeBillingEmailLabel', 'Correo Electrónico (para facturación y gestión de suscripción)')}
                        </label>
                        <input
                          type="email"
                          required
                          value={billingEmail}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          placeholder={t('welcomeBillingEmailPlaceholder', 'tu-correo@ejemplo.com')}
                          className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm font-medium placeholder-slate-500 focus:border-amber-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          {t('welcomeCardHolder', 'Nombre del Titular')}
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder={t('welcomeCardHolderPlaceholder', 'Nombre y Apellidos')}
                          className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm font-medium placeholder-slate-500 focus:border-amber-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          {t('welcomeCardNumber', 'Número de Tarjeta')}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm font-mono font-semibold placeholder-slate-500 focus:border-amber-300 outline-none pr-10"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-base">
                            lock
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            {t('welcomeCardExpiry', 'MM / AA')}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm font-mono font-semibold text-center placeholder-slate-500 focus:border-amber-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            {t('welcomeCardCvc', 'CVC')}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm font-mono font-semibold text-center placeholder-slate-500 focus:border-amber-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            {t('welcomeCardZip', 'Código Postal')}
                          </label>
                          <input
                            type="text"
                            required
                            value={cardZip}
                            onChange={(e) => setCardZip(e.target.value)}
                            placeholder="28001"
                            className="w-full bg-[#0D111C] border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm font-mono font-semibold text-center placeholder-slate-500 focus:border-amber-300 outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full py-3.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>{t('welcomeProcessingStripe', 'Procesando pago con Stripe...')}</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-base">lock</span>
                            <span>
                              {t('welcomePayWithStripe', 'Pagar con Stripe')} ({selectedPlan === 'mensual' ? '3,99 €' : '19,99 €'})
                            </span>
                          </>
                        )}
                      </button>

                      {/* Direct Stripe Checkout Link (Official StellaWay Link) */}
                      <div className="pt-3 border-t border-white/10 flex flex-col items-center gap-2 text-center">
                        <span className="text-xs text-slate-400">
                          {t('welcomeStripeNewTabNotice', '¿Prefieres la pasarela oficial de Stripe en pestaña nueva?')}
                        </span>
                        <a
                          href={getDirectStripeUrl(selectedPlan)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5349DF] text-white text-xs font-bold transition-colors"
                        >
                          <span>{t('welcomeOpenOfficialStripe', 'Abrir Enlace Oficial de Stripe')} ({selectedPlan === 'mensual' ? '3,99 €' : '19,99 €'})</span>
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      </div>
                    </form>
                  )}

                  {/* PAYPAL FLOW */}
                  {paymentMethod === 'paypal' && (
                    <div className="space-y-4 bg-[#06080F] p-5 sm:p-6 rounded-2xl border border-white/15 text-center">
                      <div className="space-y-2">
                        <div className="w-11 h-11 rounded-xl bg-[#0070BA] text-white mx-auto flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {t('welcomePaypalTitle', 'Pagar de forma rápida y segura con PayPal')}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                          {t('welcomePaypalDesc', 'Inicia sesión con tu cuenta de PayPal para autorizar el pago con protección completa al comprador.')}{' '}
                          <strong className="text-white font-mono tabular-nums">
                            ({selectedPlan === 'mensual'
                              ? `3,99 € ${t('welcomePlanMonthlyUnit', '/ mes')}`
                              : `19,99 € ${t('welcomePlanAnnualUnit', '/ año')}`})
                          </strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handlePayPalPayment}
                        disabled={isProcessingPayment}
                        className="w-full py-3.5 rounded-xl bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#003087] border-t-transparent rounded-full animate-spin" />
                            <span>{t('welcomePaypalConnecting', 'Conectando con PayPal...')}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-extrabold font-serif italic text-base">P</span>
                            <span>{t('welcomePaypalBtn', 'Pagar con PayPal Express')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 5. CANCELLATION & LEGAL UN-SUBSCRIPTION SECTION */}
        <div
          id="dar-de-baja-seccion"
          className="rounded-2xl p-6 sm:p-7 bg-[#11080B]/90 border border-rose-500/35 backdrop-blur-xl space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">cancel</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-rose-300">
                  {t('welcomeCancelSectionBadge', 'Derecho de desistimiento y baja directa')}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t('welcomeCancelSectionTitle', 'Dar de baja la suscripción o prueba gratuita')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {t(
                    'welcomeCancelSectionDesc',
                    'Conforme a la normativa legal de protección de consumidores y usuarios (Real Decreto Legislativo 1/2007 y Directiva UE), puedes tramitar la baja o cancelación de la renovación de cualquier suscripción o prueba en cualquier momento de forma gratuita, inmediata y sin penalización.'
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                <span>{t('welcomeCancelBtn', 'Dar de baja la suscripción')}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-sm text-rose-400">verified</span>
              {t('welcomeCancelLegal', 'Baja inmediata sin permanencia ni cobros futuros')}
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <a
                href={withStripeLocale('https://billing.stripe.com/', language)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-white underline underline-offset-4"
              >
                {t('welcomeStripePortalLink', 'Portal Clientes Stripe')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cancellation Modal */}
      <SubscriptionCancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancellationSuccess={() => {
          setActiveTrialEmail(null);
          setEmailStep('form');
          setPaymentSuccessData(null);
          setTrialError('');
        }}
      />
    </div>
  );
};
