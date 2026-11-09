/**
 * [ FIRST MODEL HUB - SERVICE WORKER ENGINE ]
 * High-Performance & Self-Healing Cache (Edge-Compliant)
 */

const swUrl = new URL(self.location);
const CURRENT_VERSION = swUrl.searchParams.get('v') || 'v_20261022_24';
const CACHE_NAME = `firstmodelhub-cache-${CURRENT_VERSION}`;

// แคชเฉพาะไฟล์ Asset คงที่พื้นฐาน (ไม่แคช HTML เพื่อให้ข้อมูลสดเสมอ)
const STATIC_ASSETS = [
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
        STATIC_ASSETS.map(url => cache.add(url).catch(err => console.warn(`[SW] Precache skipped: ${url}`)))
      );
    })
  );
});

// ล้างแคชเวอร์ชันเก่าทิ้งทันทีเมื่อมีการอัปเดตเวอร์ชันใหม่
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log(`[SW] Purging old cache: ${key}`);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. ข้าม Supabase API, Analytics และคำขอที่ไม่ใช่ GET
  if (url.origin.includes('supabase.co') || url.origin.includes('googletagmanager.com') || event.request.method !== 'GET') {
    return;
  }

  // 2. ถ้าเป็นเอกสาร HTML (หน้ารายการ, หน้าโปรไฟล์) -> ใช้ Network-First เสมอ
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // 3. รูปภาพจาก Cloudinary -> Cache-First พร้อมอัปเดตเบื้องหลัง
  if (url.origin.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 4. ไฟล์ Static (CSS, JS, Fonts) -> ตัด ignoreSearch ออกเพื่อให้ Query Versioning (?v=...) ทำงานถูกต้อง
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // อัปเดตในพื้นหลัง
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        return new Response('', { status: 408, statusText: 'Network Request Failed' });
      });
    })
  );
});