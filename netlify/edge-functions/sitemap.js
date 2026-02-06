import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

// Helper สำหรับ escape XML
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
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase
        .from('profiles')
        .select('slug, lastUpdated, created_at, imagePath, name')
        .eq('active', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('provinces')
        .select('key')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // หน้าแรก
    xml += `
<url>
  <loc>${DOMAIN}/</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>`;

    // Static pages
    ['blog', 'about', 'faq', 'profiles', 'locations', 'contact'].forEach(page => {
      xml += `
<url>
  <loc>${DOMAIN}/${page}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`;
    });

    // จังหวัด
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

    // Profiles
    if (profiles) {
      profiles.forEach(p => {
        if (p.slug) {
          // ตัดเลข ID ต่อท้ายออก
          let rawSlug = p.slug.trim().replace(/(-\d+)(?:-\d+)+$/, '$1');

          // encode slug เพื่อรองรับภาษาไทย
          const safeSlug = encodeURIComponent(rawSlug);

          const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();

          // จัดการรูปภาพ
          let imageXml = '';
          if (p.imagePath) {
            let imgUrl = p.imagePath.startsWith('http') ? p.imagePath : `${STORAGE_URL}/${p.imagePath}`;
            // escape & ใน URL
            imgUrl = imgUrl.replace(/&/g, '&amp;');

            imageXml = `
  <image:image>
    <image:loc>${imgUrl}</image:loc>
    <image:title>${escapeXml(p.name || 'Sideline Profile')}</image:title>
  </image:image>`;
          }

          // เขียน URL profile
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

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // 1 ชม. สำหรับเบราว์เซอร์
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable" // 1 วัน สำหรับ CDN
      }
    });

  } catch (err) {
    console.error("Error generating sitemap:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};