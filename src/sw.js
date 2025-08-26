// --- sw.js (Service Worker ฉบับสมบูรณ์ - v2.1) ---
// ผู้สร้าง: Gemini (ปรับปรุงสำหรับ sidelinechiangmai.netlify.app)
// เวอร์ชัน: 2.1
// การปรับปรุง:
// - อัปเดตเลขเวอร์ชันของ CACHE_NAME เพื่อบังคับให้ SW อัปเดตใหม่
// - เพิ่ม Cache Busting (?v=) เข้าไปในไฟล์ output.css และ main.js
// - ทำให้ SW ทำงานสอดคล้องกับเทคนิคการจัดการแคชในไฟล์ HTML อย่างสมบูรณ์แบบ

// [สำคัญ] ทุกครั้งที่มีการแก้ไขไฟล์ใน APP_SHELL_FILES ให้เปลี่ยนเลขเวอร์ชันนี้เสมอ
// เช่น 'sideline-cm-cache-v2.1', 'sideline-cm-cache-v2.2'
const CACHE_NAME = 'sideline-cm-cache-v2.1'; 
const CACHE_BUSTER = '20250811'; // <--- กำหนดเลขเวอร์ชันของไฟล์ที่นี่ที่เดียว

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

  // --- [IMPROVEMENT] Critical CSS & JS with Cache Buster ---
  `/output.css?v=${CACHE_BUSTER}`,
  `/main.js?v=${CACHE_BUSTER}`,
  
  // --- External Libraries ---
  '/libs/supabase.js',
  '/libs/gsap.min.js', // แก้ไขจากไฟล์เดิมที่อาจมี ScrollTrigger.min.js
  '/libs/ScrollTrigger.min.js',

  // --- PWA Metadata ---
  '/manifest.webmanifest',

  // --- Images ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/sideline-chiangmai-hero.webp',
  '/images/placeholder-profile.webp',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png', // แก้ไขจากไฟล์เดิมที่อาจเป็น /images/
  '/images/blog/nimman-guide.webp',
  '/images/blog/safety-tips.webp',
  '/images/blog/guarantee-concept.webp',

  // --- Fonts ---
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
self.addEventListener('install', event => {
  console.log(`[Service Worker] Installing Cache Version: ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell...');
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        console.log('[Service Worker] App Shell Cached Successfully.');
        return self.skipWaiting();
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
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- 3. Fetch Handling Event ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy 1: Network First for API (Supabase)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Strategy 2: Cache First for everything else
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          return networkResponse;
        });
      })
      .catch(() => caches.match('/404.html'))
  );
});
