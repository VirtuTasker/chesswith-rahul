/**
 * ChessWithRahul Service Worker
 * PWA functionality for offline access and performance
 */

const CACHE_NAME = 'chesswithrahul-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/contact.html',
    '/testimonials.html',
    '/faq.html',
    '/css/style.css',
    '/js/main.js',
    '/images/rahul-coach.webp',
    '/images/rahul-coach.jpg',
    '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Google Analytics and external requests
    if (event.request.url.includes('google-analytics') || 
        event.request.url.includes('googletagmanager')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            // Return cached version or fetch from network
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    // Cache new responses
                    if (networkResponse.ok && networkResponse.type === 'basic') {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Network failed, try to return cached fallback
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });

            return cached || fetchPromise;
        })
    );
});

// Push notification support (future)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/images/rahul-coach.jpg',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100],
        data: {
            url: event.data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('ChessWithRahul', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});


