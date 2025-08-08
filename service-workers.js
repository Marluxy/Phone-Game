// A name for our cache
const CACHE_NAME = 'whack-a-mole-v1';

// The list of files we want to cache
const urlsToCache = [
  '/',
  './index.html', // Or whatever your main HTML file is named
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

// Install event: opens the cache and adds our files to it
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Failed to cache', error);
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serves assets from cache if available, otherwise fetches from network
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we found a match in the cache, return it
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the network
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Error in fetch handler:', error);
        // You could return a fallback page here if you wanted
      })
  );
});

