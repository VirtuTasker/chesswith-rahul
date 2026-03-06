/**
 * ChessWithRahul Service Worker - Optimized for SEO & Performance
 * Caches critical assets (HTML, CSS, JS, images, videos) for instant load
 * Handles offline fallback to index.html (great for Mumbai users on flaky networks)
 * Version: v2 - Updated for ranking focus (fast LCP, low CLS)
 */

const CACHE_NAME = 'chesswithrahul-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/testimonials.html',
    '/faq.html',
    '/contact.html',
    '/pages/private-chess-lesson-mumbai.html',
    '/pages/chess-classes-beginners-mumbai.html',
    '/pages/chess-tutor-kids-mumbai.html',
    '/pages/chess-rating-coach-mumbai.html',
    '/pages/chess-tournament-training-mumbai.html',
    '/pages/home-chess-tuition-mumbai.html',
    '/pages/chess-coach-andheri-mumbai.html',
    '/pages/chess-coach-bandra-mumbai.html',
    '/pages/chess-coach-malad-mumbai.html',
    '/pages/chess-coach-goregaon-mumbai.html',
    '/pages/chess-coach-borivali-mumbai.html',
    '/pages/chess-coach-kandivali-mumbai.html',
    '/css/style.css',
    '/js/main.js',
    '/images/rahul-chess-coach-mumbai-hero.webp',
    '/images/rahul-personal-chess-coach-mumbai-bio.webp',
    '/images/chess-hero-poster-optimized-mumbai.webp',
    '/videos/chess-coaching-hero-optimized-mumbai.mp4',
    '/videos/chess-coaching-hero-optimized-mumbai.webm',
    '/favicon.ico'
];

// Install - Cache everything critical for first load
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Network-first with cache fallback (SEO-friendly: serves cached content instantly)
self.addEventListener('fetch', event => {
    // Skip non-GET or external requests
    if (event.request.method !== 'GET' || event.request.url.includes('google-analytics')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Cache successful responses
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Offline fallback
                return caches.match(event.request).then(cachedResponse => {
                    return cachedResponse || caches.match('/index.html');
                });
            })
    );
});

// Push notifications (future-ready for engagement)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New chess tip from Rahul!',
        icon: '/images/rahul-chess-coach-mumbai.webp',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100]
    };
    event.waitUntil(self.registration.showNotification('ChessWithRahul', options));
});

