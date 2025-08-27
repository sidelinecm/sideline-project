
// sw.js

// กำหนดชื่อและเวอร์ชันของแคช
// การเปลี่ยนเวอร์ชันจะทำให้ Service Worker ติดตั้งใหม่และแคชไฟล์ล่าสุด
const CACHE_NAME = 'sideline-cm-cache-v2.2'; 

// รายการไฟล์ที่จำเป็นสำหรับ App Shell (โครงสร้างพื้นฐานของเว็บ)
const APP_SHELL_URLS = [
  '/', // แคชหน้าแรก
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
  '/offline.html', // หน้าแสดงผลเมื่อออฟไลน์ (สำคัญมาก)
  '/manifest.webmanifest',
  '/styles.css', // ✅ แก้ไขจาก output.css เป็น styles.css
  '/css/all.min.css',
  '/main.js',
  
  // รูปภาพหลักและไอคอน
  '/images/logo-sideline-chiangmai.webp',
  '/images/placeholder-profile.webp',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png', // เพิ่มไอคอนสำหรับ iOS
  
  // ไอคอนสำหรับ PWA (จาก manifest.webmanifest)
  // ‼️ ตรวจสอบให้แน่ใจว่าคุณได้สร้างโฟลเดอร์ /icons/ และมีไฟล์เหล่านี้อยู่จริง
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',

  // รูปภาพบทความ
  '/images/blog/safety-tips.webp',
  '/images/blog/nimman-guide.webp',
  '/images/blog/guarantee-concept.webp',

  // Web Fonts
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  '/fonts/sarabun-v16-latin_thai-regular.woff2',
  '/fonts/sarabun-v16-latin_thai-700.woff2',
  '/webfonts/fa-brands-400.woff2',
  '/webfonts/fa-regular-400.woff2',
  '/webfonts/fa-solid-900.woff2',
  '/webfonts/fa-v4compatibility.woff2'
];

// Event: install - เกิดขึ้นเมื่อ Service Worker ถูกติดตั้ง
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing Cache Version: ${CACHE_NAME}`);
  
  // รอจนกว่าการแคชไฟล์ App Shell ทั้งหมดจะเสร็จสิ้น
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching App Shell...');
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(error => {
        console.error('[Service Worker] Caching failed:', error);
      })
  );
});

// Event: activate - เกิดขึ้นเมื่อ Service Worker เริ่มทำงาน
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating Cache Version: ${CACHE_NAME}`);
  
  // จัดการแคชเก่าที่ไม่จำเป็นแล้ว
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event: fetch - จัดการกับการร้องขอ (request) ทั้งหมดของหน้าเว็บ
self.addEventListener('fetch', (event) => {
  // ใช้กลยุทธ์ "Cache falling back to network"
  // คือพยายามหาจากแคชก่อน ถ้าไม่เจอก็จะไปโหลดจากเน็ตเวิร์ก
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // ถ้าเจอในแคช, ส่ง response จากแคชกลับไปเลย
        if (response) {
          return response;
        }
        
        // ถ้าไม่เจอในแคช, ให้ไปโหลดจากเน็ตเวิร์ก
        return fetch(event.request).catch(() => {
          // หากการโหลดจากเน็ตเวิร์กล้มเหลว (เช่น ออฟไลน์)
          // ให้แสดงหน้า offline.html แทน
          // เฉพาะกับการร้องขอหน้าเว็บ (navigate) เท่านั้น
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});


