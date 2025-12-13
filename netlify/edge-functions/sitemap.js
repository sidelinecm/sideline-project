// ✅ ใช้ Import แบบเจาะจงเวอร์ชัน เพื่อความเสถียรสูงสุดบน Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

export default async (request, context) => {
  // --- 1. CONFIGURATION (ฝังค่าตรงๆ เพื่อแก้ปัญหา 500 Error) ---
  const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

  // ฟังก์ชันป้องกัน XML พัง
  const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  try {
    console.log("Generating Sitemap..."); // Log เพื่อดูใน Netlify Dashboard

    // --- 2. เชื่อมต่อฐานข้อมูล ---
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 3. ดึงข้อมูล (แยกดึงทีละอย่าง เพื่อป้องกันพังทั้งหมด) ---
    let profiles = [];
    let provinces = [];

    // ดึง Profiles
    const { data: profilesData, error: profileError } = await supabase
      .from('profiles')
      .select('slug, created_at, lastUpdated, imagePath, name')
      .order('created_at', { ascending: false })
      .limit(2000); // ลดจำนวนลงนิดหน่อยเพื่อลดภาระ Server

    if (!profileError && profilesData) profiles = profilesData;
    else console.error("Profile Error:", profileError);

    // ดึง Provinces
    const { data: provincesData, error: provinceError } = await supabase
      .from('provinces')
      .select('key');

    if (!provinceError && provincesData) provinces = provincesData;
    else console.error("Province Error:", provinceError);

    // --- 4. สร้าง XML ---
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // A. หน้า Static
    const staticPages = ['', 'profiles.html', 'locations.html', 'about.html', 'faq.html', 'blog.html', 'privacy-policy.html'];
    staticPages.forEach(page => {
        const url = page === '' ? `${DOMAIN}/` : `${DOMAIN}/${page}`;
        xml += `<url><loc>${url}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
    });

    // B. หน้า Blog ย่อย
    ['blog/safety-tips.html', 'blog/nimman-feel-fan-guide.html', 'blog/what-is-trong-pok.html'].forEach(post => {
        xml += `<url><loc>${DOMAIN}/${post}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    });

    // C. หน้าจังหวัด
    provinces.forEach(p => {
        if (p.key) {
           xml += `<url><loc>${DOMAIN}/location/${encodeURIComponent(p.key)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
    });

    // D. หน้าโปรไฟล์
    profiles.forEach(p => {
        if (p.slug) {
            const dateStr = p.lastUpdated || p.created_at || new Date().toISOString();
            const cleanSlug = encodeURIComponent(p.slug);
            const cleanName = escapeXml(p.name);

            xml += `<url>`;
            xml += `<loc>${DOMAIN}/sideline/${cleanSlug}</loc>`;
            xml += `<lastmod>${new Date(dateStr).toISOString()}</lastmod>`;
            xml += `<changefreq>daily</changefreq>`;
            xml += `<priority>0.9</priority>`;
            
            if (p.imagePath) {
                const imgUrl = encodeURI(`${STORAGE_URL}/${p.imagePath}`);
                xml += `<image:image><image:loc>${escapeXml(imgUrl)}</image:loc><image:title>${cleanName}</image:title></image:image>`;
            }
            xml += `</url>`;
        }
    });

    xml += `</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
      }
    });

  } catch (error) {
    // ⚠️ EMERGENCY FALLBACK: ถ้าโค้ดพัง ให้ส่ง XML เปล่ากลับไป อย่าส่ง Error 500
    console.error("CRITICAL SITEMAP ERROR:", error);
    
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>
    </urlset>`;

    return new Response(fallbackXml, {
        status: 200, // ส่ง 200 OK เสมอ เพื่อให้ Google ไม่ด่า
        headers: { "Content-Type": "application/xml" }
    });
  }
};