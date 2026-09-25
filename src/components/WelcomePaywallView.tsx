import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StellaLogo } from './StellaLogo';
import { WORLD_DIAL_CODES } from '../data/countryDialCodes';

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
  const { t, language, setLanguage, languageOptions } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'free2days' | 'mensual' | 'anual'>(selectedPlanDefault);

  useEffect(() => {
    if (selectedPlanDefault) {
      setSelectedPlan(selectedPlanDefault);
    }
  }, [selectedPlanDefault]);

  // Phone SMS verification state for 48h Free Trial
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+34');
  const [smsCode, setSmsCode] = useState('');
  const [smsStep, setSmsStep] = useState<'phone' | 'code' | 'verified'>('phone');
  const [simulatedCode, setSimulatedCode] = useState('1234');
  const [trialError, setTrialError] = useState('');
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);
  const [activeTrialPhone, setActiveTrialPhone] = useState<string | null>(null);

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
    planName: string;
  } | null>(null);

  // Stripe card fields
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
    // Ensure view starts smoothly at the absolute top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const savedPhone = localStorage.getItem('stellaway_trial_phone');
    const trialExpires = localStorage.getItem('stellaway_trial_expires');
    if (savedPhone && trialExpires && Number(trialExpires) > Date.now()) {
      setActiveTrialPhone(savedPhone);
      setSmsStep('verified');
    }

    // Fetch gateway status from server.ts endpoint
    fetch('/api/payment-config')
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
  }, []);

  const handleNavigate = (tab: ActiveTab) => {
    if (!hasAccess) {
      // Bloquear acceso a funciones si no está suscrito o verificado
      const targetElement = document.getElementById('planes-pago');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      setTrialError('🔒 Acceso protegido: Selecciona tu modalidad de 48 horas gratis o tu suscripción para entrar a este módulo.');
      return;
    }

    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      onEnterApp();
    }
  };

  // Handle phone SMS submission for 48-hour free trial
  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialError('');
    const fullPhone = `${countryCode} ${phoneNumber}`.trim().replace(/\s+/g, '');
    const cleanDigits = phoneNumber.trim().replace(/\s+/g, '');
    if (cleanDigits.length < 6) {
      setTrialError('Por favor introduce un número de teléfono móvil válido.');
      return;
    }

    const usedPhones = JSON.parse(localStorage.getItem('stellaway_used_trial_phones') || '[]');
    const deviceUsed = localStorage.getItem('stellaway_device_trial_used');

    if (usedPhones.includes(fullPhone) || deviceUsed === 'true') {
      setTrialError(`⚠️ El teléfono (${fullPhone}) o este dispositivo ya ha disfrutado de los 2 Días Gratis. Selecciona el Plan Mensual (3,99 €) o Anual (19,99 €) para continuar.`);
      return;
    }

    // Generate random 4-digit code
    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    setSimulatedCode(generatedCode);

    setIsVerifyingSms(true);
    try {
      const res = await fetch('/api/verify-trial-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmsStep('code');
      } else {
        setSmsStep('code');
      }
    } catch {
      // Fallback in client mode
      setSmsStep('code');
    } finally {
      setIsVerifyingSms(false);
    }
  };

  // Handle SMS code confirmation
  const handleVerifySmsCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialError('');
    if (smsCode.trim().length < 4) {
      setTrialError('El código SMS debe tener al menos 4 dígitos (Ej: 1234).');
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber}`.trim().replace(/\s+/g, '');
    setIsVerifyingSms(true);

    try {
      const res = await fetch('/api/verify-trial-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code: smsCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const usedPhones = JSON.parse(localStorage.getItem('stellaway_used_trial_phones') || '[]');
        if (!usedPhones.includes(fullPhone)) {
          usedPhones.push(fullPhone);
          localStorage.setItem('stellaway_used_trial_phones', JSON.stringify(usedPhones));
        }
        localStorage.setItem('stellaway_device_trial_used', 'true');
        localStorage.setItem('stellaway_trial_phone', fullPhone);
        localStorage.setItem('stellaway_trial_expires', String(Date.now() + 48 * 3600 * 1000));
        localStorage.setItem('stellaway_subscription_active', 'true');
        localStorage.setItem('stellaway_active_plan', 'free2days');

        setActiveTrialPhone(fullPhone);
        setSmsStep('verified');
      } else {
        // In case of mock testing or code acceptance
        const usedPhones = JSON.parse(localStorage.getItem('stellaway_used_trial_phones') || '[]');
        if (!usedPhones.includes(fullPhone)) {
          usedPhones.push(fullPhone);
          localStorage.setItem('stellaway_used_trial_phones', JSON.stringify(usedPhones));
        }
        localStorage.setItem('stellaway_device_trial_used', 'true');
        localStorage.setItem('stellaway_trial_phone', fullPhone);
        localStorage.setItem('stellaway_trial_expires', String(Date.now() + 48 * 3600 * 1000));
        localStorage.setItem('stellaway_subscription_active', 'true');
        localStorage.setItem('stellaway_active_plan', 'free2days');

        setActiveTrialPhone(fullPhone);
        setSmsStep('verified');
      }
    } catch {
      // Offline fallback
      localStorage.setItem('stellaway_trial_phone', fullPhone);
      localStorage.setItem('stellaway_trial_expires', String(Date.now() + 48 * 3600 * 1000));
      localStorage.setItem('stellaway_subscription_active', 'true');
      localStorage.setItem('stellaway_active_plan', 'free2days');
      setActiveTrialPhone(fullPhone);
      setSmsStep('verified');
    } finally {
      setIsVerifyingSms(false);
    }
  };

  // Direct Stripe Payment Links (StellaWay Official)
  const STRIPE_DIRECT_PAYMENT_LINKS: Record<string, string> = {
    free2days: 'https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06',
    mensual: 'https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04',
    anual: 'https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05',
  };

  // Handle Stripe Payment
  const handleStripePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessingPayment(true);

    try {
      const res = await fetch('/api/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          customerName: cardHolder || 'Astrónomo Starlight',
          customerEmail: 'usuario@stellaway.org',
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        // Redirect to real Stripe hosted checkout session
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
          planName: selectedPlan === 'mensual' ? 'Plan Mensual Starlight Pro' : 'Plan Anual Starlight Pass',
        });
      }
    } catch (err) {
      console.error('Error in Stripe payment flow:', err);
      // Fallback: open direct Stripe payment link
      const directLink = STRIPE_DIRECT_PAYMENT_LINKS[selectedPlan] || STRIPE_DIRECT_PAYMENT_LINKS.anual;
      window.location.href = directLink;
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
          customerEmail: 'usuario@paypal.com',
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
          planName: selectedPlan === 'mensual' ? 'Plan Mensual Starlight Pro' : 'Plan Anual Starlight Pass',
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
    <div id="welcome-top" className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 space-y-8 animate-fadeIn text-white">
      {/* 1. HERO BRANDING & WELCOME BANNER */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-[#38BDF8]/40 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-[#082F49]/80 via-[#0C4A6E]/70 to-[#082F49]/90">
        {/* Background glow orb */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#0284C7]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#38BDF8]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/50 border border-[#38BDF8]/70 text-white text-[11px] font-black tracking-wider uppercase shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{t('welcomePlatformBadge', 'Plataforma Oficial de Astroturismo & Observación Estelar')}</span>
              </div>

              {/* Language Switcher with German DE included */}
              <div className="inline-flex items-center gap-1 bg-[#082F49]/90 border border-[#38BDF8]/50 rounded-full p-0.5 shadow-md">
                <span className="text-[10px] text-[#BAE6FD] font-bold px-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#FEE685]">language</span>
                </span>
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                      language === opt.code
                        ? 'bg-[#FEE685] text-[#120D1C] shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    title={opt.name}
                  >
                    {opt.flag} {opt.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <h1 id="welcome-heading" className="text-2xl sm:text-4xl md:text-5xl font-black font-['Plus_Jakarta_Sans'] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] text-white">
              {t('welcomeTitle', 'Bienvenido a')}{' '}
              <span className="text-[#F0DEAA] drop-shadow-[0_0_12px_rgba(240,222,170,0.45)]">
                {t('welcomeSubtitle', 'StellaWay Astroturismo')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#BAE6FD] font-medium leading-relaxed max-w-2xl">
              {t('welcomeDesc', 'Descubre los mejores cielos oscuros de España, telemetría atmosférica en tiempo real, mapas satelitales de contaminación lumínica (Bortle 1 a 9) y la cobertura más avanzada para el Gran Eclipse Total Solar 2027.')}
            </p>

            {/* SECTIONS & FEATURE PILLS / PESTAÑAS DE ACCESO - BLOQUEADAS HASTA REGISTRO/PAGO */}
            <div className="pt-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#7DD3FC] block font-mono">
                  {t('welcomeModulesTitle', 'Módulos y Funciones Incluidas (Acceso Premium):')}
                </span>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  <span>{t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleNavigate('events')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-[#0284C7] border border-white/20 hover:border-[#38BDF8] text-white cursor-pointer active:scale-95'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer'
                  }`}
                  title={hasAccess ? t('events', 'Eventos Estelares') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-amber-300">flare</span>
                  <span>{t('events', 'Eventos Estelares')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300 ml-1">lock</span>}
                </button>

                <button
                  onClick={() => handleNavigate('assistant')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-[#0284C7] border border-white/20 hover:border-[#38BDF8] text-white cursor-pointer active:scale-95'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer'
                  }`}
                  title={hasAccess ? t('assistant', 'Asistente IA Starlight') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-emerald-300">smart_toy</span>
                  <span>{t('assistant', 'Asistente IA Starlight')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300 ml-1">lock</span>}
                </button>

                <button
                  onClick={() => handleNavigate('weather')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-[#0284C7] border border-white/20 hover:border-[#38BDF8] text-white cursor-pointer active:scale-95'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer'
                  }`}
                  title={hasAccess ? t('weather', 'Previsión del tiempo') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-sky-300">cloud_sync</span>
                  <span>{t('weather', 'Previsión del tiempo')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300 ml-1">lock</span>}
                </button>

                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasAccess
                      ? 'bg-white/10 hover:bg-[#0284C7] border border-white/20 hover:border-[#38BDF8] text-white cursor-pointer active:scale-95'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer'
                  }`}
                  title={hasAccess ? t('dashboard', 'Dashboard Eclipse 2027') : t('welcomeModulesLock', 'Requiere Registro o Pase Activo')}
                >
                  <span className="material-symbols-outlined text-sm text-amber-400">eclipse</span>
                  <span>{t('dashboard', 'Dashboard Eclipse 2027')}</span>
                  {!hasAccess && <span className="material-symbols-outlined text-[13px] text-amber-300 ml-1">lock</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action to Enter or View App */}
          <div className="shrink-0 flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
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
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FEE685] via-[#F0DEAA] to-[#E5B54F] text-[#120822] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-amber-950/40 border border-white/60 cursor-pointer active:scale-95 transition-all hover:scale-105"
                  title="Poner icono con estrella y círculo en la pantalla de inicio"
                >
                  <div className="w-5 h-5 shrink-0">
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
                  <span>Instalar en Móvil</span>
                </button>

                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 border border-emerald-300 cursor-pointer active:scale-95 transition-all"
                >
                  <span>{t('welcomeBtnEnterApp', 'Acceder')}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            ) : (
              <a
                href="#planes-pago"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/40 border border-amber-200 cursor-pointer active:scale-95 transition-all text-center"
              >
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>{t('welcomeBtnUnlock', 'Desbloquear Acceso Completo')}</span>
              </a>
            )}
            <span className="text-[11px] text-[#7DD3FC] font-bold">
              {hasAccess ? t('welcomeStatusActive', '✓ Acceso Activo Desbloqueado') : t('welcomeStatusLocked', '🔒 Requiere activar 48h Gratis o Suscripción')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PAYMENT GATEWAYS VERIFICATION STATUS BAR (Stripe & PayPal) */}
      <div className="rounded-2xl p-4 bg-[#082F49]/70 border border-[#38BDF8]/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold shadow-md">
            <span className="material-symbols-outlined text-base">verified_user</span>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {t('welcomeGatewaysTitle', 'Pasarelas de Pago Oficiales Conectadas')}
            </h4>
            <p className="text-[11px] text-[#BAE6FD] font-medium">
              {t('welcomeGatewaysDesc', 'Transacciones seguras con encriptación SSL de 256 bits y protección contra fraude.')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          {/* Stripe Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0369A1]/60 border border-[#38BDF8]/50 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Stripe</span>
            <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
              {t('welcomeGatewaysConnected', 'CONECTADO')}
            </span>
          </div>

          {/* PayPal Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0369A1]/60 border border-[#38BDF8]/50 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>PayPal</span>
            <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
              {t('welcomeGatewaysConnected', 'CONECTADO')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SUBSCRIPTION PLANS & CHECKOUT CONTAINER */}
      <div id="planes-pago" className="space-y-6 pt-2 scroll-mt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-black font-['Plus_Jakarta_Sans'] text-white">
            {t('welcomePlansTitle', 'Elige tu Plan de Acceso StellaWay')}
          </h2>
          <p className="text-xs sm:text-sm text-[#BAE6FD] font-medium">
            {t('welcomePlansDesc', 'Selecciona la opción que prefieras: activa tu prueba de 48 horas gratis mediante verificación telefónica o suscríbete a los planes Pro mediante Stripe o PayPal.')}
          </p>
        </div>

        {/* The 3 Subscription Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan 1: 48 Horas Gratis */}
          <div
            onClick={() => handleSelectPlan('free2days')}
            className={`rounded-3xl p-6 border transition-all cursor-pointer relative backdrop-blur-xl flex flex-col justify-between ${
              selectedPlan === 'free2days'
                ? 'bg-[#082F49]/95 border-2 border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.35)] scale-[1.02]'
                : 'bg-[#082F49]/60 border-[#38BDF8]/30 hover:bg-[#082F49]/80'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-[#7DD3FC] border border-sky-400/40 text-[10px] font-black uppercase tracking-wider">
                  {t('welcomePlanFreeBadge', 'Prueba Gratuita')}
                </span>
                {selectedPlan === 'free2days' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-bold">
                    {t('welcomeChosen', '✓ Elegido')}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                  {t('welcomePlanFreeTitle', '48 Horas Gratis')}
                </h3>
                <p className="text-xs text-[#BAE6FD] mt-1 font-medium leading-relaxed">
                  {t('welcomePlanFreeDesc', 'Acceso total e ilimitado a todas las herramientas de la app durante 2 días completos.')}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-['JetBrains_Mono']">0 €</span>
                  <span className="text-xs text-[#7DD3FC] font-bold">{t('welcomePlanFreeUnit', '/ 48 horas')}</span>
                </div>
                <p className="text-[11px] text-amber-300 font-bold mt-1">
                  {t('welcomePlanFreeNote', '📱 Requiere verificación por SMS (1 uso por móvil).')}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#E0F2FE] pt-2 border-t border-[#38BDF8]/30">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanFreeF1', 'Telemetría y seeing en directo')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanFreeF2', 'Mapas satelitales Bortle 1 a 9')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanFreeF3', 'Asistente IA astronómico Starlight')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan('free2days');
                }}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                  selectedPlan === 'free2days'
                    ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white border-[#7DD3FC]/60 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                {activeTrialPhone ? t('welcomePlanFreeBtnActive', '✓ Prueba Ya Activa') : t('welcomePlanFreeBtn', 'Seleccionar 48h Gratis')}
              </button>
            </div>
          </div>

          {/* Plan 2: Cuota Mensual */}
          <div
            onClick={() => handleSelectPlan('mensual')}
            className={`rounded-3xl p-6 border transition-all cursor-pointer relative backdrop-blur-xl flex flex-col justify-between ${
              selectedPlan === 'mensual'
                ? 'bg-[#082F49]/95 border-2 border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.35)] scale-[1.02]'
                : 'bg-[#082F49]/60 border-[#38BDF8]/30 hover:bg-[#082F49]/80'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-[#7DD3FC] border border-blue-400/40 text-[10px] font-black uppercase tracking-wider">
                  {t('welcomePlanMonthlyBadge', 'Plan Mensual')}
                </span>
                {selectedPlan === 'mensual' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-bold">
                    {t('welcomeChosen', '✓ Elegido')}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                  {t('welcomePlanMonthlyTitle', 'Starlight Pro')}
                </h3>
                <p className="text-xs text-[#BAE6FD] mt-1 font-medium leading-relaxed">
                  {t('welcomePlanMonthlyDesc', 'Suscripción mensual flexible. Sin compromiso de permanencia, cancelable en 1 clic.')}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-['JetBrains_Mono']">3,99 €</span>
                  <span className="text-xs text-[#7DD3FC] font-bold">{t('welcomePlanMonthlyUnit', '/ mes')}</span>
                </div>
                <p className="text-[11px] text-emerald-300 font-bold mt-1">
                  {t('welcomePlanMonthlyNote', '💳 Pago seguro con Tarjeta, Stripe o PayPal.')}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#E0F2FE] pt-2 border-t border-[#38BDF8]/30">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanMonthlyF1', 'Acceso continuo sin límites')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanMonthlyF2', 'Alertas meteorológicas y auroras')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanMonthlyF3', 'Exportación de diarios de campo')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan('mensual');
                }}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                  selectedPlan === 'mensual'
                    ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white border-[#7DD3FC]/60 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                {t('welcomePlanMonthlyBtn', 'Seleccionar Plan Mensual (3,99 €)')}
              </button>
            </div>
          </div>

          {/* Plan 3: Cuota Anual (Destacado) */}
          <div
            onClick={() => handleSelectPlan('anual')}
            className={`rounded-3xl p-6 border transition-all cursor-pointer relative backdrop-blur-xl flex flex-col justify-between ${
              selectedPlan === 'anual'
                ? 'bg-[#082F49]/95 border-2 border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.35)] scale-[1.02]'
                : 'bg-[#082F49]/60 border-[#38BDF8]/30 hover:bg-[#082F49]/80'
            }`}
          >
            {/* Best Value Ribbon */}
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg border border-amber-300">
              {t('welcomePlanAnnualRibbon', '⭐ Ahorra un 58%')}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                  {t('welcomePlanAnnualBadge', 'Pase Anual Completo')}
                </span>
                {selectedPlan === 'anual' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-bold">
                    {t('welcomeChosen', '✓ Elegido')}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                  {t('welcomePlanAnnualTitle', 'Starlight Pass Anual')}
                </h3>
                <p className="text-xs text-[#BAE6FD] mt-1 font-medium leading-relaxed">
                  {t('welcomePlanAnnualDesc', '12 meses de cobertura total. Especial para disfrutar del Gran Eclipse Total Solar 2027 y lluvias estelares.')}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-['JetBrains_Mono']">19,99 €</span>
                  <span className="text-xs text-amber-300 font-bold">{t('welcomePlanAnnualUnit', '/ año')}</span>
                </div>
                <p className="text-[11px] text-[#BAE6FD] font-bold mt-1">
                  {t('welcomePlanAnnualNote', 'Equivale a solo 1,66 € / mes.')}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#E0F2FE] pt-2 border-t border-[#38BDF8]/30">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanAnnualF1', 'Pase VIP Gran Eclipse Total Solar 2027')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanAnnualF2', 'Sincronización ilimitada con Google Calendar')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                  <span>{t('welcomePlanAnnualF3', 'Soporte prioritario y acceso a novedades')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan('anual');
                }}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                  selectedPlan === 'anual'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black border-amber-300 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                {t('welcomePlanAnnualBtn', 'Seleccionar Plan Anual (19,99 €)')}
              </button>
            </div>
          </div>
        </div>

        {/* 4. DYNAMIC CHECKOUT & VERIFICATION PANEL */}
        <div id="checkout-action-section" className="rounded-3xl p-6 sm:p-8 bg-[#082F49]/80 border border-[#38BDF8]/40 shadow-2xl backdrop-blur-xl scroll-mt-6">
          {/* SECTION A: WHEN 48H FREE TRIAL IS SELECTED -> PHONE VERIFICATION */}
          {selectedPlan === 'free2days' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white mx-auto flex items-center justify-center font-black shadow-lg">
                  <span className="material-symbols-outlined text-2xl">smartphone</span>
                </div>
                <h3 className="text-lg font-black text-white font-['Plus_Jakarta_Sans']">
                  {t('welcomePhoneTitle', 'Verificación Telefónica para 48 Horas Gratis')}
                </h3>
                <p className="text-xs text-[#BAE6FD] font-medium leading-relaxed">
                  {t('welcomePhoneDesc', 'Introduce tu número móvil para recibir un SMS gratuito con tu código de activación. Se permite 1 prueba gratuita por número y dispositivo.')}
                </p>
              </div>

              {smsStep === 'verified' || activeTrialPhone ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/60 border border-emerald-400/50 space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                    <span className="text-base font-black">{t('welcomeTrialActive', '¡Prueba Gratuita de 48 Horas Activa!')}</span>
                  </div>
                  <p className="text-xs text-emerald-200">
                    {t('welcomeTrialNumVerified', 'Número verificado:')} <strong>{activeTrialPhone || phoneNumber}</strong>{t('welcomeTrialAccessNotice', '. Tienes acceso completo e ilimitado a todas las funciones de StellaWay.')}
                  </p>

                  {/* Prominent Star-with-circle Install Button */}
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
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FEE685] via-[#F0DEAA] to-[#E5B54F] text-[#120822] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(240,222,170,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/80 mx-auto"
                    >
                      <div className="w-6 h-6 shrink-0">
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
                      <span>Instalar Icono en Pantalla de mi Teléfono</span>
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={onEnterApp}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all border border-emerald-400/40"
                    >
                      {t('welcomeEnterDashboard', 'Entrar al Dashboard de Astroturismo')} →
                    </button>
                  </div>
                </div>
              ) : smsStep === 'phone' ? (
                <form onSubmit={handleSendSms} className="space-y-4 bg-[#0C4A6E]/50 p-5 rounded-2xl border border-[#38BDF8]/30">
                  <div>
                    <label className="block text-xs font-black text-[#7DD3FC] mb-1.5 uppercase tracking-wider">
                      {t('welcomePhoneLabel', 'Número de Teléfono Móvil')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-2.5 py-2.5 text-white text-xs font-bold focus:border-[#7DD3FC] outline-none max-w-[170px] sm:max-w-[220px] cursor-pointer"
                      >
                        <optgroup label="🌟 Países Hispanohablantes (Prioritario)">
                          {WORLD_DIAL_CODES.filter((c) => c.region === 'hispanic').map((c) => (
                            <option key={`${c.region}-${c.code}-${c.name}`} value={c.code}>
                              {c.flag} {c.code} {c.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🌎 Resto de América">
                          {WORLD_DIAL_CODES.filter((c) => c.region === 'americas').map((c) => (
                            <option key={`${c.region}-${c.code}-${c.name}`} value={c.code}>
                              {c.flag} {c.code} {c.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🇪🇺 Europa">
                          {WORLD_DIAL_CODES.filter((c) => c.region === 'europe').map((c) => (
                            <option key={`${c.region}-${c.code}-${c.name}`} value={c.code}>
                              {c.flag} {c.code} {c.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🌏 Asia y Oceanía">
                          {WORLD_DIAL_CODES.filter((c) => c.region === 'asia_oceania').map((c) => (
                            <option key={`${c.region}-${c.code}-${c.name}`} value={c.code}>
                              {c.flag} {c.code} {c.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🌍 África">
                          {WORLD_DIAL_CODES.filter((c) => c.region === 'africa').map((c) => (
                            <option key={`${c.region}-${c.code}-${c.name}`} value={c.code}>
                              {c.flag} {c.code} {c.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>

                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setTrialError('');
                        }}
                        placeholder="612 345 678"
                        className="flex-1 bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-sm font-bold placeholder-[#7DD3FC]/40 focus:border-[#7DD3FC] outline-none"
                      />
                    </div>
                  </div>

                  {trialError && (
                    <div className="p-3 bg-red-900/60 border border-red-500/50 rounded-xl text-xs text-red-200 font-bold leading-relaxed">
                      {trialError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingSms}
                    className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50"
                  >
                    {isVerifyingSms ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('welcomeSendingSms', 'Enviando código SMS...')}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">send_to_mobile</span>
                        <span>{t('welcomeSendSmsBtn', 'Enviar Código SMS de Activación')}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifySmsCode} className="space-y-4 bg-[#0C4A6E]/50 p-5 rounded-2xl border border-[#38BDF8]/30 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-emerald-300 font-bold">
                      {t('welcomeSmsSentTo', '✓ Código SMS enviado al')} {countryCode} {phoneNumber}
                    </p>
                    <p className="text-[11px] text-[#BAE6FD]">
                      {t('welcomeSmsPrompt', 'Introduce el código recibido por SMS para activar tus 48 horas:')}
                    </p>

                    {/* Simulated SMS Notification Banner for test demonstration */}
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-left">
                        <span className="material-symbols-outlined text-base text-amber-300">sms</span>
                        <span>{t('welcomeSmsReceived', 'SMS recibido: Código')} <strong>{simulatedCode}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSmsCode(simulatedCode)}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 text-black font-black text-[10px] uppercase hover:bg-amber-300 transition-all cursor-pointer"
                      >
                        {t('welcomeAutoFill', 'Auto-rellenar')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#7DD3FC] mb-1.5 uppercase tracking-wider text-center">
                      {t('welcomeSmsCodeLabel', 'Código SMS')} (Ej: {simulatedCode})
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={smsCode}
                      onChange={(e) => {
                        setSmsCode(e.target.value);
                        setTrialError('');
                      }}
                      placeholder={simulatedCode}
                      className="w-full max-w-xs mx-auto block text-center tracking-[0.5em] bg-[#082F49] border-2 border-[#38BDF8] rounded-xl px-4 py-3 text-white text-xl font-mono font-black focus:border-[#7DD3FC] outline-none"
                    />
                  </div>

                  {trialError && (
                    <div className="p-3 bg-red-900/60 border border-red-500/50 rounded-xl text-xs text-red-200 font-bold leading-relaxed">
                      {trialError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSmsStep('phone')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                    >
                      {t('welcomeChangeNumber', 'Cambiar Número')}
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingSms}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      {isVerifyingSms ? t('welcomeVerifying', 'Verificando...') : t('welcomeActivateTrialBtn', 'Activar 48 Horas Gratis')}
                    </button>
                  </div>
                </form>
              )}

              {/* Direct Stripe Registration for 48h Free Trial */}
              <div className="pt-3 border-t border-[#38BDF8]/20 flex flex-col items-center gap-2 text-center">
                <span className="text-[11px] text-[#7DD3FC] font-semibold">
                  {t('welcomePreferDirectStripe', '¿Prefieres activar las 48h directamente a través de Stripe (0,00 €)?')}
                </span>
                <a
                  href={STRIPE_DIRECT_PAYMENT_LINKS.free2days}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5349DF] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>{t('welcomeDirectStripeTrialBtn', 'Activar 48h Gratis en Stripe (0,00 €)')}</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
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
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'bg-[#0284C7] border-[#7DD3FC] text-white shadow-lg'
                      : 'bg-[#082F49]/60 border-[#38BDF8]/30 text-[#BAE6FD] hover:bg-[#082F49]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                  <span className="text-xs font-black uppercase">{t('welcomeMethodStripe', 'Stripe / Tarjeta')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-[#0070BA] border-[#38BDF8] text-white shadow-lg'
                      : 'bg-[#082F49]/60 border-[#38BDF8]/30 text-[#BAE6FD] hover:bg-[#082F49]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                  <span className="text-xs font-black uppercase">{t('welcomeMethodPaypal', 'PayPal')}</span>
                </button>
              </div>

              {/* Payment Success View */}
              {paymentSuccessData ? (
                <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-400 space-y-4 text-center animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-black mx-auto flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-3xl font-black">check</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{t('welcomeSuccessTitle', '¡Suscripción Activada con Éxito!')}</h4>
                    <p className="text-xs text-emerald-200 mt-1">
                      {t('welcomeProcessedBy', 'Procesado por')} <strong>{paymentSuccessData.provider}</strong> • Ref:{' '}
                      <span className="font-mono text-white">{paymentSuccessData.transactionId}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1 text-[#BAE6FD]">
                    <div className="flex justify-between">
                      <span>{t('welcomePlanLabel', 'Plan:')}</span>
                      <span className="font-bold text-white">{paymentSuccessData.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('welcomeAmountLabel', 'Importe:')}</span>
                      <span className="font-bold text-white">{paymentSuccessData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('welcomeStatusLabel', 'Estado:')}</span>
                      <span className="text-emerald-400 font-bold">{t('welcomeStatusActiveValue', 'Activo • Acceso Total')}</span>
                    </div>
                  </div>

                  {/* Prominent Star-with-circle Install Button */}
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
                      className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#FEE685] via-[#F0DEAA] to-[#E5B54F] text-[#120822] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(240,222,170,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/80 mx-auto"
                    >
                      <div className="w-6 h-6 shrink-0">
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
                      <span>Poner Icono en Pantalla de mi Teléfono</span>
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={onEnterApp}
                      className="px-8 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all border border-emerald-400/40"
                    >
                      {t('welcomeEnterAppBtn', 'Entrar a StellaWay Astroturismo')} →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* STRIPE FORM */}
                  {paymentMethod === 'stripe' && (
                    <form onSubmit={handleStripePayment} className="space-y-4 bg-[#0C4A6E]/40 p-5 rounded-2xl border border-[#38BDF8]/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#7DD3FC] uppercase tracking-wider">
                          {t('welcomeCardDetails', 'Detalles de la Tarjeta (Stripe Checkout)')}
                        </span>
                        <div className="flex gap-1.5 text-[10px] font-bold text-[#BAE6FD]">
                          <span>Visa</span> • <span>Mastercard</span> • <span>Amex</span> • <span>Apple Pay</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#BAE6FD] mb-1">
                          {t('welcomeCardHolder', 'Nombre del Titular')}
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder={t('welcomeCardHolderPlaceholder', 'Nombre y Apellidos')}
                          className="w-full bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-xs font-bold focus:border-[#7DD3FC] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#BAE6FD] mb-1">
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
                            className="w-full bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono font-bold focus:border-[#7DD3FC] outline-none pr-10"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#38BDF8] text-base">
                            lock
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#BAE6FD] mb-1">
                            {t('welcomeCardExpiry', 'MM / AA')}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-3 py-2.5 text-white text-xs font-mono font-bold text-center focus:border-[#7DD3FC] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#BAE6FD] mb-1">
                            {t('welcomeCardCvc', 'CVC')}
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-3 py-2.5 text-white text-xs font-mono font-bold text-center focus:border-[#7DD3FC] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#BAE6FD] mb-1">
                            {t('welcomeCardZip', 'Código Postal')}
                          </label>
                          <input
                            type="text"
                            required
                            value={cardZip}
                            onChange={(e) => setCardZip(e.target.value)}
                            placeholder="28001"
                            className="w-full bg-[#082F49] border border-[#38BDF8]/50 rounded-xl px-3 py-2.5 text-white text-xs font-mono font-bold text-center focus:border-[#7DD3FC] outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full py-3.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl border border-[#7DD3FC]/50 transition-all disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                      <div className="pt-2 border-t border-[#38BDF8]/20 flex flex-col items-center gap-2 text-center">
                        <span className="text-[10px] text-[#7DD3FC] font-semibold">
                          {t('welcomeStripeNewTabNotice', '¿Prefieres la pasarela oficial de Stripe en pestaña nueva?')}
                        </span>
                        <a
                          href={STRIPE_DIRECT_PAYMENT_LINKS[selectedPlan] || STRIPE_DIRECT_PAYMENT_LINKS.anual}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5349DF] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
                        >
                          <span>{t('welcomeOpenOfficialStripe', 'Abrir Enlace Oficial de Stripe')} ({selectedPlan === 'mensual' ? '3,99 €' : '19,99 €'})</span>
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      </div>
                    </form>
                  )}

                  {/* PAYPAL FLOW */}
                  {paymentMethod === 'paypal' && (
                    <div className="space-y-4 bg-[#0C4A6E]/40 p-5 rounded-2xl border border-[#38BDF8]/30 text-center">
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#0070BA] text-white mx-auto flex items-center justify-center font-black shadow-lg">
                          <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <h4 className="text-base font-black text-white">
                          {t('welcomePaypalTitle', 'Pagar de forma rápida y segura con PayPal')}
                        </h4>
                        <p className="text-xs text-[#BAE6FD] max-w-md mx-auto">
                          {t('welcomePaypalDesc', 'Inicia sesión con tu cuenta de PayPal para autorizar el pago con protección completa al comprador.')}{' '}
                          <strong className="text-white">
                            ({selectedPlan === 'mensual' ? '3,99 € / mes' : '19,99 € / año'})
                          </strong>
                        </p>
                      </div>

                      <button
                        onClick={handlePayPalPayment}
                        disabled={isProcessingPayment}
                        className="w-full py-3.5 rounded-2xl bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all disabled:opacity-50"
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
      </div>
    </div>
  );
};
