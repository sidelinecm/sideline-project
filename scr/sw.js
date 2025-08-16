// sw.js - Service Worker for SidelineCM - v1.0.0

const CACHE_NAME = 'sidelinecm-cache-v1';
const API_CACHE_NAME = 'sidelinecm-api-cache-v1';

// รายการไฟล์พื้นฐานของแอป (App Shell) ที่ต้องมีเสมอ
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/profiles.html',
  '/about.html',
  '/faq.html',
  '/blog.html',
  '/locations.html',
  '/privacy-policy.html',
  '/404.html',
  '/output.css',
  '/js/main.js',
  '/manifest.webmanifest',
  '/images/logo-sideline-chiangmai.webp',
  '/images/sideline-chiangmai-hero.webp',
  '/images/placeholder-profile.webp',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Event: Install - ติดตั้ง Service Worker และ Cache ไฟล์พื้นฐาน
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()) // Activate a new service worker immediately
  );
});

// Event: Activate - ลบ Cache เวอร์ชันเก่าที่ไม่จำเป็นออก
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Event: Fetch - จัดการกับทุก Request ที่เกิดขึ้น
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // กลยุทธ์ที่ 1: Stale-While-Revalidate สำหรับ API (Supabase)
  // - ตอบกลับจาก Cache ทันที (ถ้ามี) เพื่อความเร็ว
  // - จากนั้นไปดึงข้อมูลใหม่จาก Network มาอัปเดต Cache ไว้สำหรับครั้งต่อไป
  if (url.origin === 'https://hgzbgpbmymoiwjpaypvl.supabase.co') {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        })
      })
    );
    return;
  }

  // กลยุทธ์ที่ 2: Cache First สำหรับไฟล์ App Shell และรูปภาพ
  // - ถ้าเจอใน Cache ให้ใช้จาก Cache เลย
  // - ถ้าไม่เจอ ค่อยไปโหลดจาก Network แล้วเก็บลง Cache
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(networkResponse => {
        // Cache รูปภาพที่โหลดมาใหม่
        if (request.destination === 'image') {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    })
  );
});