import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';
// URL ของถังเก็บรูปภาพ (Bucket)
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

// --- 2. HELPER FUNCTION ---
// ฟังก์ชันป้องกัน XML พัง (แปลงตัวอักษรพิเศษ)
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

// --- 3. MAIN FUNCTION ---
export default async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ดึงข้อมูลโปรไฟล์และจังหวัดพร้อมกัน (Active Only)
    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase
        .from('profiles')
        .select('slug, lastUpdated, created_at, imagePath, name')
        .eq('active', true)
        .limit(2000), // รองรับได้ถึง 2000 คน
      supabase
        .from('provinces')
        .select('key')
    ]);

    // เริ่มเขียน XML Header
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // -------------------------------------------------------
    // A. หน้าแรก (Home)
    // -------------------------------------------------------
    xml += `
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // -------------------------------------------------------
    // B. หน้าทั่วไป (Static Pages)
    // -------------------------------------------------------
    const staticPages = ['blog', 'about', 'faq', 'profiles', 'locations', 'contact'];
    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${DOMAIN}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // -------------------------------------------------------
    // C. หน้าจังหวัด (Provinces)
    // -------------------------------------------------------
    if (provinces) {
      provinces.forEach(p => {
        if (p.key) {
           xml += `
  <url>
    <loc>${DOMAIN}/location/${encodeURIComponent(p.key)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
        }
      });
    }

    // -------------------------------------------------------
    // D. หน้าโปรไฟล์น้องๆ (Profiles) - ส่วนสำคัญ
    // -------------------------------------------------------
    if (profiles) {
      profiles.forEach(p => {
        if (p.slug) {
          const safeSlug = encodeURIComponent(p.slug.trim());
          // วันที่อัปเดตล่าสุด
          const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
          const lastMod = new Date(dateStr).toISOString();

          // สร้าง Tag รูปภาพ (สำหรับ Google Images)
          let imageXml = '';
          if (p.imagePath) {
            let imgUrl = '';
            
            // Logic: ตรวจสอบว่าเป็น Link เต็มหรือชื่อไฟล์
            if (p.imagePath.startsWith('http')) {
                // เผื่อไว้กรณีอนาคตมีการเปลี่ยนแปลง
                imgUrl = p.imagePath;
            } else {
                // ✅ กรณีปกติ: แอดมินอัปโหลดรูป -> เอาชื่อไฟล์มาต่อท้าย URL หลัก
                imgUrl = `${STORAGE_URL}/${p.imagePath}`;
            }
            
            // แปลง & เป็น &amp; เพื่อไม่ให้ XML พัง
            imgUrl = imgUrl.replace(/&/g, '&amp;');
            const imgTitle = escapeXml(p.name || 'Sideline Profile');
            
            imageXml = `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${imgTitle}</image:title>
    </image:image>`;
          }

          xml += `
  <url>
    <loc>${DOMAIN}/sideline/${safeSlug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>${imageXml}
  </url>`;
        }
      });
    }

    xml += `\n</urlset>`;

    // ส่งข้อมูลกลับ (Response)
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache ที่ Browser 1 ชั่วโมง
        "Cache-Control": "public, max-age=3600",
        // Cache ที่ Netlify Edge Server 1 วัน (โหลดเร็วมาก)
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
      }
    });

  } catch (error) {
    console.error("Sitemap Error:", error);
    // ถ้าพังจริงๆ ให้ส่ง Error 500 กลับไป
    return new Response("Internal Server Error", { status: 500 });
  }
};