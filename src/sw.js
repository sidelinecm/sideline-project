// sw.js - Service Worker (Advanced & Complete Version) - v2.0.1 (Corrected Paths)

const APP_SHELL_CACHE_NAME = 'sidelinecm-app-shell-cache-v2';
const DYNAMIC_CONTENT_CACHE_NAME = 'sidelinecm-dynamic-content-cache-v2';

// --- 1. App Shell: ไฟล์โครงสร้างหลักที่จำเป็นต้องมีเสมอ ---
// แก้ไข Path ให้ถูกต้องตามโครงสร้างในโฟลเดอร์ dist
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
  '/main.js',
  '/manifest.webmanifest',
  // --- รูปภาพ UI ที่สำคัญ (ใช้ Path ที่ถูกต้องหลังแก้ Build) ---
  '/images/logo-sideline-chiangmai.webp',
  '/images/sideline-chiangmai-hero.webp',
  '/images/placeholder-profile.webp',
  // --- ไอคอนสำหรับ PWA ---
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// --- Event: install ---
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(APP_SHELL_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching App Shell:', PRECACHE_ASSETS);
        // ใช้ { cache: 'reload' } เพื่อให้แน่ใจว่าเราได้ไฟล์ล่าสุดมา cache เสมอตอนติดตั้ง
        const precacheRequests = PRECACHE_ASSETS.map(asset => new Request(asset, { cache: 'reload' }));
        return cache.addAll(precacheRequests);
      })
      .then(() => self.skipWaiting())
  );
});

// --- Event: activate ---
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== APP_SHELL_CACHE_NAME && cacheName !== DYNAMIC_CONTENT_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- Event: fetch ---
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    // สำหรับ App Shell (ไฟล์ใน PRECACHE_ASSETS), ใช้ Cache First
    if (PRECACHE_ASSETS.includes(url.pathname)) {
      event.respondWith(caches.match(request));
      return;
    }
  }

  // --- กลยุทธ์ที่ 1: Stale-While-Revalidate สำหรับ API และรูปโปรไฟล์จาก Supabase ---
  if (url.origin === 'https://hgzbgpbmymoiwjpaypvl.supabase.co') {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CONTENT_CACHE_NAME));
    return;
  }
  
  // --- กลยุทธ์ที่ 2: Cache First สำหรับไฟล์อื่นๆ ทั้งหมด ---
  event.respondWith(cacheFirst(request));
});


// --- ฟังก์ชันสำหรับกลยุทธ์ Caching ---

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CONTENT_CACHE_NAME);
    if (request.method === 'GET' && networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network fetch failed for:', request.url);
    if (request.destination === 'image') {
      return caches.match('/images/placeholder-profile.webp');
    }
    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}