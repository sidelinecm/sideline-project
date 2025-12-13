import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ฟังก์ชันแปลงตัวอักษรพิเศษ (ป้องกัน XML พัง)
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
  // Config
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';
  
  // Storage Bucket Config (อ้างอิงจากโค้ด main.js ของคุณ)
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. ดึงข้อมูล (เพิ่ม imagePath และ name)
    const [profilesRes, provincesRes] = await Promise.all([
        supabase.from('profiles')
          // ✅ ดึง imagePath และ name มาด้วย เพื่อเอาไปทำ Image Sitemap
          .select('slug, created_at, lastUpdated, imagePath, name') 
          .order('created_at', { ascending: false })
          .limit(10000), 
        supabase.from('provinces').select('key')
    ]);

    // ✅ เพิ่ม xmlns:image เพื่อบอก Google ว่าไฟล์นี้มีรูปภาพ
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // 2. หน้า Static Pages
    xml += `
    <url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
    <url><loc>${DOMAIN}/blog.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    <url><loc>${DOMAIN}/about.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    <url><loc>${DOMAIN}/faq.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    <url><loc>${DOMAIN}/profiles.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    <url><loc>${DOMAIN}/locations.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    `;

    // 3. หน้าจังหวัด
    if (provincesRes.data) {
      provincesRes.data.forEach(p => {
        if (p.key) {
           const cleanKey = encodeURIComponent(p.key);
           xml += `<url><loc>${DOMAIN}/location/${cleanKey}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
      });
    }

    // 4. หน้าโปรไฟล์ + รูปภาพ (จุดสำคัญ)
    if (profilesRes.data) {
      profilesRes.data.forEach(p => {
        if (p.slug) {
            const rawDate = p.lastUpdated || p.created_at || new Date().toISOString();
            const lastMod = new Date(rawDate).toISOString();
            const cleanSlug = encodeURIComponent(p.slug); // แปลงชื่อไทยใน URL
            const cleanName = escapeXml(p.name); // แปลงชื่อน้องสำหรับ Title รูป

            xml += `<url>`;
            xml += `<loc>${DOMAIN}/sideline/${cleanSlug}</loc>`;
            xml += `<lastmod>${lastMod}</lastmod>`;
            xml += `<changefreq>daily</changefreq>`;
            xml += `<priority>0.9</priority>`;

            // ✅ ส่วนเพิ่มรูปภาพ
            if (p.imagePath) {
                // สร้างลิงก์รูปภาพเต็มๆ
                // encodeURI จำเป็นเผื่อชื่อไฟล์รูปมีเว้นวรรคหรือภาษาไทย
                const fullImageUrl = encodeURI(`${STORAGE_URL}/${p.imagePath}`);
                
                xml += `
                <image:image>
                    <image:loc>${escapeXml(fullImageUrl)}</image:loc>
                    <image:title>${cleanName}</image:title>
                </image:image>`;
            }

            xml += `</url>`;
        }
      });
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache 12 ชม. (กำลังดีสำหรับเว็บที่มีรูปภาพ)
        "Cache-Control": "public, max-age=43200, must-revalidate", 
      }
    });

  } catch (error) {
    console.error("Sitemap Error:", error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
        headers: { "Content-Type": "application/xml" }
    });
  }
};