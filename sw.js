const CACHE_NAME = 'lostfind-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/browse.html',
  '/report.html',
  '/map.html',
  '/auth.html',
  '/profile.html',
  '/notifications.html',
  '/qr.html',
  '/admin.html',
  '/css/style.css',
  '/js/data.js',
  '/js/ui.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});