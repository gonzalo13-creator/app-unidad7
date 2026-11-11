const CACHE_NAME = 'silos-u7-v78';
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
    const accept = event.request.headers.get('accept') || '';
    const esNavegacion = event.request.mode === 'navigate' || (event.request.method === 'GET' && accept.includes('text/html'));
    if (esNavegacion) {
        event.respondWith(
            fetch(event.request).then(response => {
                let responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                return response;
            }).catch(() => {
                return caches.match(event.request).then(r => r || caches.match('./index.html'));
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(response => response || fetch(event.request))
        );
    }
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

self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
