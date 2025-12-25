import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
// แนะนำ: ควรย้าย Key ไปไว้ใน Netlify Environment Variables เพื่อความปลอดภัย
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';

export default async (request, context) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. ดึงข้อมูล Profiles (เอาแค่ 1000 คนล่าสุดที่ Active)
  // Optimization: ดึงเฉพาะ slug และ lastUpdated เพื่อประหยัด Bandwidth
  const { data: profiles } = await supabase
    .from('profiles')
    .select('slug, lastUpdated')
    .order('lastUpdated', { ascending: false })
    .limit(1000);

  // 2. ดึงข้อมูล Provinces
  const { data: provinces } = await supabase
    .from('provinces')
    .select('key');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static Pages
  xml += `<url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;

  // Province Pages
  if (provinces) {
    provinces.forEach(p => {
      xml += `
      <url>
        <loc>${DOMAIN}/location/${p.key}</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>`;
    });
  }

  // Profile Pages
  if (profiles) {
    profiles.forEach(p => {
      // แปลงวันที่ หรือใช้ Default
      const lastMod = p.lastUpdated ? new Date(p.lastUpdated).toISOString() : new Date().toISOString();
      xml += `
      <url>
        <loc>${DOMAIN}/sideline/${p.slug}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Browser Cache 1 ชม.
      "Netlify-CDN-Cache-Control": "public, max-age=86400, durable" // CDN เก็บไว้ 1 วัน (Bot โหลดเร็วมาก)
    }
  });
};