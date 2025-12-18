// ✅ เปลี่ยนมาใช้ Import ที่เสถียรและเบากว่า
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export default async (request, context) => {
  // ตั้งค่า Header รอไว้เลย
  const headers = {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "X-Robots-Tag": "noindex" // Sitemap ไม่ควรถูก index หน้าเนื้อหา แต่ให้ Bot อ่าน
  };

  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    console.log("🤖 Sitemap generation started...");

    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
    
    // 1. เชื่อมต่อ Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 2. ดึงข้อมูล (ลดเหลือ 500 เพื่อป้องกัน Timeout บน Edge Function Free Tier)
    // เลือกเฉพาะ column ที่ใช้จริงๆ เพื่อลดขนาด memory
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('slug, name, imagePath, updated_at')
      .limit(500); 

    if (profileError) throw profileError;

    const { data: provinces } = await supabase
      .from('provinces')
      .select('key');

    console.log(`✅ Fetched: ${profiles?.length || 0} profiles`);

    // Helper escape function
    const esc = (unsafe) => unsafe ? unsafe.replace(/[<>&"']/g, (m) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"}[m])) : '';

    // 3. เริ่มสร้าง XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;

    // Loop Provinces
    if (provinces) {
        for (const p of provinces) {
            xml += `<url><loc>${DOMAIN}/location/${esc(p.key)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
    }

    // Loop Profiles
    if (profiles) {
        for (const p of profiles) {
            if (p.slug) {
                // เช็คว่ามีรูปไหม ถ้าไม่มีใช้รูป Default
                const imgUrl = p.imagePath 
                    ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${esc(p.imagePath)}` 
                    : `${DOMAIN}/images/default_og_image.jpg`;

                xml += `<url>
    <loc>${DOMAIN}/sideline/${esc(p.slug)}</loc>
    <lastmod>${p.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
        <image:loc>${imgUrl}</image:loc>
        <image:title>น้อง ${esc(p.name)}</image:title>
    </image:image>
</url>`;
            }
        }
    }

    xml += `</urlset>`;

    return new Response(xml, { headers });

  } catch (error) {
    // 🛑 Emergency Fallback: ถ้าพัง ให้ส่ง XML เปล่าๆ กลับไปแทน 500 (Google จะได้ไม่ด่า)
    console.error("❌ Sitemap Error:", error);
    
    const fallbackXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>
    <!-- System Recovery Mode: Please check logs -->
</urlset>`;

    return new Response(fallbackXML, { 
        status: 200, // ส่ง 200 OK เพื่อให้ Google ยอมรับไปก่อน
        headers 
    });
  }
};