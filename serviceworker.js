const CACHE_NAME = 'v1';
const CACHE_ASSETS = [
    './',
    './index.html',
    './style.css', // Adicione seu arquivo CSS
    './script.js', // Adicione seu arquivo JS
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
];

// Instala o service worker e faz o cache dos arquivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(CACHE_ASSETS);
            })
    );
});

// Ativa o service worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cache removido:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepta requisições e responde com cache, se disponível
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

