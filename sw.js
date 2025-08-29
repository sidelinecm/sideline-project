
// =================================================================================
//  Service Worker (sw.js) - THE COMPLETE & OPTIMIZED VERSION
// =================================================================================

// ✅ Step 1: นำเข้า Workbox เวอร์ชันล่าสุดและเสถียรที่สุด
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox v7.1.0 is loaded successfully!`);

  // ✅ Step 2: ทำให้ Service Worker ใหม่ทำงานทันที ไม่ต้องรอ
  // ช่วยให้ผู้ใช้ได้รับการอัปเดตล่าสุดเสมอเมื่อมีการเปลี่ยนแปลง
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // ✅ Step 3: Pre-caching - แคชไฟล์โครงสร้างหลักของเว็บ (App Shell)
  // ไฟล์เหล่านี้จะพร้อมใช้งานทันที ทำให้เว็บโหลดเร็วมาก และทำงานแบบ Offline ได้
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: null },
    { url: '/manifest.webmanifest', revision: null },
    { url: '/images/logo-sideline-chiangmai.webp', revision: null }, // โลโก้หลัก
    { url: '/images/placeholder-profile.webp', revision: null },    // รูปภาพสำรอง
    { url: '/images/favicon.svg', revision: null },
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
  ]);

  // ✅ Step 4: Caching Strategy - กำหนดกลยุทธ์สำหรับไฟล์ประเภทต่างๆ

  // --- กลยุทธ์สำหรับหน้าเว็บ (HTML) ---
  // Network First: พยายามโหลดข้อมูลใหม่ล่าสุดจากเน็ตเวิร์กก่อนเสมอ
  // ถ้าเน็ตล่ม หรือช้าเกิน 4 วินาที, ให้ดึงจาก Cache มาแสดงแทน
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'sideline-cm-pages-cache',
      networkTimeoutSeconds: 4,
      plugins: [
        // Plugin สำรอง: ถ้า NetworkFirst ล้มเหลวโดยสมบูรณ์ ให้แสดงหน้า offline.html
        new workbox.recipes.offlineFallback({
          pageFallback: '/offline.html',
        }),
      ],
    })
  );

  // --- กลยุทธ์สำหรับ CSS & JS ---
  // Stale-While-Revalidate: โหลดจาก Cache ทันที (เร็วมาก!) แล้วค่อยไปเช็คเบื้องหลังว่ามีของใหม่หรือไม่
  // เป็นวิธีที่ดีที่สุดสำหรับไฟล์ที่ไม่ค่อยเปลี่ยน แต่ต้องการให้เป็นเวอร์ชันล่าสุดเสมอ
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'sideline-cm-static-assets-cache',
    })
  );

  // --- กลยุทธ์สำหรับรูปภาพ ---
  // Cache First: เมื่อโหลดครั้งแรกแล้ว จะเก็บลง Cache และเรียกจาก Cache เสมอ
  // เหมาะสำหรับรูปภาพที่ไม่มีการเปลี่ยนแปลง เพื่อประสิทธิภาพสูงสุด
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-cm-images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,                 // เก็บรูปภาพได้สูงสุด 150 รูป
          maxAgeSeconds: 30 * 24 * 60 * 60, // มีอายุ 30 วัน
          purgeOnQuotaError: true,         // ถ้าพื้นที่ใกล้เต็ม ให้ลบแคชนี้ทิ้งก่อน
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200], // แคชเฉพาะ Response ที่สำเร็จ
        }),
      ],
    })
  );
  
  // --- กลยุทธ์สำหรับฟอนต์ ---
  // Cache First: เหมือนรูปภาพ โหลดครั้งเดียว เก็บยาวๆ
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-cm-fonts-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // เก็บไว้ 1 ปี
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

} else {
  console.log(`[SW] Workbox failed to load.`);
}


