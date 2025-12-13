import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
// ✅ FIX: เปลี่ยนชื่อ Key ให้ตรงกับที่ตั้งใน Netlify แล้ว
const SUPABASE_KEY_ENV_NAME = 'SUPABASE_ANON_KEY'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';

export default async (request, context) => {
  // ดึง Key จาก Environment Variable ที่ชื่อ SUPABASE_ANON_KEY
  const SUPABASE_ANON_KEY = context.env[SUPABASE_KEY_ENV_NAME]; 
  
  if (!SUPABASE_ANON_KEY) {
      console.error("CRITICAL: Supabase Key not found in Environment Variables for Sitemap.");
      return new Response("Error: Key Missing", { status: 500 });
  }

  try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // 1. ดึงข้อมูล Profiles
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
          "Cache-Control": "public, max-age=3600",
          "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
        }
      });
  } catch (e) { 
      console.error("Sitemap Generation Error:", e);
      // Fallback: ส่ง Sitemap ว่างเปล่าแต่แจ้ง Bot ว่าสำเร็จ (200) เพื่อไม่ให้เกิด Error
      return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, { 
          headers: { "Content-Type": "application/xml" },
          status: 200 
      }); 
  }
};