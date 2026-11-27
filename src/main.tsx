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

// Register Service Worker with zero HTTP caching and automatic OTA updates
const isPaymentReturnUrl = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get('pago') === 'exito' ||
    params.get('success') === 'true' ||
    params.get('status') === 'success' ||
    params.has('session_id')
  );
};

const safeReloadForUpdate = (buildIdTag?: string) => {
  if (typeof window === 'undefined' || isPaymentReturnUrl()) return;
  try {
    const now = Date.now();
    const lastReload = Number(sessionStorage.getItem('stellaway_last_ota_reload') || '0');
    if (now - lastReload < 15000) return;
    if (buildIdTag && sessionStorage.getItem('stellaway_reloaded_build') === buildIdTag) return;

    sessionStorage.setItem('stellaway_last_ota_reload', String(now));
    if (buildIdTag) {
      sessionStorage.setItem('stellaway_reloaded_build', buildIdTag);
    }
  } catch {
    // Ignore storage errors in private mode
  }
  window.location.reload();
};

const currentBuildId = typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev';
let lastVersionCheckAt = 0;

const checkRemoteBuildVersion = async (swRegistration?: ServiceWorkerRegistration | null) => {
  if (typeof window === 'undefined' || !navigator.onLine) return;
  const now = Date.now();
  if (now - lastVersionCheckAt < 20000) return;
  lastVersionCheckAt = now;

  if (swRegistration) {
    swRegistration.update().catch(() => {});
  }

  if (currentBuildId === 'dev') return;

  try {
    const res = await fetch(`/version.json?t=${now}`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as { buildId?: string };
    if (data?.buildId && data.buildId !== currentBuildId) {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.startsWith('stellaway-')).map((k) => caches.delete(k)));
      }
      safeReloadForUpdate(data.buildId);
    }
  } catch {
    // Offline or transient network error; stay silently on cached app
  }
};

if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    let activeReg: ServiceWorkerRegistration | null = null;
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing || currentBuildId === 'dev') return;
      refreshing = true;
      safeReloadForUpdate();
    });

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        activeReg = reg;
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        checkRemoteBuildVersion(reg);
      })
      .catch((err) => {
        console.warn('StellaWay ServiceWorker registration failed:', err);
      });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkRemoteBuildVersion(activeReg);
      }
    });
    window.addEventListener('focus', () => checkRemoteBuildVersion(activeReg));
    window.addEventListener('online', () => checkRemoteBuildVersion(activeReg));
  });
}


