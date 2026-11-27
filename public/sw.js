const CACHE_NAME = 'stellaway-__BUILD_ID__';
const STATIC_ASSETS = [
  '/',
  '/?source=pwa',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png'
];

// Install event - fetch fresh copies (bypassing HTTP cache) and precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          fetch(new Request(url, { cache: 'reload' }))
            .then((response) => {
              if (response && response.ok) {
                return cache.put(url, response);
              }
            })
            .catch(() => undefined)
        )
      );
    })
  );
  self.skipWaiting();
});

// Allow client to trigger immediate activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - cleanup all previous deployment caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Always network-fresh for HTML/manifest/version; offline fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip chrome-extension/non-http
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Never intercept or cache live version checks
  if (requestUrl.pathname === '/version.json') {
    event.respondWith(fetch(event.request.url, { cache: 'no-store' }));
    return;
  }

  // API calls: network first, optional cache fallback when offline
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Navigation requests (HTML shell), manifest.json, and sw.js must always hit network fresh (no-store)
  const isAppShellFile =
    event.request.mode === 'navigate' ||
    requestUrl.pathname === '/' ||
    requestUrl.pathname === '/index.html' ||
    requestUrl.pathname === '/manifest.json';

  if (isAppShellFile) {
    event.respondWith(
      fetch(event.request.url, { cache: 'no-store', credentials: 'same-origin' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html').then((indexFallback) => indexFallback || caches.match('/'));
            }
          });
        })
    );
    return;
  }

  // Static assets (JS/CSS bundles with hashes, images, fonts): Network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
