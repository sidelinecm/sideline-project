import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

// --- 2. HELPER FUNCTION: ป้องกัน XML พัง ---
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
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ดึงข้อมูล 2 อย่างพร้อมกัน: โปรไฟล์ (Active) และ จังหวัด
    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase
        .from('profiles')
        .select('slug, lastUpdated, created_at, imagePath, name')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(2000), 
      supabase
        .from('provinces')
        .select('key')
    ]);

    // เริ่มเขียน XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // A. หน้าแรก
    xml += `\n<url><loc>${DOMAIN}/</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`;

    // B. หน้า Static Pages
    ['blog', 'about', 'faq', 'profiles', 'locations', 'contact'].forEach(p => {
      xml += `\n<url><loc>${DOMAIN}/${p}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
    });

    // C. หน้าจังหวัด (Locations)
    if (provinces) {
      provinces.forEach(p => {
        if (p.key) {
           xml += `\n<url><loc>${DOMAIN}/location/${encodeURIComponent(p.key)}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`;
        }
      });
    }

    // D. หน้าโปรไฟล์ (Profiles) - 🔥 จุดแก้สำคัญ 🔥
    if (profiles) {
      profiles.forEach(p => {
        if (p.slug) {
          // 1. ดึง Slug ดิบมา
          let rawSlug = p.slug.trim();

          // 🔴 CLEANING LOGIC: ตัดเลข ID ที่ซ้ำซ้อนออก
          // เปลี่ยน "name-99-99-99" -> "name-99"
          rawSlug = rawSlug.replace(/(-\d+)(?:-\d+)+$/, '$1');

          // 2. Encode URL (เผื่อมีภาษาไทยหลุดมา)
          const safeSlug = encodeURIComponent(rawSlug);
          
          // 3. จัดการวันที่
          const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
          
          // 4. จัดการรูปภาพ (Image Object)
          let imageXml = '';
          if (p.imagePath) {
            let imgUrl = '';
            if (p.imagePath.startsWith('http')) {
                imgUrl = p.imagePath;
            } else {
                imgUrl = `${STORAGE_URL}/${p.imagePath}`;
            }
            // Escape ตัว & ใน URL ของรูปภาพ
            imgUrl = imgUrl.replace(/&/g, '&amp;');
            
            imageXml = `
      <image:image>
        <image:loc>${imgUrl}</image:loc>
        <image:title>${escapeXml(p.name || 'Sideline Profile')}</image:title>
      </image:image>`;
          }

          // 5. เขียนลง XML
          xml += `
  <url>
    <loc>${DOMAIN}/sideline/${safeSlug}</loc>
    <lastmod>${new Date(dateStr).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>${imageXml}
  </url>`;
        }
      });
    }

    xml += `\n</urlset>`;

    // ส่ง Response กลับไป
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Browser Cache 1 ชม.
        "Cache-Control": "public, max-age=3600",
        // Netlify CDN Cache 1 วัน (โหลดเร็วมาก)
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
      }
    });

  } catch (error) {
    console.error("Sitemap Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};