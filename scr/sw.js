// Service Worker เวอร์ชันสมบูรณ์แบบ
const CACHE_NAME = 'sideline-cache-v1'; // เปลี่ยนเวอร์ชันนี้เมื่อคุณอัปเดตไฟล์สำคัญ (เช่น CSS, JS)
const urlsToCache = [
  // --- App Shell ---
  '/',
  '/index.html',
  '/output.css',
  '/main.js',
  '/manifest.webmanifest',
  // --- Critical Images & Fonts ---
  '/images/placeholder-profile.webp',
  '/images/logo-sideline-chiangmai.webp',
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  // --- PWA Icons ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('supabase.co')) {
    // สำหรับ Supabase, ใช้ Network First เพื่อให้ข้อมูลสดใหม่เสมอ
    event.respondWith(
        fetch(event.request).catch(() => {
            // ถ้า network ล่ม, ลองหาจาก cache (ถ้ามี)
            return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // ถ้ามีใน cache ให้ส่งกลับไปเลย
      if (response) {
        return response;
      }
      // ถ้าไม่มี ให้ไปดึงจาก network แล้วเพิ่มลง cache ด้วย
      return fetch(event.request).then(
        (networkResponse) => {
          if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Clone response เพราะ response ใช้ได้ครั้งเดียว
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return networkResponse;
        }
      );
    })
  );
});
