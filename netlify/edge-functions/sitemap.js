import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';

// Helper Function: ทำความสะอาด Slug
function cleanSlug(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, '-').replace(/[^\u0E00-\u0E7F\w-]/g, '');
}

export default async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. ดึงข้อมูลจากตาราง Profiles และ Provinces
    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase.from('profiles').select('slug, lastUpdated').limit(1000),
      supabase.from('provinces').select('key')
    ]);

    // 2. เริ่มสร้าง XML (ห้ามมีช่องว่างเด็ดขาดก่อน <?xml)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // เพิ่มหน้าแรก (Home)
    xml += `\n  <url>`;
    xml += `\n    <loc>${DOMAIN}/</loc>`;
    xml += `\n    <changefreq>daily</changefreq>`;
    xml += `\n    <priority>1.0</priority>`;
    xml += `\n  </url>`;

    // เพิ่มหน้าจังหวัด (Provinces)
    if (provinces) {
      provinces.forEach(p => {
        if (p.key) {
            xml += `\n  <url>`;
            xml += `\n    <loc>${DOMAIN}/sideline/province/${encodeURIComponent(p.key)}</loc>`;
            xml += `\n    <changefreq>daily</changefreq>`;
            xml += `\n    <priority>0.9</priority>`;
            xml += `\n  </url>`;
        }
      });
    }

    // เพิ่มหน้าโปรไฟล์ (Profiles)
    if (profiles) {
      profiles.forEach(p => {
        if (p.slug) {
          const safeSlug = encodeURIComponent(cleanSlug(p.slug));
          // ถ้าไม่มี lastUpdated ให้ใช้วันปัจจุบัน
          const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString() : new Date().toISOString();
          
          xml += `\n  <url>`;
          xml += `\n    <loc>${DOMAIN}/sideline/${safeSlug}</loc>`;
          xml += `\n    <lastmod>${lastMod}</lastmod>`;
          xml += `\n    <changefreq>weekly</changefreq>`;
          xml += `\n    <priority>0.8</priority>`;
          xml += `\n  </url>`;
        }
      });
    }

    xml += `\n</urlset>`;

    // 3. ส่ง Response กลับไปเป็นไฟล์ XML
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
      }
    });

  } catch (error) {
    console.error("Sitemap Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};