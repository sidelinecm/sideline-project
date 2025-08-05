// service-worker.js

// กำหนดชื่อ Cache ที่ใช้สำหรับเก็บทรัพยากร
// ควรเปลี่ยนเวอร์ชัน (เช่น v1.3) ทุกครั้งที่มีการอัปเดตไฟล์สำคัญ (เช่น CSS, JS, Fonts)
// เพื่อให้ Service Worker จัดการกับ cache เก่าได้อย่างถูกต้อง
const CACHE_NAME = 'sideline-cm-cache-v1.2';

// รายการไฟล์ที่จำเป็นต้องแคชสำหรับ App Shell (ทรัพยากรหลักของแอปพลิเคชัน)
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
  '/404.html', // หน้า 404 ที่ควรจะสามารถแสดงผลแบบออฟไลน์ได้

  // --- Critical Assets ---
  '/output.css', // ไฟล์ CSS หลักที่คอมไพล์แล้ว
  '/main.js',    // ไฟล์ JavaScript หลัก

  // --- PWA Metadata ---
  '/manifest.webmanifest',

  // --- Critical Images & Fonts (ควรมีรูปภาพที่จำเป็นที่สุด) ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/placeholder-profile.webp', // Placeholder image สำหรับ profile cards
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png',

  // --- Fonts ---
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/fonts/prompt-v11-latin_thai-700.woff2',

  // --- PWA Icons ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// --- Installation Event ---
// เมื่อ Service Worker ถูกติดตั้ง
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching App Shell...');
      // เพิ่มไฟล์ App Shell ทั้งหมดลงใน Cache
      return cache.addAll(APP_SHELL_FILES);
    }).then(() => {
      console.log('Service Worker: App Shell Cached Successfully');
      // ข้ามขั้นตอน waiting เพื่อให้ activated ทันที (หากมี SW เก่าอยู่)
      return self.skipWaiting();
    })
  );
});

// --- Activation Event ---
// เมื่อ Service Worker พร้อมใช้งาน (หลังจากติดตั้งเสร็จ)
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME]; // whitelist คือ cache ที่เราต้องการเก็บไว้
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // ลบ cache เก่าที่ไม่อยู่ใน whitelist
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // ทำให้ Service Worker ตัวใหม่สามารถควบคุมหน้าเว็บที่เปิดค้างอยู่ได้ทันที
  return self.clients.claim();
});

// --- Fetch Handling ---
// ดักจับทุก request ที่ออกจากหน้าเว็บ
self.addEventListener('fetch', event => {
  // ไม่ต้องจัดการกับ request ที่ไม่ใช่ GET (เช่น POST, PUT, DELETE)
  if (event.request.method !== 'GET') {
    return;
  }

  // Supabase API requests (Network First strategy)
  // สำหรับการเรียก API ของ Supabase เราต้องการข้อมูลที่สดใหม่เสมอ
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        // ถ้า network ล่ม หรือ response ไม่ ok, ลองหาจาก cache
        if (!networkResponse || !networkResponse.ok) {
          console.warn(`Network response for ${event.request.url} was not OK, falling back to cache.`);
          // Clone response ก่อนนำไป cache (เพราะ response ใช้ได้ครั้งเดียว)
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse; // คืนค่า networkResponse แม้ว่าจะมีปัญหา
        }
        // Clone response และ cache ไว้สำหรับครั้งต่อไป
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // หาก fetch ล้มเหลว (เช่น offline) ให้ลองหาจาก cache
        console.warn(`Network request failed for ${event.request.url}, falling back to cache.`);
        return caches.match(event.request);
      })
    );
    return; // หยุดการประมวลผล fetch event นี้
  }

  // สำหรับไฟล์อื่นๆ (App Shell Assets) - Cache First strategy
  // ให้ลองหาจาก cache ก่อน ถ้าไม่มีจึงค่อยไปดึงจาก network
  event.respondWith(
    caches.match(event.request).then(response => {
      // ถ้ามีใน cache ให้ส่งกลับไปเลย
      if (response) {
        console.log('Service Worker: Serving from cache:', event.request.url);
        return response;
      }
      // ถ้าไม่มี, ให้ไปดึงจาก network
      console.log('Service Worker: Fetching from network:', event.request.url);
      return fetch(event.request).then(
        (networkResponse) => {
          // ตรวจสอบ response จาก network
          if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse; // ส่ง response เดิมกลับไป หากไม่ใช่ response ที่ cache ได้
          }
          // Clone response และ cache ไว้สำหรับครั้งต่อไป
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }
      ).catch(() => {
        // หาก fetch ล้มเหลว (เช่น offline) และไม่มีใน cache
        console.warn('Service Worker: Network request failed, falling back to 404.html or generic response.');
        // ส่งหน้า 404.html หรือ response แบบ generic กลับไป
        // ตรวจสอบให้แน่ใจว่ามีไฟล์ 404.html ใน urlsToCache
        return caches.match('/404.html') || new Response('Network error and no offline page found', {
          status: 404,
          statusText: 'Not Found'
        });
      });
    })
  );
});

// --- Optional: Notification Handling (หากคุณวางแผนจะใช้ Push Notifications) ---
/*
self.addEventListener('push', event => {
  const data = event.data.json(); // สมมติว่า push payload เป็น JSON

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png', // หรือไอคอนที่คุณต้องการ
    // actions: [{ action: 'close', title: 'Close' }] // ตัวอย่าง action
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close(); // ปิด notification เมื่อคลิก
  // จัดการกับการคลิก notification เช่น เปิดหน้าเว็บ
  if (event.action === 'close') {
    return;
  }
  if (event.action) {
    // หากมี action ที่กำหนดไว้
    // clients.openWindow(event.action);
  } else {
    // ถ้าไม่มี action หรือคลิกที่ตัว notification
    // clients.openWindow('/'); // เปิดหน้าแรก
  }
});
*/