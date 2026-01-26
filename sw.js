importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  const CACHE_VERSION = 'v-2026-premium'; 

  workbox.core.setCacheNameDetails({
    prefix: 'sideline-cm',
    suffix: CACHE_VERSION
  });

  // 1. Precache หน้า Offline
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(`precache-${CACHE_VERSION}`).then(c => c.add('/offline.html'))
    );
  });

  // 2. กลยุทธ์สำหรับรูปภาพน้องๆ (เปลี่ยนเป็น StaleWhileRevalidate)
  // เพื่อให้รูปโชว์ทันทีจาก Cache แต่แอบโหลดใหม่เพื่อเช็คความสดใหม่/แก้ไขถ้าไฟล์พัง
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 14 * 24 * 60 * 60 // 14 วัน
        })
      ]
    })
  );

  // 3. ข้อมูล API (สถานะน้องๆ)
  // ใช้ NetworkFirst เพื่อให้ความสำคัญกับข้อมูลสดใหม่จาก Supabase ก่อนเสมอ
  // ถ้าโควตา Supabase เต็ม/เน็ตหลุด ถึงจะเอาข้อมูลเก่าจาก Cache มาช่วย
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('rest/v1'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 3, // ถ้า 3 วิโหลดไม่เสร็จ ให้เอาจาก Cache ทันที
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 100 })
      ]
    })
  );

  // 4. ไฟล์ CSS / JS หลัก
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate()
  );
}