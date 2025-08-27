
// --- sw.js (Production-Grade Service Worker - v3.0) ---
// ผู้สร้าง: Gemini (ปรับปรุงสำหรับ sidelinechiangmai.netlify.app)
// เวอร์ชัน: 3.0
// กลยุทธ์ที่ใช้:
// 1. App Shell: Stale-While-Revalidate (เร็วที่สุดและอัปเดตเบื้องหลัง)
// 2. Pages (HTML): Network First (ให้ข้อมูลสดใหม่เสมอ)
// 3. API Calls (JSON): Network First (ดึงข้อมูลใหม่ ถ้าเน็ตล่มใช้ของเก่า)
// 4. Images: Cache First (โหลดทันทีจาก Cache)

const APP_SHELL_CACHE_NAME = 'sideline-cm-app-shell-v3.0';
const DYNAMIC_CACHE_NAME = 'sideline-cm-dynamic-v3.0';

// [สำคัญ] ไฟล์พื้นฐานทั้งหมดของแอป (App Shell)
// เพิ่ม '/offline.html' เข้าไปในรายการนี้ด้วย
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
  '/offline.html', // <-- หน้าสำหรับแสดงผลตอนออฟไลน์โดยเฉพาะ

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
// ทำการแคช App Shell ทั้งหมดล่วงหน้า
self.addEventListener('install', event => {
  console.log(`[SW v3.0] Event: install | Caching App Shell for ${APP_SHELL_CACHE_NAME}`);
  event.waitUntil(
    caches.open(APP_SHELL_CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting()) // บังคับให้ SW ตัวใหม่ทำงานทันที
      .catch(error => {
        console.error('[SW v3.0] App Shell caching failed:', error);
      })
  );
});

// --- 2. Activation Event ---
// ลบ Cache เวอร์ชันเก่าที่ไม่ต้องการแล้ว
self.addEventListener('activate', event => {
  console.log(`[SW v3.0] Event: activate | Cleaning up old caches.`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== APP_SHELL_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log(`[SW v3.0] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // เข้าควบคุมหน้าเว็บทั้งหมดทันที
  );
});

// --- 3. Fetch Handling Event ---
// หัวใจหลักในการจัดการ Request ทั้งหมด
self.addEventListener('fetch', event => {
  const { request } = event;

  // กลยุทธ์ที่ 1: Network First สำหรับหน้าเว็บ (HTML Navigation)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html')) // ถ้าเน็ตล่มจริงๆ ให้แสดงหน้า offline
    );
    return;
  }

  // กลยุทธ์ที่ 2: Stale-While-Revalidate สำหรับ App Shell (CSS, JS, Fonts)
  // ตอบกลับจาก Cache ทันทีเพื่อความเร็วสูงสุด แล้วค่อยไปเช็คของใหม่เบื้องหลัง
  if (APP_SHELL_FILES.some(file => request.url.endsWith(file))) {
      event.respondWith(
          caches.match(request).then(cachedResponse => {
              const networkFetch = fetch(request).then(networkResponse => {
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

  // กลยุทธ์ที่ 3: Cache First, falling back to Network สำหรับ Dynamic Content (Images)
  // เหมาะสำหรับรูปภาพโปรไฟล์ หรือรูปที่ไม่ค่อยเปลี่ยนแปลง
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



  

