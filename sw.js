/**
 * [ FIRST MODEL HUB - SERVICE WORKER ENGINE ]
 * High-Performance & Self-Healing Cache (Edge-Compliant)
 */

const swUrl = new URL(self.location);
const CURRENT_VERSION = swUrl.searchParams.get('v') || 'v_20261022_42';
const CACHE_NAME = `firstmodelhub-cache-${CURRENT_VERSION}`;


const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png',
  '/offline.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(err => console.warn(`[SW] Precache skipped: ${url}`)))
      );
    })
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log(`[SW] Purging old cache: ${key}`);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  
  if (url.origin.includes('supabase.co') || url.origin.includes('googletagmanager.com') || event.request.method !== 'GET') {
    return;
  }

  
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedOffline = await caches.match('/offline.html');
        if (cachedOffline) return cachedOffline;
        
        
        return new Response(
          '<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><title>ออฟไลน์ - FirstModelHub</title></head><body style="text-align:center;padding:50px;font-family:Prompt,sans-serif;background:#F8F6FC;color:#140F22;"><h2>🔌 ไม่มีการเชื่อมต่ออินเทอร์เน็ต</h2><p>กรุณาตรวจสอบสัญญาณอินเทอร์เน็ตของคุณ แล้วลองใหม่อีกครั้ง</p></body></html>',
          { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      })
    );
    return;
  }

  
  if (url.origin.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        return new Response('', { status: 408, statusText: 'Network Request Failed' });
      });
    })
  );
});
