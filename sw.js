const CACHE_NAME = 'silos-u7-v35'; 
const urlsToCache = [ './', './index.html', './manifest.json' ];

self.addEventListener('install', event => {
    self.skipWaiting();
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
