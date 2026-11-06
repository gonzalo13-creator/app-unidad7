const CACHE_NAME = 'silos-u7-v10'; // <--- Versión 10 para forzar limpieza total
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn-icons-png.flaticon.com/512/3094/3094916.png'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Fuerza la instalación inmediata sin esperar
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Borra las versiones viejas
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma el control de la pantalla
    );
});