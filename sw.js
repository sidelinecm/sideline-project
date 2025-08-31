
// =================================================================================
//  Service Worker (sw.js) - THE ULTIMATE & PRODUCTION-READY VERSION
// =================================================================================

// ✅ Step 1: นำเข้า Workbox เวอร์ชันล่าสุดและเสถียรที่สุด
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox v7.1.0 is loaded successfully!`);

  // ✅ Step 2: ทำให้ Service Worker ใหม่ทำงานทันทีและควบคุมเพจทั้งหมด
  // ช่วยให้ผู้ใช้ได้รับการอัปเดตล่าสุดเสมอเมื่อมีการเปลี่ยนแปลง
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // ✅ Step 3: Pre-caching - แคชไฟล์โครงสร้างหลักของเว็บ (App Shell)
  // **หมายเหตุ:** ในโปรเจกต์จริง revision ควรถูกสร้างโดย Build Tool (เช่น Vite, Webpack) 
  // เพื่อให้ Workbox รู้ว่าไฟล์มีการเปลี่ยนแปลงหรือไม่ (เช่น 'revision: 'a1b2c337'')
  // การใช้ 'revision: null' เหมาะสำหรับตอนเริ่มต้น
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: null },
    { url: '/manifest.webmanifest', revision: null },
    { url: '/images/logo-sideline-chiangmai-128.webp', revision: null }, 
    { url: '/images/placeholder-profile.webp', revision: null },    
    { url: '/images/favicon.svg', revision: null },
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
  ]);

  // ✅ Step 4: Caching Strategy - กำหนดกลยุทธ์สำหรับไฟล์และ API ประเภทต่างๆ

  // --- กลยุทธ์สำหรับหน้าเว็บ (HTML Navigation) ---
  // NetworkFirst: พยายามโหลดข้อมูลใหม่ล่าสุดจากเน็ตเวิร์กก่อนเสมอ
  // ถ้าเน็ตล่ม หรือช้าเกิน 4 วินาที, ให้ดึงจาก Cache มาแสดงแทน
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'sideline-cm-pages',
      networkTimeoutSeconds: 4,
      plugins: [
        new workbox.recipes.offlineFallback({
          pageFallback: '/offline.html',
        }),
      ],
    })
  );

  // --- 🚀 [ULTIMATE UPGRADE] กลยุทธ์สำหรับ API ของ Supabase ---
  // Stale-While-Revalidate: แสดงข้อมูลจาก Cache ทันที (เร็วมาก!) 
  // พร้อมกับส่ง Request ไปเช็คข้อมูลล่าสุดเบื้องหลัง ถ้ามีของใหม่จะอัปเดต Cache ไว้ใช้ครั้งหน้า
  // นี่คือหัวใจที่ทำให้เว็บเร็วและมีข้อมูลแสดงผลแม้ออฟไลน์
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'hgzbgpbmymoiwjpaypvl.supabase.co',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'sideline-cm-api-data',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 5, // เก็บข้อมูล API request ล่าสุด 5 รายการ
          maxAgeSeconds: 24 * 60 * 60, // มีอายุ 1 วัน
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // --- กลยุทธ์สำหรับ CSS & JS ---
  // Stale-While-Revalidate: กลยุทธ์ที่ดีที่สุดสำหรับ Static Assets
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'sideline-cm-static-assets',
    })
  );

  // --- กลยุทธ์สำหรับรูปภาพ ---
  // CacheFirst: เหมาะสำหรับรูปภาพที่ไม่มีการเปลี่ยนแปลง เพื่อประสิทธิภาพสูงสุด
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-cm-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 วัน
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  // --- กลยุทธ์สำหรับฟอนต์ (Self-hosted) ---
  // CacheFirst: เหมือนรูปภาพ โหลดครั้งเดียว เก็บยาวๆ
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-cm-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ปี
        }),
      ],
    })
  );

} else {
  console.log(`[SW] Workbox failed to load.`);
}





