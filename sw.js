// Service Worker for My Learning Progress

const CACHE_NAME = 'learning-progress-cache-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/github-api.js',
    '/js/utils.js',
    '/js/animations.js',
    '/js/components.js',
    '/js/config.js'
];

self.addEventListener('install', event => {
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
        caches.keys().then(keys => Promise.all(keys.map(key => {
            if (!cacheWhitelist.includes(key)) {
                return caches.delete(key);
            }
        })))
    );
});
