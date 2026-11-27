import React, { useState, useEffect } from 'react';
import { ActiveTab, ModalType } from './types';
import { HeaderAndNav } from './components/HeaderAndNav';
import { TopBar } from './components/TopBar';
import { ModalsContainer } from './components/ModalsContainer';
import { DashboardView } from './components/DashboardView';
import { SpotsView } from './components/SpotsView';
import { DarkSkyView } from './components/DarkSkyView';
import { AurorasView } from './components/AurorasView';
import { EventsView } from './components/EventsView';
import { Eclipse2027View } from './components/Eclipse2027View';
import { WeatherView } from './components/WeatherView';
import { ShopView } from './components/ShopView';
import { ProfileView } from './components/ProfileView';
import { WelcomePaywallView } from './components/WelcomePaywallView';
import { StarrySkyBackground } from './components/StarrySkyBackground';
import { LandingPageV2 } from './components/LandingPageV2';
import { InstallPromptModal } from './components/InstallPromptModal';
import { OfflineBanner } from './components/OfflineBanner';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { getLocalizedPlanName } from './lib/i18nHelpers';
import {
  hasAppAccess,
  hasRegisteredAccess,
  isPreviewOrLocalAccess,
  isPwaShortcutLaunch,
  markAppInstalled,
  persistAppAccess,
  shouldSkipLanding,
} from './lib/previewAccess';

const isLocalOrAiStudioPreview = isPreviewOrLocalAccess();

export default function App() {
  const { language } = useLanguage();
  const { user, userProfileData, saveUserProfileData } = useAuth();
  // Once downloaded/installed as PWA or registered, never show landing on startup
  // (direct to 'dashboard' if access active, or 'welcome' if not yet registered).
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'landing') {
        return 'landing';
      }

      if (isPwaShortcutLaunch()) {
        markAppInstalled();
      }

      const isSuccessPayment =
        urlParams.get('pago') === 'exito' ||
        urlParams.get('success') === 'true' ||
        urlParams.get('status') === 'success' ||
        urlParams.has('session_id');

      const requestedTab = urlParams.get('tab') || urlParams.get('view');
      if (requestedTab === 'shop' && hasAppAccess()) {
        return 'shop';
      }

      if (isSuccessPayment) {
        return 'dashboard';
      }

      if (shouldSkipLanding()) {
        return hasAppAccess() ? 'dashboard' : 'welcome';
      }
    }
    return 'landing';
  });

  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(() => [activeTab]);
  const [nightVision, setNightVision] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stellaway_night_vision') === 'true';
    }
    return false;
  });
  const [modalType, setModalType] = useState<ModalType>(null);

  // Sync nightVision state to localStorage and document root classes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stellaway_night_vision', nightVision.toString());
      if (nightVision) {
        document.documentElement.classList.add('night-vision-active');
        document.body.classList.add('night-vision-active');
      } else {
        document.documentElement.classList.remove('night-vision-active');
        document.body.classList.remove('night-vision-active');
      }
    }
  }, [nightVision]);

  // Mobile installation prompt & Post-Payment welcome state
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      return (window as Window & { __stellawayDeferredPrompt?: Event | null }).__stellawayDeferredPrompt || null;
    }
    return null;
  });
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [isAfterPayment, setIsAfterPayment] = useState<boolean>(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stellaway_active_plan');
    }
    return null;
  });
  const activePlanName = activePlanId ? getLocalizedPlanName(activePlanId, language) : undefined;

  useEffect(() => {
    // Listen for PWA install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as Window & { __stellawayDeferredPrompt?: Event | null }).__stellawayDeferredPrompt = e;
      setDeferredInstallPrompt(e);
    };
    const handleAppInstalled = () => {
      (window as Window & { __stellawayDeferredPrompt?: Event | null }).__stellawayDeferredPrompt = null;
      setDeferredInstallPrompt(null);
      markAppInstalled();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') !== 'landing') {
        const nextTab: ActiveTab = hasAppAccess() ? 'dashboard' : 'welcome';
        setActiveTab((prev) => (prev === 'landing' ? nextTab : prev));
        setTabHistory((prev) => (prev.length === 1 && prev[0] === 'landing' ? [nextTab] : prev));
      }
    };
    const standaloneMedia = window.matchMedia?.('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        markAppInstalled();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') !== 'landing') {
          const nextTab: ActiveTab = hasAppAccess() ? 'dashboard' : 'welcome';
          setActiveTab((prev) => (prev === 'landing' ? nextTab : prev));
          setTabHistory((prev) => (prev.length === 1 && prev[0] === 'landing' ? [nextTab] : prev));
        }
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    standaloneMedia?.addEventListener?.('change', handleDisplayModeChange);

    // Listen for custom open-install-modal event from anywhere in the app
    const handleOpenInstall = () => setShowInstallModal(true);
    window.addEventListener('open-install-modal', handleOpenInstall);

    // Check if returning from Stripe payment link or checkout session
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccessPayment =
        urlParams.get('pago') === 'exito' ||
        urlParams.get('success') === 'true' ||
        urlParams.get('status') === 'success' ||
        urlParams.has('session_id');

      if (isSuccessPayment) {
        const planParam = urlParams.get('plan') || 'anual';
        const sessionId = urlParams.get('session_id') || 'stripe_checkout_success';
        const resolvedPlan =
          planParam === 'free2days' || planParam === 'trial_48h'
            ? 'free2days'
            : planParam === 'mensual'
            ? 'mensual'
            : planParam === 'promocion' || planParam === 'promo'
            ? 'promocion'
            : 'anual';

        const trialExpiresAt =
          resolvedPlan === 'free2days' ? Date.now() + 48 * 3600 * 1000 : undefined;

        persistAppAccess({
          planId: resolvedPlan,
          email: localStorage.getItem('stellaway_user_email') || undefined,
          trialExpiresAt,
          provider: 'Stripe Payments',
          transactionId: sessionId,
        });
        setActivePlanId(resolvedPlan);

        if (user) {
          saveUserProfileData({
            subscriptionPlan: resolvedPlan,
            accessActive: true,
            ...(trialExpiresAt ? { trialExpiresAt } : {}),
            paymentProvider: 'Stripe Payments',
          }).catch(() => {});
        }

        if (sessionId && sessionId.startsWith('cs_')) {
          fetch(`/api/stripe-session-details?sessionId=${encodeURIComponent(sessionId)}`)
            .then((r) => r.json())
            .then((info) => {
              if (info?.customerEmail || info?.subscriptionId) {
                persistAppAccess({
                  planId: resolvedPlan,
                  email: info?.customerEmail || localStorage.getItem('stellaway_user_email') || undefined,
                  trialExpiresAt,
                  provider: 'Stripe Payments',
                  transactionId: info?.subscriptionId || sessionId,
                });
              }
            })
            .catch(() => {});
        }

        // Clean Stripe params without losing PWA source marker if present
        const cleanSearch = urlParams.get('source') === 'pwa' ? '?source=pwa' : '';
        window.history.replaceState({}, document.title, window.location.pathname + cleanSearch);

        setActiveTab('dashboard');
        setTabHistory(['dashboard']);
        setIsAfterPayment(true);
        setShowInstallModal(true);
      }
    }

    const handleCancelled = () => {
      setActivePlanId(null);
    };
    window.addEventListener('stellaway-subscription-cancelled', handleCancelled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      standaloneMedia?.removeEventListener?.('change', handleDisplayModeChange);
      window.removeEventListener('open-install-modal', handleOpenInstall);
      window.removeEventListener('stellaway-subscription-cancelled', handleCancelled);
    };
  }, []);

  // Automatically enter dashboard if access is restored while in welcome paywall or landing
  useEffect(() => {
    const syncAccessToView = () => {
      setActivePlanId(localStorage.getItem('stellaway_active_plan'));
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'landing') return;
      }
      if (
        hasRegisteredAccess() &&
        (activeTab === 'welcome' || activeTab === 'landing')
      ) {
        setActiveTab('dashboard');
        setTabHistory(['dashboard']);
      } else if (shouldSkipLanding() && activeTab === 'landing') {
        const nextTab: ActiveTab = hasAppAccess() ? 'dashboard' : 'welcome';
        setActiveTab(nextTab);
        setTabHistory([nextTab]);
      }
    };

    window.addEventListener('stellaway-access-updated', syncAccessToView);
    window.addEventListener('storage', syncAccessToView);
    return () => {
      window.removeEventListener('stellaway-access-updated', syncAccessToView);
      window.removeEventListener('storage', syncAccessToView);
    };
  }, [activeTab]);

  // If Firebase profile restores active subscription on a fresh install/re-download, enter dashboard directly
  useEffect(() => {
    if (!userProfileData) return;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'landing') return;
    }
    if (
      userProfileData.accessActive === true &&
      hasRegisteredAccess() &&
      (activeTab === 'welcome' || activeTab === 'landing')
    ) {
      setActiveTab('dashboard');
      setTabHistory(['dashboard']);
    }
  }, [userProfileData, activeTab]);

  const navigateTo = (newTab: ActiveTab) => {
    // If navigating to landing, always allow
    if (newTab === 'landing') {
      setTabHistory(['landing']);
      setActiveTab('landing');
      return;
    }

    // Check subscription / trial / preview access status
    const hasAccess = hasAppAccess();

    // Once subscribed/trial active, user never sees welcome/paywall page again (in preview they can inspect it)
    if (!isLocalOrAiStudioPreview && hasAccess && newTab === 'welcome') {
      setActiveTab('dashboard');
      setTabHistory(['dashboard']);
      return;
    }

    // Unsubscribed users attempting to access app areas are routed to welcome
    if (!hasAccess && newTab !== 'welcome') {
      setActiveTab('welcome');
      setTabHistory(['welcome']);
      return;
    }

    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    // On the initial welcome/paywall page, if access active go to dashboard; otherwise only return to landing if not installed
    if (activeTab === 'welcome') {
      if (hasAppAccess()) {
        setActiveTab('dashboard');
        setTabHistory(['dashboard']);
      } else if (!shouldSkipLanding()) {
        setActiveTab('landing');
        setTabHistory(['landing']);
      }
      return;
    }

    if (tabHistory.length > 1) {
      const newHist = [...tabHistory];
      newHist.pop(); // Remove current tab
      const prevTab = newHist[newHist.length - 1];

      if (hasAppAccess() && prevTab === 'welcome') {
        setTabHistory(['dashboard']);
        setActiveTab('dashboard');
        return;
      }

      setTabHistory(newHist);
      setActiveTab(prevTab);
    } else {
      setActiveTab('dashboard');
    }
  };

  // Landing page renders standalone (no nav/topbar)
  if (activeTab === 'landing') {
    return (
      <LandingPageV2
        nightVision={nightVision}
        setNightVision={setNightVision}
        onOpenShop={() => {
          if (hasAppAccess()) {
            setTabHistory(['landing', 'dashboard', 'shop']);
            setActiveTab('shop');
          } else {
            setTabHistory(['welcome']);
            setActiveTab('welcome');
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }}
        onEnterApp={() => {
          if (hasAppAccess()) {
            setActiveTab('dashboard');
            setTabHistory(['dashboard']);
          } else {
            setActiveTab('welcome');
            setTabHistory(['welcome']);
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }, 20);
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-all duration-300 ${
        nightVision ? 'night-vision-mode bg-[#0b0202] text-[#FFA3A3]' : ''
      }`}
    >
      {/* 🔴 True Astronomical Red Light Layer for the App: transforms entire UI to monochromatic deep red */}
      {nightVision && (
        <>
          <div
            id="app-night-vision-color-overlay"
            className="astronomical-red-overlay-color"
          />
          <div
            id="app-night-vision-dark-overlay"
            className="astronomical-red-overlay-dark"
          />
        </>
      )}

      {/* Dynamic Cosmic Background with Twinkling Stars & Meteor Streaks */}
      <StarrySkyBackground nightVision={nightVision} />

      {/* Main Drawer / Sidebar & Bottom Mobile Navigation */}
      <HeaderAndNav
        activeTab={activeTab}
        setActiveTab={navigateTo}
        nightVision={nightVision}
        setNightVision={setNightVision}
        onGoBack={handleGoBack}
        openModal={(type) => setModalType(type)}
      />

      {/* Global Modals Container */}
      <ModalsContainer
        modalType={modalType}
        closeModal={() => setModalType(null)}
        setActiveTab={navigateTo}
        openModal={(type) => setModalType(type)}
      />

      {/* Mobile Install Prompt & Post-Payment Welcome Modal */}
      <InstallPromptModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredInstallPrompt}
        isAfterPayment={isAfterPayment}
        planName={activePlanName}
      />

      {/* Active Tab View Rendering */}
      <main className="flex-1 flex flex-col w-full">
        {/* Top Header Bar across all inner pages with Back, Settings, and Menu */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={navigateTo}
          canGoBack={tabHistory.length > 1}
          onGoBack={handleGoBack}
          nightVision={nightVision}
          setNightVision={setNightVision}
          openModal={(type) => setModalType(type)}
        />

        {/* Non-intrusive offline alert banner when disconnected in the field */}
        <OfflineBanner
          onNavigateTab={navigateTo}
          nightVision={nightVision}
        />

        {(!hasAppAccess() || activeTab === 'welcome') && (
          <WelcomePaywallView
            onEnterApp={() => navigateTo('dashboard')}
            onNavigateTab={(tab) => navigateTo(tab)}
            nightVision={nightVision}
            onTriggerInstall={() => setShowInstallModal(true)}
          />
        )}

        {hasAppAccess() && activeTab === 'dashboard' && (
          <DashboardView
            nightVision={nightVision}
            setNightVision={setNightVision}
            onExploreSpots={() => navigateTo('spots')}
            onExploreDarkSky={() => navigateTo('darksky')}
            onExploreAuroras={() => navigateTo('auroras')}
            onExploreEvents={() => navigateTo('events')}
            onExploreEclipse2027={() => navigateTo('eclipse2027')}
            onExploreWeather={() => navigateTo('weather')}
            onExploreShop={() => navigateTo('shop')}
            openModal={(type) => setModalType(type)}
          />
        )}

        {hasAppAccess() && activeTab === 'spots' && (
          <SpotsView
            onGoBack={handleGoBack}
            onGoHome={() => navigateTo('dashboard')}
            onNavigateToWeather={() => navigateTo('weather')}
          />
        )}

        {hasAppAccess() && activeTab === 'darksky' && (
          <DarkSkyView
            onGoBack={handleGoBack}
            onGoHome={() => navigateTo('dashboard')}
          />
        )}

        {hasAppAccess() && activeTab === 'auroras' && (
          <AurorasView
            onGoBack={handleGoBack}
            onGoHome={() => navigateTo('dashboard')}
          />
        )}

        {hasAppAccess() && activeTab === 'events' && <EventsView />}

        {hasAppAccess() && activeTab === 'eclipse2027' && (
          <Eclipse2027View
            onGoBack={handleGoBack}
            onGoHome={() => navigateTo('dashboard')}
            onExploreSpots={() => navigateTo('spots')}
            onExploreWeather={() => navigateTo('weather')}
            onExploreShop={() => navigateTo('shop')}
          />
        )}

        {hasAppAccess() && activeTab === 'weather' && <WeatherView />}

        {hasAppAccess() && activeTab === 'shop' && <ShopView />}

        {hasAppAccess() && activeTab === 'profile' && (
          <ProfileView nightVision={nightVision} setNightVision={setNightVision} />
        )}
      </main>
    </div>
  );
}
