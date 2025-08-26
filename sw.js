// --- sw.js (Service Worker ฉบับสมบูรณ์ - v2.3) ---
// ผู้สร้าง: Gemini (ปรับปรุงสำหรับ sidelinechiangmai.netlify.app)
// เวอร์ชัน: 2.3
// การปรับปรุง:
// - อัปเดตเลขเวอร์ชันของ CACHE_NAME เพื่อบังคับให้ SW อัปเดตใหม่
// - เพิ่ม Cache Busting (?v=) เข้าไปในไฟล์ output.css และ main.js
// - ทำให้ SW ทำงานสอดคล้องกับเทคนิคการจัดการแคชในไฟล์ HTML อย่างสมบูรณ์แบบ

// [สำคัญ] ทุกครั้งที่มีการแก้ไขไฟล์ใน APP_SHELL_FILES ให้เปลี่ยนเลขเวอร์ชันนี้เสมอ
// เช่น 'sideline-cm-cache-v2.3', 'sideline-cm-cache-v2.4'
const CACHE_NAME = 'sideline-cm-cache-v2.3'; 
const CACHE_BUSTER = '20250800'; // <--- กำหนดเลขเวอร์ชันของไฟล์ที่นี่ที่เดียว

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

  // --- Critical CSS & JS ---
  '/styles.css', // <-- แก้ไขจาก output.css
  '/main.js',
  '/css/all.min.css', // <-- เพิ่มไฟล์ FontAwesome

  // --- PWA Metadata ---
  '/manifest.webmanifest',

  // --- Images ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/placeholder-profile.webp',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png',
  '/images/blog/nimman-guide.webp',
  '/images/blog/safety-tips.webp',
  '/images/blog/guarantee-concept.webp',

  // --- Fonts ---
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  '/webfonts/fa-solid-900.woff2',
  '/webfonts/fa-brands-400.woff2',
  
  // --- PWA Icons ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];


// --- 1. Installation Event ---
self.addEventListener('install', event => {
  console.log(`[Service Worker] Installing Cache Version: ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell...');
        // ใช้ { cache: 'reload' } เพื่อให้แน่ใจว่าโหลดไฟล์ใหม่จากเซิร์ฟเวอร์เสมอ
        const requests = APP_SHELL_FILES.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
      .then(() => {
        console.log('[Service Worker] App Shell Cached Successfully.');
        return self.skipWaiting(); // <-- บังคับให้ SW ตัวใหม่ทำงานทันที
      })
      .catch(error => {
        console.error('[Service Worker] Caching failed:', error);
      })
  );
});

// --- 2. Activation Event ---
self.addEventListener('activate', event => {
  console.log(`[Service Worker] Activating Cache Version: ${CACHE_NAME}`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName); // <-- ลบ Cache เก่าทั้งหมด
          }
        })
      );
    }).then(() => self.clients.claim()) // <-- เข้าควบคุมหน้าเว็บทั้งหมดทันที
  );
});

// --- 3. Fetch Handling Event ---
self.addEventListener('fetch', event => {
    // ใช้ Network First strategy สำหรับ HTML เพื่อให้ได้หน้าเว็บใหม่เสมอ
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/404.html'))
        );
        return;
    }

    // ใช้ Cache First strategy สำหรับไฟล์อื่นๆ ทั้งหมด
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).then(networkResponse => {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            });
        })
    );
});
