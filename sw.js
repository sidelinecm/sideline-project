/**
 * [ FIRST MODEL HUB - SERVICE WORKER ENGINE ]
 * Auto-Sync Version & High-Performance Cache (Production Ready)
 */

// 🟢 1. ดึงเลขเวอร์ชันจาก URL อัตโนมัติ (เช่น เรียกผ่าน /sw.js?v=v_20261022_03)
const swUrl = new URL(self.location);
const CURRENT_VERSION = swUrl.searchParams.get('v') || 'v_20261020_01';
const CACHE_NAME = `firstmodelhub-fx-${CURRENT_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/styles.css',
  '/main.js',
  '/manifest.webmanifest',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png',
  '/offline.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(err => console.warn(`[SW] Failed to cache: ${url}`, err)))
      );
    })
  );
});

// 🟢 2. เมื่อมีเวอร์ชันใหม่ ลบแคชเวอร์ชันเก่าทิ้งทันทีอัตโนมัติ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log(`[SW] ลบแคชเก่าออก: ${key}`);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ข้าม API Supabase และคำขอที่ไม่ใช่ GET
  if (url.origin.includes('supabase.co') || event.request.method !== 'GET') {
    return;
  }

  // รูปภาพจาก Cloudinary
  if (url.origin.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 🟢 3. ใส่ { ignoreSearch: true } เพื่อให้ styles.css?v=... ดึงแคช styles.css ได้ถูกต้อง
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
      if (cachedResponse) {
        fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/offline.html') || caches.match('/');
        }
      });
    })
  );
});