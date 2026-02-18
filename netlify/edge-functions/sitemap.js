// --- START OF FILE sitemap.js ---
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

// ตัวช่วยแปลงอักษรพิเศษ XML
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, c => {
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

    // ดึงข้อมูลพร้อมกันเพื่อความเร็ว
    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase.from('profiles').select('slug, updated_at, created_at, imagePath, name').eq('status', 'active').limit(2000),
      supabase.from('provinces').select('key')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // 1. หน้าแรก
    xml += `
    <url>
        <loc>${DOMAIN}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    // 2. หน้าจังหวัด (Category) - ใช้ path /location/ ตาม ssr-province.js
    if (provinces) {
      provinces.forEach(p => {
        if (p.key) {
           xml += `
    <url>
        <loc>${DOMAIN}/location/${escapeXml(p.key)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
        }
      });
    }

    // 3. หน้าโปรไฟล์ (Products)
    if (profiles) {
      profiles.forEach(p => {
        if (p.slug) {
          const lastMod = new Date(p.updated_at || p.created_at || new Date()).toISOString();
          let imageXml = '';

          if (p.imagePath) {
            let imgUrl = p.imagePath.startsWith('http') ? p.imagePath : `${STORAGE_URL}/${p.imagePath}`;
            imgUrl = escapeXml(imgUrl); // ป้องกัน URL พังถ้ามี &
            const imgTitle = escapeXml(p.name || 'Sideline Profile');
            
            imageXml = `
        <image:image>
            <image:loc>${imgUrl}</image:loc>
            <image:title>${imgTitle}</image:title>
        </image:image>`;
          }

          xml += `
    <url>
        <loc>${DOMAIN}/sideline/${escapeXml(p.slug)}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>${imageXml}
    </url>`;
        }
      });
    }

    xml += `</urlset>`;

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