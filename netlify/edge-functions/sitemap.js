import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

// ฟังก์ชันช่วยแปลงตัวอักษรพิเศษให้เป็น XML ที่ปลอดภัย (ป้องกัน Error)
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

export default async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. ดึงข้อมูล (เพิ่ม imagePath, name, created_at เข้ามา)
    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase
        .from('profiles')
        .select('slug, lastUpdated, created_at, imagePath, name')
        .eq('active', true) // เอาเฉพาะคนที่สถานะ Active
        .limit(2000), // เพิ่ม Limit เผื่ออนาคต
      supabase
        .from('provinces')
        .select('key')
    ]);

    // 2. เริ่มสร้าง XML (ต้องมี xmlns:image เพื่อรองรับรูปภาพ)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // --- A. หน้าแรก (Home) ---
    xml += `
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // --- B. หน้า Static (หน้าทั่วไป) ---
    const staticPages = ['blog', 'about', 'faq', 'profiles', 'locations', 'contact'];
    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${DOMAIN}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // --- C. หน้าจังหวัด (Provinces) ---
    if (provinces) {
      provinces.forEach(p => {
        xml += `
  <url>
    <loc>${DOMAIN}/location/${encodeURIComponent(p.key)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
      });
    }

    // --- D. หน้าโปรไฟล์ (Profiles) + รูปภาพ ---
    if (profiles) {
      profiles.forEach(p => {
        if (p.slug) {
          const safeSlug = encodeURIComponent(p.slug.trim());
          // ใช้วันที่อัปเดต ถ้าไม่มีใช้วันที่สร้าง ถ้าไม่มีอีกใช้วันปัจจุบัน
          const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
          const lastMod = new Date(dateStr).toISOString();

          // สร้าง Tag รูปภาพ (ถ้ามีรูป)
          let imageXml = '';
          if (p.imagePath) {
            // สร้าง URL รูปเต็ม และ Escape ตัวอักษร
            const imgUrl = `${STORAGE_URL}/${p.imagePath}`.replace(/&/g, '&amp;');
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

    // 3. ส่ง Response กลับไป
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache 1 ชั่วโมง
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable" // CDN Cache 1 วัน
      }
    });

  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return new Response("Internal Server Error: " + error.message, { status: 500 });
  }
};