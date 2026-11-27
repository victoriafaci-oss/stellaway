import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
);

// Capture beforeinstallprompt early in case browser fires it before React mounts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    (window as Window & { __stellawayDeferredPrompt?: Event | null }).__stellawayDeferredPrompt = e;
  });
  window.addEventListener('appinstalled', () => {
    (window as Window & { __stellawayDeferredPrompt?: Event | null }).__stellawayDeferredPrompt = null;
  });
}

// Register Service Worker for PWA home screen installation
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('StellaWay ServiceWorker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('StellaWay ServiceWorker registration failed:', err);
      });
  });
}


