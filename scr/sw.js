// --- sw.js (Service Worker ฉบับสมบูรณ์) ---

// v1.3: เพิ่มหน้าบทความย่อยและรูปภาพประกอบ, เพิ่มฟอนต์ทั้งหมด
const CACHE_NAME = 'sideline-cm-cache-v1.3';

// รายการไฟล์ทั้งหมดที่จำเป็นสำหรับ App Shell เพื่อให้เว็บทำงานแบบออฟไลน์ได้
const APP_SHELL_FILES = [
  // --- Core App Shell Files ---
  '/',
  '/index.html',
  '/about.html',
  '/faq.html',
  '/locations.html',
  '/blog.html',
  '/profiles.html',
  '/privacy-policy.html',
  '/404.html',

  // --- Blog Post Pages ---
  '/blog/nimman-feel-fan-guide.html',
  '/blog/safety-tips.html',
  '/blog/what-is-trong-pok.html',

  // --- Critical Assets ---
  '/output.css',
  '/main.js',

  // --- PWA Metadata ---
  '/manifest.webmanifest',

  // --- Critical Images ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/placeholder-profile.webp',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png',
  '/images/blog/nimman-guide.webp',
  '/images/blog/safety-tips.webp',
  '/images/blog/guarantee-concept.webp',

  // --- Fonts (ครบทุกไฟล์) ---
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-500.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  '/fonts/prompt-v11-latin_thai-800.woff2',
  '/fonts/sarabun-v16-latin_thai-regular.woff2',
  '/fonts/sarabun-v16-latin_thai-700.woff2',

  // --- PWA Icons ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];

// --- 1. Installation Event ---
// เมื่อ Service Worker ถูกติดตั้ง จะทำการเปิด Cache และเพิ่มไฟล์ทั้งหมดใน APP_SHELL_FILES
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell...');
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        console.log('[Service Worker] App Shell Cached Successfully.');
        // บังคับให้ Service Worker ตัวใหม่ทำงานทันที ไม่ต้องรอ
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Caching failed:', error);
      })
  );
});

// --- 2. Activation Event ---
// เมื่อ Service Worker พร้อมใช้งาน จะทำการลบ Cache เก่าที่ไม่ต้องการแล้ว
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ถ้าชื่อ Cache ไม่ตรงกับเวอร์ชันปัจจุบัน ให้ลบทิ้ง
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        // ทำให้ Service Worker ตัวใหม่สามารถควบคุมหน้าเว็บที่เปิดค้างอยู่ได้ทันที
        return self.clients.claim();
    })
  );
});

// --- 3. Fetch Handling Event ---
// ดักจับทุก request ที่ออกจากหน้าเว็บเพื่อจัดการ Caching
self.addEventListener('fetch', event => {
  // ไม่ต้องจัดการกับ request ที่ไม่ใช่ GET (เช่น POST, PUT)
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // กลยุทธ์ที่ 1: Network First for API requests (Supabase)
  // พยายามดึงข้อมูลใหม่จากเน็ตเวิร์กก่อนเสมอ, ถ้าล้มเหลวจึงใช้ข้อมูลเก่าจาก Cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Clone response เพื่อนำไปเก็บใน Cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // หาก fetch ล้มเหลว (เช่น offline) ให้ลองหาจาก Cache
          console.warn(`[Service Worker] Network request for ${event.request.url} failed, falling back to cache.`);
          return caches.match(event.request);
        })
    );
    return;
  }

  // กลยุทธ์ที่ 2: Cache First for App Shell Assets
  // สำหรับไฟล์หลักของเว็บ ให้ลองหาจาก Cache ก่อนเสมอเพื่อความเร็วสูงสุด
  // ถ้าไม่มีใน Cache จึงค่อยไปดึงจาก Network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // ถ้ามีใน Cache ให้ส่งกลับไปเลย
        if (cachedResponse) {
          return cachedResponse;
        }

        // ถ้าไม่มี, ให้ไปดึงจาก Network
        return fetch(event.request).then(
          (networkResponse) => {
            // ตรวจสอบว่า Response ที่ได้มานั้นถูกต้องและสามารถ Cache ได้หรือไม่
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone response และนำไปเก็บใน Cache สำหรับการใช้งานครั้งต่อไป
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          }
        );
      })
      .catch(() => {
        // หากเกิดข้อผิดพลาดในการ fetch และไม่มีใน cache เลย (เช่น เข้าเว็บครั้งแรกแบบออฟไลน์)
        // ให้ส่งหน้า 404.html ที่เรา Cache ไว้กลับไป
        console.warn('[Service Worker] Fetch failed, falling back to offline page.');
        return caches.match('/404.html');
      })
  );
});