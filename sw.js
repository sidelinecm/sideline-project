/**
 * [ SERVICE WORKER - S-TIER WORKBOX PRODUCTION CODE ]
 * Project: Sideline Chiangmai Service Worker
 * Update Timeline: 2026 Dark Theme Optimized
 */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  // ตั้งค่าเวอร์ชันแคชให้ตรงตามตารางอัปเดตระบบปี 2026
  const CACHE_VERSION = 'v-2026-07-09-01'; 
  const OFFLINE_PAGE = '/offline.html';

  workbox.core.setCacheNameDetails({
    prefix: 'sideline-cm',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime'
  });

  // 1. ขั้นตอนเริ่มระบบ (บันทึกหน้าออฟไลน์เผื่อเครือข่ายขัดข้อง)
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(`sideline-cm-precache-${CACHE_VERSION}`).then((cache) => {
        return cache.add(OFFLINE_PAGE).catch(() => console.log('Offline page not deployed yet. Skipping.'));
      })
    );
    self.skipWaiting();
  });

  // 2. ขั้นตอนเคลียร์ขยะระบบเก่า (Clean up obsolete caches)
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!key.includes(CACHE_VERSION)) {
              return caches.delete(key);
            }
          })
        )
      )
    );
    self.clients.claim();
  });

  // 3. กฎควบคุมและจัดการความเร็ว (Caching Strategies)

  // ⚡ หน้าเว็บทั้งหมด (HTML Documents) - เน้นความสดใหม่ผ่าน NetworkFirst รอ 3 วิ ถ้าเน็ตพังดึงแคช
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-cache-${CACHE_VERSION}`,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60 // เก็บแคชหน้าเว็บไว้ 7 วัน
        }),
      ],
    })
  );

  // ⚡ ไฟล์หน้าตาเว็บระบบ (CSS, JS, Fonts) - เอาของเดิมโชว์ก่อนเพื่อสปีดเสี้ยววินาที แล้วแอบอัปเดตข้างหลัง
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-resources-${CACHE_VERSION}`
    })
  );

  // ⚡ ภาพสัญรูปหลักของแอป - แคชถาวรเพื่อลดการสั่น CLS
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image' && !request.url.includes('supabase.co'),
    new workbox.strategies.CacheFirst({
      cacheName: `web-assets-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ 
          maxEntries: 60, 
          maxAgeSeconds: 30 * 24 * 60 * 60 
        })
      ]
    })
  );

  // ⚡ รูปภาพน้อง ๆ คลังเก็บประวัติ (Supabase Storage) - แคชระดับภาพสกรีนตรงปก
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('supabase.co/storage/v1/object/public/') || url.href.includes('supabase.co/storage/v1/render/image/'),
    new workbox.strategies.CacheFirst({
      cacheName: `profile-images-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 15 * 24 * 60 * 60, // อัปเดตคลังรูปเก็บแคชไว้ 15 วัน
          purgeOnQuotaError: true
        })
      ]
    })
  );

  // ⚡ API ข้อมูลแบบ Dynamic - ดึงสดจากเซิร์ฟเวอร์เท่านั้น ห้ามใช้แคช
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('rest/v1'),
    new workbox.strategies.NetworkOnly()
  );

  // 4. กรณีฉุกเฉินไม่มีอินเทอร์เน็ต
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    return Response.error();
  });

  console.log(`[SW] Sideline Chiangmai Service Worker ${CACHE_VERSION} is active!`);
}