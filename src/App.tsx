import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(['dashboard']);
  const [nightVision, setNightVision] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const navigateTo = (newTab: ActiveTab) => {
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
      {/* Dynamic Cosmic Background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-[#2D1B4E]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% -20%, #4f3d72 0%, #2D1B4E 75%)',
        }}
      />

      {/* Main Drawer / Sidebar & Bottom Mobile Navigation */}
      <HeaderAndNav
        activeTab={activeTab}
        setActiveTab={navigateTo}
        nightVision={nightVision}
        setNightVision={setNightVision}
        onGoBack={handleGoBack}
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
        {/* Top Header Bar across all pages with Back, Home, Settings, and Menu */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={navigateTo}
          canGoBack={tabHistory.length > 1}
          onGoBack={handleGoBack}
          nightVision={nightVision}
          setNightVision={setNightVision}
          openModal={(type) => setModalType(type)}
        />

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
