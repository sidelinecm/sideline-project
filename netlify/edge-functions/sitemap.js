import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ฟังก์ชันป้องกัน XML พัง (สำคัญมาก ถ้ามีตัวอักษรแปลกๆ ใน URL)
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async (request, context) => {
  // 1. Config: พยายามดึงจาก Environment Variables ก่อน ถ้าไม่มีให้ใช้ค่าที่ใส่มา
  // แนะนำ: ให้ไปตั้งค่าใน Netlify Dashboard > Site settings > Environment variables
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 2. ดึงข้อมูล (ดึง 1000 คนล่าสุด)
    // ใช้ Promise.all เพื่อดึงข้อมูล 2 ตารางพร้อมกัน (เร็วกว่าเดิม 2 เท่า)
    const [profilesRes, provincesRes] = await Promise.all([
        supabase.from('profiles')
          .select('slug, created_at, lastUpdated, availability')
          .eq('is_published', true) // (Optional) ถ้ามี column ไว้ซ่อนคนที่ไม่ active ควรใส่
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase.from('provinces').select('key')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 3. หน้า Static (หน้าแรก)
    xml += `
    <url>
        <loc>${DOMAIN}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    // 4. หน้าจังหวัด
    if (provincesRes.data) {
      provincesRes.data.forEach(p => {
        if (p.key) {
           xml += `
           <url>
               <loc>${DOMAIN}/location/${escapeXml(p.key)}</loc>
               <changefreq>weekly</changefreq>
               <priority>0.8</priority>
           </url>`;
        }
      });
    }

    // 5. หน้าโปรไฟล์
    if (profilesRes.data) {
      profilesRes.data.forEach(p => {
        if (p.slug) {
            // Priority Logic: ถ้าว่าง (Available) ให้ความสำคัญสูงกว่า
            const priority = (p.availability && (p.availability.includes('ว่าง') || p.availability.includes('รับงาน'))) ? '0.9' : '0.7';
            
            // Date Logic: ถ้าไม่มี lastUpdated ให้ใช้ created_at ถ้าไม่มีอีกใช้วันนี้
            const rawDate = p.lastUpdated || p.created_at || new Date().toISOString();
            const lastMod = new Date(rawDate).toISOString();

            xml += `
            <url>
                <loc>${DOMAIN}/sideline/${escapeXml(p.slug)}</loc>
                <lastmod>${lastMod}</lastmod>
                <changefreq>daily</changefreq>
                <priority>${priority}</priority>
            </url>`;
        }
      });
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache ที่ Browser 1 ชม. / ที่ CDN ของ Netlify 24 ชม. (ช่วยลดการยิง Database)
        "Cache-Control": "public, max-age=3600, s-maxage=86400", 
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
      }
    });

  } catch (error) {
    console.error("Critical Sitemap Error:", error);
    // Fallback: ถ้าพังจริงๆ ให้ส่ง XML ว่างๆ กลับไป Google จะได้ไม่แจ้ง Error 500
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
        headers: { "Content-Type": "application/xml" }
    });
  }
};