/**
 * [ FIRST MODEL HUB - SERVICE WORKER ENGINE ]
 * High-Performance & Self-Healing Cache (Bug-Free Edition)
 */

const swUrl = new URL(self.location);
const CURRENT_VERSION = swUrl.searchParams.get('v') || 'v_20261023_01';
const CACHE_NAME = `firstmodelhub-cache-${CURRENT_VERSION}`;

// 🟢 แคชเฉพาะไฟล์ Asset คงที่เท่านั้น (ห้ามแคชหน้า HTML เด็ดขาด เพื่อให้ข้อมูลสดใหม่ตลอดเวลา)
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

// 🟢 ลบแคชเวอร์ชันเก่าทิ้งทันทีเมื่อมีเวอร์ชันใหม่
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

  // 1. ข้าม API Supabase, Google Analytics และคำขอที่ไม่ใช่ GET
  if (url.origin.includes('supabase.co') || url.origin.includes('googletagmanager.com') || event.request.method !== 'GET') {
    return;
  }

  // 2. ถ้าเป็นคำขอหน้าเว็บ (HTML Document) ให้ดึงสดจาก Network ก่อนเสมอ (Network-First)
  // เพื่อให้หน้าแรกและหน้ารายจังหวัดแสดงข้อมูลโปรไฟล์สดใหม่จาก SSR เสมอ
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // 3. รูปภาพจาก Cloudinary (Cache-First + Background Refresh)
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

  // 4. ไฟล์ Static (CSS, JS, Fonts) - ดึงจากแคช หรือโหลดจากเน็ต ปลอดภัยไม่คืนค่า undefined
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
      if (cachedResponse) {
        // อัปเดตแคชเบื้องหลัง
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // 🛡️ ป้องกัน Error สแตก: ถ้าเน็ตหลุด ให้ส่ง Response ว่าง 408 แทนการส่ง undefined
      return fetch(event.request).catch(() => {
        return new Response('', { status: 408, statusText: 'Network Request Failed' });
      });
    })
  );
});