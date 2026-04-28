const CACHE = 'lostfind-v1';
const FILES = [
  '/', '/index.html', '/browse.html', '/report.html',
  '/map.html', '/auth.html', '/profile.html',
  '/notifications.html', '/qr.html', '/admin.html',
  '/css/style.css', '/js/data.js', '/js/ui.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});