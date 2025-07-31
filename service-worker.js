const CACHE_NAME = 'my-canvas-game-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // Assuming you have a style.css
  '/game.js',   // Assuming your main game logic is in game.js
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  // Add all other essential game assets here:
  // '/images/background.png',
  // '/sounds/jump.mp3',
  // '/data/levels.json',
  // etc.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Return cached asset
        }
        return fetch(event.request); // Fetch from network
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
