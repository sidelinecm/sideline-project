const CACHE_NAME = 'sideline-cm-v3-stable';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/offline.html',
  '/images/logo-sidelinechiangmai.webp',
  '/images/favicon.ico'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // ข้าม request ที่ไม่ใช่ http (เช่น chrome-extension://)
  if (!e.request.url.startsWith('http')) return;

  // สำหรับรูปภาพ: Cache First (โหลดเร็วสุด)
  if (e.request.destination === 'image') {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((cachedResponse) => {
          return cachedResponse || fetch(e.request).then((networkResponse) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // สำหรับหน้าเว็บและ API: Network First (เนื้อหาสดใหม่)
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});