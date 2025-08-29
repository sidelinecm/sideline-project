

// =================================================================================
//  Service Worker (sw.js) - CORRECTED & HIGH-PERFORMANCE VERSION
// =================================================================================
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox is loaded successfully!`);

  const { precacheAndRoute, createHandlerBoundToURL } = workbox.precaching;
  const { registerRoute } = workbox.routing;
  const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  self.skipWaiting();
  workbox.core.clientsClaim();

  // ✅ PRECACHING: แคชไฟล์ที่จำเป็นที่สุดสำหรับ App Shell
  precacheAndRoute([
    { url: '/offline.html', revision: null },
    { url: '/manifest.webmanifest', revision: null },
    { url: '/images/logo-sideline-chiangmai.webp', revision: null },
    { url: '/images/placeholder-profile.webp', revision: null },
    { url: '/images/favicon.svg', revision: null },
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
  ]);

  // ✅ STRATEGY FOR HTML PAGES: พยายามไปที่ Network ก่อนเสมอ
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
      cacheName: 'sideline-cm-pages-cache',
      networkTimeoutSeconds: 4, // ถ้าเน็ตช้าเกิน 4 วิ ให้ไปเอาจากแคช
      plugins: [
        // ถ้า Network ล้มเหลว (Offline) ให้ไปดึงหน้า offline.html มาแสดง
        {
          handlerDidError: async () => {
            return await caches.match('/offline.html');
          },
        },
      ],
    })
  );

  // ✅ STRATEGY FOR CSS & JS: เร็วที่สุดและอัปเดตเสมอ
  registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new StaleWhileRevalidate({
      cacheName: 'sideline-cm-static-assets-cache',
    })
  );

  // ✅ STRATEGY FOR IMAGES (including Supabase): โหลดครั้งเดียว เก็บไว้ในแคช
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'sideline-cm-images-cache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          purgeOnQuotaError: true,
        }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );
  
  // ✅ STRATEGY FOR FONTS: โหลดครั้งเดียว เก็บยาวๆ
  registerRoute(
    ({ request }) => request.destination === 'font',
    new CacheFirst({
      cacheName: 'sideline-cm-fonts-cache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
        }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

} else {
  console.log(`[SW] Workbox didn't load.`);
}





