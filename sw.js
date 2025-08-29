
// sw.js - FINAL & OPTIMIZED VERSION

// --- Configuration ---
const APP_CACHE_NAME = 'sideline-cm-app-shell-v2';    // แคชสำหรับไฟล์หลักของแอป
const IMMUTABLE_CACHE_NAME = 'sideline-cm-assets-v2'; // แคชสำหรับไฟล์ที่ไม่ค่อยเปลี่ยน

// รายการไฟล์ App Shell ที่เป็นโครงสร้างหลักและอาจเปลี่ยนบ่อย
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/profiles.html',
  '/locations.html',
  '/about.html',
  '/faq.html',
  '/blog.html',
  '/blog/safety-tips.html',
  '/blog/nimman-feel-fan-guide.html',
  '/blog/what-is-trong-pok.html',
  '/privacy-policy.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/css/all.min.css', // ✅ ไฟล์ไอคอน
  '/styles.css',      // ✅ ไฟล์สไตล์หลัก
  '/main.js'
];

// รายการไฟล์ที่ไม่ค่อยเปลี่ยนแปลง (ฟอนต์, รูปภาพหลัก)
const IMMUTABLE_URLS = [
  // รูปภาพหลักและไอคอน
  '/images/logo-sideline-chiangmai.webp',
  '/images/placeholder-profile.webp',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png',
  // ไอคอน PWA
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  // รูปภาพบทความ
  '/images/blog/safety-tips.webp',
  '/images/blog/nimman-guide.webp',
  '/images/blog/guarantee-concept.webp',
  // ฟอนต์ภาษาไทย
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  '/fonts/sarabun-v16-latin_thai-regular.woff2',
  '/fonts/sarabun-v16-latin_thai-700.woff2',
  // ฟอนต์ไอคอน (Font Awesome) - ✅ ใช้ Path ที่ถูกต้อง
  '/webfonts/fa-brands-400.woff2',
  '/webfonts/fa-regular-400.woff2',
  '/webfonts/fa-solid-900.woff2',
  '/webfonts/fa-v4compatibility.woff2'
];

// --- Service Worker Lifecycle ---

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event');
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS)),
      caches.open(IMMUTABLE_CACHE_NAME).then((cache) => cache.addAll(IMMUTABLE_URLS))
    ]).catch(error => {
      console.error('[Service Worker] Caching failed during install:', error);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(name => name !== APP_CACHE_NAME && name !== IMMUTABLE_CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});



