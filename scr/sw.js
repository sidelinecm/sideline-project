// sw.js - A Robust Service Worker by Wawai
const CACHE_VERSION = 'v1.4'; // *** เปลี่ยนเลขเวอร์ชันทุกครั้งที่อัปเดตไฟล์สำคัญ ***
const CORE_CACHE_NAME = `sidelinecm-core-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `sidelinecm-images-${CACHE_VERSION}`;
const FONT_CACHE_NAME = `sidelinecm-fonts-${CACHE_VERSION}`;

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/profiles.html',
    '/output.css',
    '/main.js',
    '/images/logo-sideline-chiangmai.webp',
    '/images/favicon.ico',
    '/images/placeholder-profile.webp' // สำคัญมาก: ต้องแคชรูป Placeholder
];

// ติดตั้ง Service Worker และแคชไฟล์หลัก
self.addEventListener('install', event => {
    self.skipWaiting(); // บังคับให้ SW ใหม่ทำงานทันที
    event.waitUntil(
        caches.open(CORE_CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
    );
});

// จัดการกับ request ทั้งหมด
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 1. สำหรับรูปภาพจาก Supabase หรือ CDN อื่นๆ (ใช้ Stale-While-Revalidate)
    if (event.request.destination === 'image') {
        event.respondWith(staleWhileRevalidate(event.request, IMAGE_CACHE_NAME, '/images/placeholder-profile.webp'));
        return;
    }
    
    // 2. สำหรับฟอนต์ (ใช้ Cache First)
    if (event.request.destination === 'font' || url.hostname.includes('cloudflare')) {
        event.respondWith(cacheFirst(event.request, FONT_CACHE_NAME));
        return;
    }

    // 3. สำหรับหน้าเว็บและไฟล์หลัก (ใช้ Network First)
    if (event.request.mode === 'navigate' || CORE_ASSETS.some(path => url.pathname.endsWith(path))) {
         event.respondWith(networkFirst(event.request, CORE_CACHE_NAME));
         return;
    }
    
    // Request อื่นๆ ให้ทำตามปกติ
});

// กลยุทธ์: Stale-While-Revalidate
async function staleWhileRevalidate(request, cacheName, fallbackUrl) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(async () => {
        if (fallbackUrl) return caches.match(fallbackUrl);
    });

    return cachedResponse || fetchPromise;
}

// กลยุทธ์: Network First
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || Response.error();
    }
}

// กลยุทธ์: Cache First
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return Response.error();
    }
}


// ลบ Cache เก่าที่ไม่ใช้งานแล้ว
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => !name.endsWith(CACHE_VERSION))
                          .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim()) // ให้ SW ควบคุมหน้าเว็บทั้งหมดทันที
    );
});