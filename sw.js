const CACHE_NAME = 'silos-u7-v25'; // Versión 25
const urlsToCache = [ './', './index.html', './manifest.json' ];

self.addEventListener('install', event => {
    // No forzamos skipWaiting() automático para que la app pueda avisar antes de actualizar
    event.waitUntil( 
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(urlsToCache.map(url => cache.add(url).catch(() => console.log('Falló cache de: ' + url))));
        }) 
    );
});

self.addEventListener('fetch', event => {
    event.respondWith( 
        caches.match(event.request).then(response => response || fetch(event.request)) 
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Escuchar mensaje para actualizar
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
