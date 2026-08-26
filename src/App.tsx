import React, { useState, useEffect } from 'react';
import { ActiveTab, ModalType } from './types';
import { HeaderAndNav } from './components/HeaderAndNav';
import { TopBar } from './components/TopBar';
import { ModalsContainer } from './components/ModalsContainer';
import { DashboardView } from './components/DashboardView';
import { SpotsView } from './components/SpotsView';
import { EventsView } from './components/EventsView';
import { WeatherView } from './components/WeatherView';
import { AssistantView } from './components/AssistantView';
import { ProfileView } from './components/ProfileView';
import { WelcomePaywallView } from './components/WelcomePaywallView';
import { StarrySkyBackground } from './components/StarrySkyBackground';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(['welcome']);
  const [nightVision, setNightVision] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  useEffect(() => {
    // Check if user is returning with active subscription
    const isSubscribed = localStorage.getItem('stellaway_subscription_active');
    const trialExpires = localStorage.getItem('stellaway_trial_expires');
    if (isSubscribed === 'true' || (trialExpires && Number(trialExpires) > Date.now())) {
      // Returning active users start on dashboard if they prefer
    }
  }, []);

  const navigateTo = (newTab: ActiveTab) => {
    // Enforce paywall: if user has no subscription or valid trial, stay on welcome
    const isSubscribed = typeof window !== 'undefined' && localStorage.getItem('stellaway_subscription_active') === 'true';
    const savedExpires = typeof window !== 'undefined' ? localStorage.getItem('stellaway_trial_expires') : null;
    const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
    const hasAccess = isSubscribed || isTrialValid;

    if (!hasAccess && newTab !== 'welcome') {
      setActiveTab('welcome');
      return;
    }

    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const newHist = [...tabHistory];
      newHist.pop(); // Remove current tab
      const prevTab = newHist[newHist.length - 1];
      setTabHistory(newHist);
      setActiveTab(prevTab);
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:pl-80 relative transition-all duration-300 ${
        nightVision ? 'night-vision-mode' : ''
      }`}
    >
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
