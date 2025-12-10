// sw.js

const CACHE_NAME = 'sideline-cm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/images/favicon.ico',
  '/images/placeholder-profile.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // ใช้ Network first strategy สำหรับทุก request
  event.respondWith(
    fetch(event.request).catch(() => {
      // ถ้า network ล้มเหลว, ลองหาจาก cache
      return caches.match(event.request);
    })
  );
});