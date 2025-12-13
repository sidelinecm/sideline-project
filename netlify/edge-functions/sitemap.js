import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ฟังก์ชันแปลงตัวอักษรพิเศษ (ป้องกัน Sitemap พัง)
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
  // --- 1. ตั้งค่า (Configuration) ---
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
  const DOMAIN = 'https://sidelinechiangmai.netlify.app';
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 2. ดึงข้อมูลจาก Database (Dynamic Data) ---
    // ดึง 10,000 รายการล่าสุด เพื่อให้ครอบคลุมน้องๆ ทุกคน
    const [profilesRes, provincesRes] = await Promise.all([
        supabase.from('profiles')
          .select('slug, created_at, lastUpdated, imagePath, name') 
          .order('created_at', { ascending: false })
          .limit(10000), 
        supabase.from('provinces').select('key')
    ]);

    // เริ่มต้นเขียน XML Header
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // --- 3. หน้า Static หลัก (Main Pages) ---
    // รายชื่อหน้าเว็บที่มีไฟล์จริง (อ้างอิงจากไฟล์ที่คุณส่งมา)
    const staticPages = [
        '',                     // หน้าแรก (Home)
        'profiles.html',        // รวมน้องๆ
        'locations.html',       // พิกัด
        'about.html',           // เกี่ยวกับเรา
        'faq.html',             // คำถามพบบ่อย
        'blog.html',            // หน้ารวมบทความ
        'privacy-policy.html'   // นโยบายความเป็นส่วนตัว
    ];

    staticPages.forEach(page => {
        const priority = page === '' ? '1.0' : '0.8';
        const changeFreq = page === '' ? 'daily' : 'weekly';
        // สร้าง URL (ถ้าเป็นหน้าแรกไม่ต้องมี / ต่อท้าย)
        const url = page === '' ? `${DOMAIN}/` : `${DOMAIN}/${page}`;
        
        xml += `
        <url>
            <loc>${url}</loc>
            <changefreq>${changeFreq}</changefreq>
            <priority>${priority}</priority>
        </url>`;
    });

    // --- 4. หน้าบทความย่อย (Blog Posts) ---
    // 3 หน้าที่คุณระบุมา (อ้างอิงจาก href ในไฟล์ blog.html)
    const blogPosts = [
        'blog/safety-tips.html',
        'blog/nimman-feel-fan-guide.html',
        'blog/what-is-trong-pok.html'
    ];

    blogPosts.forEach(post => {
        xml += `
        <url>
            <loc>${DOMAIN}/${post}</loc>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
        </url>`;
    });

    // --- 5. หน้าจังหวัด (Dynamic Locations) ---
    if (provincesRes.data) {
      provincesRes.data.forEach(p => {
        if (p.key) {
           const cleanKey = encodeURIComponent(p.key);
           xml += `
           <url>
                <loc>${DOMAIN}/location/${cleanKey}</loc>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
           </url>`;
        }
      });
    }

    // --- 6. หน้าโปรไฟล์น้องๆ (Dynamic Profiles + Images) ---
    if (profilesRes.data) {
      profilesRes.data.forEach(p => {
        if (p.slug) {
            // คำนวณวันที่ล่าสุด
            const rawDate = p.lastUpdated || p.created_at || new Date().toISOString();
            const lastMod = new Date(rawDate).toISOString();
            
            // แปลงชื่อไทยใน URL ให้ถูกต้อง (Encode)
            const cleanSlug = encodeURIComponent(p.slug);
            const cleanName = escapeXml(p.name);

            xml += `<url>`;
            xml += `<loc>${DOMAIN}/sideline/${cleanSlug}</loc>`;
            xml += `<lastmod>${lastMod}</lastmod>`;
            xml += `<changefreq>daily</changefreq>`;
            xml += `<priority>0.9</priority>`;

            // ใส่รูปภาพ (Image Object) - ช่วย SEO ค้นหารูป
            if (p.imagePath) {
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

    // ส่งค่ากลับเป็น XML
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache ไว้ 12 ชม. เพื่อไม่ให้โหลด Database หนักเกินไป
        "Cache-Control": "public, max-age=43200, must-revalidate", 
        "Netlify-CDN-Cache-Control": "public, max-age=43200, durable"
      }
    });

  } catch (error) {
    console.error("Sitemap Error:", error);
    // กรณีฉุกเฉิน: ส่ง XML เปล่ากลับไป ดีกว่าเว็บพัง
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
        headers: { "Content-Type": "application/xml" }
    });
  }
};