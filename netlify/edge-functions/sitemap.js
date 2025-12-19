import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  // 1. ตั้งค่า Header ให้ Google Bot เข้าถึงได้ 100%
  const headers = {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "X-Robots-Tag": "index, follow" // เปลี่ยนเป็น index เพื่อให้ Google นำ URL ไปประมวลผล
  };

  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    console.log("🚀 Starting Sitemap Generation (SEO Ultimate Mode)...");

    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 2. ดึงข้อมูลแบบครอบคลุม (ขยาย Limit เป็น 2000 เพื่อรองรับข้อมูลที่เพิ่มขึ้น)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('slug, name, imagePath, lastUpdated, created_at') 
      .limit(2000); 

    if (profileError) throw profileError;

    const { data: provinces } = await supabase.from('provinces').select('key');

    const esc = (unsafe) => unsafe ? unsafe.replace(/[<>&"']/g, (m) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"}[m])) : '';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;

    // 3. วนลูปหน้าจังหวัด
    if (provinces) {
        for (const p of provinces) {
            xml += `<url><loc>${DOMAIN}/location/${esc(p.key)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
    }

    // 4. วนลูปหน้าโปรไฟล์ + รูปภาพ (เน้น Image SEO)
    if (profiles) {
        for (const p of profiles) {
            if (p.slug) {
                // จัดการเรื่องรูปภาพ ถ้าไม่มีให้ใช้รูป Default ของเว็บ
                const imgUrl = p.imagePath 
                    ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${esc(p.imagePath)}` 
                    : `${DOMAIN}/images/default_og_image.jpg`;

                // ใช้ค่าวันเวลาที่อัปเดตล่าสุด เพื่อกระตุ้นให้บอทมาเก็บข้อมูลใหม่บ่อยขึ้น
                const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
                const safeName = esc(p.name);

                xml += `
    <url>
        <loc>${DOMAIN}/sideline/${esc(p.slug)}</loc>
        <lastmod>${dateStr}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
        <image:image>
            <image:loc>${imgUrl}</image:loc>
            <image:title>น้อง ${safeName} ไซด์ไลน์เชียงใหม่</image:title>
            <image:caption>ดูโปรไฟล์และรีวิวน้อง ${safeName} อัปเดตล่าสุด</image:caption>
        </image:image>
    </url>`;
            }
        }
    }

    xml += `\n</urlset>`;

    return new Response(xml, { headers });

  } catch (error) {
    console.error("❌ Sitemap Error:", error);
    // กรณี Error ให้ส่งหน้าหลักไปก่อนเพื่อให้ Google ยังรู้จักเว็บเรา
    const fallbackXML = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${DOMAIN}/</loc><priority>1.0</priority></url></urlset>`;
    return new Response(fallbackXML, { status: 200, headers });
  }
};