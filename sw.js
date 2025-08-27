
// --- sw.js (Production-Grade Service Worker - v3.1) ---
// ผู้สร้าง: Gemini (ปรับปรุงสำหรับ sidelinechiangmai.netlify.app)
// เวอร์ชัน: 3.1
// กลยุทธ์ที่ใช้:
// 1. API Calls (Supabase): Network First, falling back to Cache (ข้อมูลสดใหม่เสมอ, ออฟไลน์ได้)
// 2. Pages (HTML Navigation): Network First, falling back to Offline Page (ให้หน้าเว็บสดใหม่, เน็ตล่มมีหน้าสำรอง)
// 3. App Shell (CSS, JS, Fonts): Stale-While-Revalidate (เร็วที่สุด, อัปเดตเบื้องหลัง)
// 4. Images & Others: Cache First, falling back to Network (โหลดรูปทันทีจาก Cache)

const APP_SHELL_CACHE_NAME = 'sideline-cm-app-shell-v3.1';
const DYNAMIC_CACHE_NAME = 'sideline-cm-dynamic-v3.1';
const API_CACHE_NAME = 'sideline-cm-api-v3.1';

// [สำคัญ] ไฟล์พื้นฐานทั้งหมดของแอป (App Shell)
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/about.html',
  '/faq.html',
  '/locations.html',
  '/blog.html',
  '/profiles.html',
  '/privacy-policy.html',
  '/404.html',
  '/offline.html', // หน้าสำหรับแสดงผลตอนออฟไลน์โดยเฉพาะ

  // --- Blog Post Pages ---
  '/blog/nimman-feel-fan-guide.html',
  '/blog/safety-tips.html',
  '/blog/what-is-trong-pok.html',

  // --- Critical CSS & JS ---
  '/styles.css',
  '/main.js',
  '/css/all.min.css',

  // --- PWA Metadata ---
  '/manifest.webmanifest',

  // --- Images (เฉพาะที่ใช้ใน UI หลัก) ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/placeholder-profile.webp',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png',

  // --- Fonts (ไฟล์ทั้งหมดที่ใช้งาน) ---
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  '/fonts/sarabun-v16-latin_thai-regular.woff2',
  '/fonts/sarabun-v16-latin_thai-700.woff2',
  '/webfonts/fa-solid-900.woff2',
  '/webfonts/fa-brands-400.woff2',
  
  // --- PWA Icons ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];

// --- 1. Installation Event ---
self.addEventListener('install', event => {
  console.log(`[SW v3.1] Event: install | Caching App Shell for ${APP_SHELL_CACHE_NAME}`);
  event.waitUntil(
    caches.open(APP_SHELL_CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('[SW v3.1] App Shell caching failed:', error);
      })
  );
});

// --- 2. Activation Event ---
self.addEventListener('activate', event => {
  console.log(`[SW v3.1] Event: activate | Cleaning up old caches.`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ลบ Cache ทั้งหมดที่ไม่ตรงกับเวอร์ชันปัจจุบัน
          if (cacheName !== APP_SHELL_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log(`[SW v3.1] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- 3. Fetch Handling Event ---
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // กลยุทธ์ที่ 1: Network First สำหรับ API Calls (Supabase)
  if (url.origin === 'https://hgzbgpbmymoiwjpaypvl.supabase.co') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // ถ้าสำเร็จ, แคช Response ที่ได้มาใหม่
          return caches.open(API_CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // ถ้า Network ล่ม, ดึงจาก Cache แทน
          return caches.match(request);
        })
    );
    return;
  }

  // กลยุทธ์ที่ 2: Stale-While-Revalidate สำหรับ App Shell (CSS, JS, Fonts, Core UI)
  // ใช้ pathname ในการเช็คเพื่อความแม่นยำ
  if (APP_SHELL_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        // ตอบกลับจาก Cache ทันที
        const networkFetch = fetch(request).then(networkResponse => {
          // แล้วค่อยอัปเดต Cache เบื้องหลัง
          caches.open(APP_SHELL_CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        });
        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // กลยุทธ์ที่ 3: Network First สำหรับหน้าเว็บ (HTML Navigation)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html')) // ถ้าเน็ตล่ม ให้ไปหน้า offline
    );
    return;
  }

  // กลยุทธ์ที่ 4: Cache First สำหรับ Requests อื่นๆ (ส่วนใหญ่คือ Images)
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request).then(networkResponse => {
        // เมื่อโหลดมาใหม่ ก็เก็บลงใน Dynamic Cache
        return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});



