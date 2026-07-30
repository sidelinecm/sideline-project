/**
 * [ FIRST MODEL HUB - SERVICE WORKER ENGINE ]
 * Year: 2026 High-Performance Cache & PWA Manager
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

// ติดตั้ง Service Worker และแคชทรัพยากรหลัก
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// เคลียร์แคชเวอร์ชันเก่าอัตโนมัติเมื่อมีการอัปเดตระบบ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// กลยุทธ์การดึงข้อมูล (Stale-While-Revalidate สำหรับรูป Cloudinary และ Network-First สำหรับข้อมูล)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ข้ามการแคช Supabase API & Edge Functions เพื่อให้ได้ข้อมูลสดเสมอ
  if (url.origin.includes('supabase.co') || event.request.method !== 'GET') {
    return;
  }

  // รูปภาพจาก Cloudinary ให้ใช้แคชก่อน แต่แอบอัปเดตเบื้องหลัง (Stale-While-Revalidate)
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

  // ทรัพยากรอื่นๆ บนโดเมนหลัก
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});