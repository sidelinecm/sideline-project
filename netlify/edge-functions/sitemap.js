import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export default async (request, context) => {
  const headers = {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "X-Robots-Tag": "noindex"
  };

  const DOMAIN = 'https://sidelinechiangmai.netlify.app';

  try {
    console.log("🤖 Sitemap generation started...");

    const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 🔥 แก้จุดที่ 1: เปลี่ยน updated_at -> created_at
    // (เพราะ Database คุณไม่มี updated_at โปรแกรมเลย Error)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('slug, name, imagePath, created_at') 
      .limit(500); 

    if (profileError) throw profileError;

    const { data: provinces } = await supabase.from('provinces').select('key');

    const esc = (unsafe) => unsafe ? unsafe.replace(/[<>&"']/g, (m) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"}[m])) : '';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;

    if (provinces) {
        for (const p of provinces) {
            xml += `<url><loc>${DOMAIN}/location/${esc(p.key)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
    }

    if (profiles) {
        for (const p of profiles) {
            if (p.slug) {
                const imgUrl = p.imagePath 
                    ? `${SUPABASE_URL}/storage/v1/object/public/profile-images/${esc(p.imagePath)}` 
                    : `${DOMAIN}/images/default_og_image.jpg`;

                // 🔥 แก้จุดที่ 2: ใช้ created_at มาเป็นวันที่อัปเดตแทน
                const dateStr = p.created_at || new Date().toISOString();

                xml += `<url>
    <loc>${DOMAIN}/sideline/${esc(p.slug)}</loc>
    <lastmod>${dateStr}</lastmod>
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
    console.error("❌ Sitemap Error:", error);
    
    // Fallback: ถ้ายัง Error อีก ให้ส่ง XML ว่างๆ ไปก่อน เว็บจะได้ไม่ล่ม
    const fallbackXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>
</urlset>`;

    return new Response(fallbackXML, { 
        status: 200, 
        headers 
    });
  }
};