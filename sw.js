const CACHE_NAME = 'sidelinecm-cache-v3';

// รายชื่อทรัพยากร Static หลักที่ต้องการทำ Pre-Cache เพื่อการทำงานที่เสถียรและเร็ว
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/manifest.webmanifest',
  '/icons/favicon.ico',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  '/icons/apple-touch-icon.png',
  '/fonts/prompt-v11-latin_thai-700.woff2',
  '/fonts/prompt-v11-latin_thai-regular.woff2',
  '/images/hero-sidelinechiangmai-1200.webp',
  '/images/sidelinechiangmai-social-preview.webp'
];

// 1. ขั้นตอนติดตั้ง (Install Event) - ดาวน์โหลดและเก็บไฟล์หลักลง Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ SW: กำลังประมวลผลจัดเก็บ Pre-cache ไฟล์ระบบหลัก...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. ขั้นตอนเริ่มทำงาน (Activate Event) - เคลียร์ไฟล์ Cache เวอร์ชันเก่า
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('⚡ SW: กำลังเคลียร์ Cache เวอร์ชันเก่าตกรุ่น:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. จัดการคำขอเครือข่าย (Fetch Event) - ระบบ Stale-While-Revalidate และ Bypass API
self.addEventListener('fetch', (event) => {
  // รองรับและจำกัดเฉพาะคำขอแบบ GET เท่านั้น
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ข้ามการทำ Cache สำหรับ Supabase API, Cloudinary, ESM.sh เพื่อดึงข้อมูลที่เป็นปัจจุบันจริงเสมอ
  if (
    url.origin.includes('supabase.co') || 
    url.origin.includes('cloudinary.com') || 
    url.origin.includes('esm.sh')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // ใช้กลยุทธ์แบบ Stale-While-Revalidate สำหรับทรัพยากร Static อื่น ๆ ของเว็บไซต์
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // ส่งคืนผลลัพธ์จาก Cache ทันทีเพื่อให้โหลดไว และอัปเดตไฟล์ใหม่ในเบื้องหลังแบบเงียบ ๆ
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* ปล่อยผ่านกรณีเครือข่ายขาดการเชื่อมต่อเบื้องหลัง */ });
        return cachedResponse;
      }

      // หากไม่มีใน Cache ให้เรียกจากเครือข่ายปกติและเก็บลง Cache สำหรับใช้ครั้งถัดไป
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});

