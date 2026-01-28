// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  // 0. ให้ SW Activate ทันที
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // 1. ล้าง cache เก่าอัตโนมัติ
  workbox.precaching.cleanupOutdatedCaches();

  // 2. Precache แบบ ง่ายๆ (เก็บเฉพาะไฟล์ offline.html)
  //    ไม่ต้องระบุ revision, ใช้ URL เป็น key
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: null }
  ]);

  // 3. Runtime cache – รูปภาพ แบบ Stale-While-Revalidate
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 14 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 4. Runtime cache – API แบบ NetworkFirst
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('rest/v1'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 100 })
      ],
    })
  );

  // 5. Runtime cache – CSS/JS แบบ Stale-While-Revalidate
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 })
      ]
    })
  );

  // 6. SPA Navigation – NetworkFirst + เก็บใน cache กรณี offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 })
      ]
    })
  );

  // 7. Offline fallback
  workbox.routing.setCatchHandler(({ event }) => {
    if (event.request.mode === 'navigate') {
      // คืน offline.html จาก cache ที่เรา precache ไว้
      return caches.match('/offline.html');
    }
    return Response.error();
  });
}