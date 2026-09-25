import React, { useState, useEffect } from 'react';
import { ActiveTab, ModalType } from './types';
import { HeaderAndNav } from './components/HeaderAndNav';
import { TopBar } from './components/TopBar';
import { ModalsContainer } from './components/ModalsContainer';
import { DashboardView } from './components/DashboardView';
import { SpotsView } from './components/SpotsView';
import { DarkSkyView } from './components/DarkSkyView';
import { EventsView } from './components/EventsView';
import { WeatherView } from './components/WeatherView';
import { AssistantView } from './components/AssistantView';
import { ProfileView } from './components/ProfileView';
import { WelcomePaywallView } from './components/WelcomePaywallView';
import { StarrySkyBackground } from './components/StarrySkyBackground';
import { LandingPage } from './components/LandingPage';
import { InstallPromptModal } from './components/InstallPromptModal';

export default function App() {
  // Check synchronously on initial load to avoid any flash of the landing page
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccessPayment =
        urlParams.get('pago') === 'exito' ||
        urlParams.get('success') === 'true' ||
        urlParams.get('status') === 'success' ||
        urlParams.get('view') === 'app' ||
        urlParams.has('session_id');

      if (isSuccessPayment) {
        return 'dashboard';
      }

      const isSubscribed = localStorage.getItem('stellaway_subscription_active') === 'true';
      const trialExpires = localStorage.getItem('stellaway_trial_expires');
      if (isSubscribed || (trialExpires && Number(trialExpires) > Date.now())) {
        return 'dashboard';
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
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [isAfterPayment, setIsAfterPayment] = useState<boolean>(false);
  const [activePlanName, setActivePlanName] = useState<string>('Pro');

  useEffect(() => {
    // Listen for PWA install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

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
        urlParams.get('view') === 'app' ||
        urlParams.has('session_id');

      if (isSuccessPayment) {
        const planParam = urlParams.get('plan') || 'anual';
        const sessionId = urlParams.get('session_id') || 'stripe_checkout_success';
        
        localStorage.setItem('stellaway_active_plan', planParam);
        localStorage.setItem('stellaway_payment_provider', 'Stripe Payments');
        localStorage.setItem('stellaway_transaction_id', sessionId);

        if (planParam === 'free2days' || planParam === 'trial_48h') {
          // Strict 48h access
          const expiresAt = Date.now() + 48 * 3600 * 1000;
          localStorage.setItem('stellaway_trial_expires', expiresAt.toString());
          localStorage.setItem('stellaway_trial_phone', 'Verificado por Stripe (48h)');
          localStorage.removeItem('stellaway_subscription_active'); // Not lifetime/infinite
          setActivePlanName('Prueba 48 Horas');
        } else {
          localStorage.setItem('stellaway_subscription_active', 'true');
          if (planParam === 'mensual') {
            setActivePlanName('Plan Mensual Pro');
          } else if (planParam === 'promocion' || planParam === 'promo') {
            setActivePlanName('Promoción Especial');
          } else {
            setActivePlanName('Plan Anual Pass');
          }
        }
        
        // Clean URL params without refresh
        window.history.replaceState({}, document.title, window.location.pathname);

        setActiveTab('dashboard');
        setTabHistory(['dashboard']);
        setIsAfterPayment(true);
        setShowInstallModal(true);
        return;
      }
    }

    // Check if user is returning with active subscription
    const isSubscribed = localStorage.getItem('stellaway_subscription_active');
    const trialExpires = localStorage.getItem('stellaway_trial_expires');
    if (isSubscribed === 'true' || (trialExpires && Number(trialExpires) > Date.now())) {
      // Returning active users go directly to dashboard
      setActiveTab('dashboard');
      setTabHistory(['dashboard']);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('open-install-modal', handleOpenInstall);
    };
  }, []);

  const navigateTo = (newTab: ActiveTab) => {
    // If navigating to landing, always allow
    if (newTab === 'landing') {
      setTabHistory(['landing']);
      setActiveTab('landing');
      return;
    }

    // Check subscription / trial status
    const isSubscribed = typeof window !== 'undefined' && localStorage.getItem('stellaway_subscription_active') === 'true';
    const savedExpires = typeof window !== 'undefined' ? localStorage.getItem('stellaway_trial_expires') : null;
    const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
    const hasAccess = isSubscribed || isTrialValid;

    // Once subscribed/trial active, user never sees welcome/paywall page again
    if (hasAccess && newTab === 'welcome') {
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
    // On the initial welcome/paywall page, back button redirects to landing page
    if (activeTab === 'welcome') {
      setActiveTab('landing');
      setTabHistory(['landing']);
      return;
    }

    if (tabHistory.length > 1) {
      const newHist = [...tabHistory];
      newHist.pop(); // Remove current tab
      const prevTab = newHist[newHist.length - 1];

      // If user has subscription and previous in history was welcome or landing, go to dashboard
      const isSubscribed = typeof window !== 'undefined' && localStorage.getItem('stellaway_subscription_active') === 'true';
      const savedExpires = typeof window !== 'undefined' ? localStorage.getItem('stellaway_trial_expires') : null;
      const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
      if ((isSubscribed || isTrialValid) && prevTab === 'welcome') {
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
      <LandingPage
        nightVision={nightVision}
        setNightVision={setNightVision}
        onEnterApp={() => {
          const isSubscribed = typeof window !== 'undefined' && localStorage.getItem('stellaway_subscription_active') === 'true';
          const savedExpires = typeof window !== 'undefined' ? localStorage.getItem('stellaway_trial_expires') : null;
          const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
          
          if (isSubscribed || isTrialValid) {
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
      className={`min-h-screen flex flex-col md:pl-80 relative transition-all duration-300 ${
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
        nightVision={nightVision}
        setNightVision={setNightVision}
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

        {activeTab === 'welcome' && (
          <WelcomePaywallView
            onEnterApp={() => navigateTo('dashboard')}
            onNavigateTab={(tab) => navigateTo(tab)}
            nightVision={nightVision}
            onTriggerInstall={() => setShowInstallModal(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            nightVision={nightVision}
            setNightVision={setNightVision}
            onExploreSpots={() => navigateTo('spots')}
            onExploreEvents={() => navigateTo('events')}
            onExploreWeather={() => navigateTo('weather')}
            openModal={(type) => setModalType(type)}
          />
        )}

        {activeTab === 'spots' && (
          <SpotsView
            onGoBack={handleGoBack}
            onGoHome={() => navigateTo('dashboard')}
          />
        )}

        {activeTab === 'darksky' && (
          <DarkSkyView
            onGoBack={handleGoBack}
            onGoHome={() => navigateTo('dashboard')}
          />
        )}

        {activeTab === 'events' && <EventsView />}

        {activeTab === 'weather' && <WeatherView />}

        {activeTab === 'assistant' && <AssistantView />}

        {activeTab === 'profile' && (
          <ProfileView nightVision={nightVision} setNightVision={setNightVision} />
        )}
      </main>
    </div>
  );
}
