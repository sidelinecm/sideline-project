// sw.js - Service Worker (Advanced & Complete Version) - v2.0.0

const APP_SHELL_CACHE_NAME = 'sidelinecm-app-shell-cache-v2';
const DYNAMIC_CONTENT_CACHE_NAME = 'sidelinecm-dynamic-content-cache-v2';

// --- 1. App Shell: ไฟล์โครงสร้างหลักที่จำเป็นต้องมีเสมอ ---
// เราจะแคชเฉพาะไฟล์ที่สำคัญที่สุด เพื่อให้การติดตั้งครั้งแรกเร็วที่สุด
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/profiles.html',
  '/locations.html',
  '/about.html',
  '/faq.html',
  '/blog.html',
  '/privacy-policy.html',
  '/404.html',
  '/output.css',
  '/main.js', // <-- Path ที่แก้ไขแล้ว
  '/manifest.webmanifest',
  // --- รูปภาพ UI ที่สำคัญ ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/sideline-chiangmai-hero.webp',
  '/images/placeholder-profile.webp', // Placeholder สำคัญมาก
  // --- ไอคอนสำหรับ PWA ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// --- Event: install ---
// ติดตั้ง Service Worker และทำการ Precaching ให้กับ App Shell
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(APP_SHELL_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching App Shell:', PRECACHE_ASSETS);
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // สั่งให้ Service Worker ใหม่ทำงานทันที
  );
});

// --- Event: activate ---
// ทำความสะอาด Cache เวอร์ชันเก่าที่ไม่ใช้แล้ว
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ถ้าชื่อ cache ไม่ตรงกับเวอร์ชันปัจจุบัน ให้ลบทิ้ง
          if (cacheName !== APP_SHELL_CACHE_NAME && cacheName !== DYNAMIC_CONTENT_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // ควบคุม Page ที่เปิดอยู่ทันที
  );
});

// --- Event: fetch ---
// นี่คือหัวใจของการจัดการไฟล์ทั้งหมด! Service Worker จะดักจับทุก request ที่ออกจากหน้าเว็บ
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // --- กลยุทธ์ที่ 1: Stale-While-Revalidate สำหรับ API และรูปโปรไฟล์จาก Supabase ---
  // ตอบกลับจาก Cache ทันที (ถ้ามี) เพื่อความเร็ว แล้วค่อยไปดึงข้อมูลใหม่มาอัปเดตเบื้องหลัง
  if (url.origin === 'https://hgzbgpbmymoiwjpaypvl.supabase.co') {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CONTENT_CACHE_NAME));
    return;
  }
  
  // --- กลยุทธ์ที่ 2: Cache First สำหรับไฟล์อื่นๆ ทั้งหมด ---
  // (รวมถึงรูปในบทความ, ฟอนต์จาก CDN, และไฟล์อื่นๆ ที่ไม่ได้อยู่ใน App Shell)
  // ถ้าเจอใน Cache ให้ใช้จาก Cache ทันที, ถ้าไม่เจอค่อยไปโหลดจาก Network
  event.respondWith(cacheFirst(request));
});


// --- ฟังก์ชันสำหรับกลยุทธ์ Caching ---

/**
 * Cache First Strategy: เหมาะสำหรับไฟล์ที่ไม่ค่อยเปลี่ยนแปลง เช่น รูปประกอบบทความ, ฟอนต์
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    // เมื่อโหลดสำเร็จ, นำไปเก็บใน Dynamic Cache โดยอัตโนมัติ
    const cache = await caches.open(DYNAMIC_CONTENT_CACHE_NAME);
    // เราจะแคชเฉพาะ GET request ที่สำเร็จเท่านั้น
    if (request.method === 'GET' && networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // กรณีออฟไลน์และไม่มีไฟล์ใน cache, อาจจะแสดงหน้า fallback
    console.error('[SW] Network fetch failed:', error);
    // สำหรับรูปภาพ, เราอาจจะส่งรูป placeholder กลับไป
    if (request.destination === 'image') {
      return caches.match('/images/placeholder-profile.webp');
    }
    // สำหรับ request อื่นๆ อาจจะ return error response
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
}

/**
 * Stale-While-Revalidate Strategy: เหมาะสำหรับข้อมูล API ที่ต้องการทั้งความเร็วและความสดใหม่
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponsePromise = await cache.match(request);
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cachedResponsePromise || networkResponsePromise;
}