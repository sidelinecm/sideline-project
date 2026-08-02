/**
 * [ FIRST MODEL HUB - SERVICE WORKER ENGINE ]
 * Year: 2026 High-Performance Cache & PWA Manager (Production Ready)
 */

const CACHE_NAME = 'firstmodelhub-v3-2026';
const STATIC_ASSETS = [
  '/',
  '/styles.css',
  '/main.js',
  '/manifest.webmanifest',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png'
];

// 1. ติดตั้ง Service Worker และแคชทรัพยากรหลัก
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // ใช้ Promise.allSettled เพื่อป้องกัน Service Worker พังหากมีรูปใดรูปหนึ่ง 404
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(err => console.warn(`[SW] Failed to cache: ${url}`, err)))
      );
    })
  );
});

// 2. เคลียร์แคชเวอร์ชันเก่าอัตโนมัติเมื่อมีการอัปเดตระบบ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. กลยุทธ์การดึงข้อมูล (Stale-While-Revalidate & Cache First with Offline Fallback)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ข้ามการแคช Supabase API, Edge Functions และ Request ที่ไม่ใช่ GET
  if (url.origin.includes('supabase.co') || event.request.method !== 'GET') {
    return;
  }

  // รูปภาพจาก Cloudinary (Stale-While-Revalidate)
  if (url.origin.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone()); // 🟢 แก้ไข: เพิ่ม .clone()
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // ทรัพยากรอื่นๆ บนโดเมนหลัก
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // อัปเดตแคชในเบื้องหลัง
        fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone())); // 🟢 แก้ไข: เพิ่ม .clone()
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // หากไม่มีในแคช ให้ดึงจากเน็ต
      return fetch(event.request).catch(() => {
        // 🟢 เพิ่มใหม่: ถ้าเน็ตหลุด แล้วกดเปิดหน้า HTML อื่นๆ ให้ดึงหน้าแรก '/' ในแคชออกมาแสดงแทน
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/');
        }
      });
    })
  );
});