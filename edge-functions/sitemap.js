import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
};

// ฟังก์ชันป้องกันตัวอักษรพิเศษใน XML
const escapeXml = (unsafe) => {
    if (!unsafe || typeof unsafe !== 'string') return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '\"': return '&quot;';
            default: return c;
        }
    });
};

export default async () => {
    try {
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

        // ดึงข้อมูลโปรไฟล์และจังหวัด (ดึง lastUpdated เพื่อใช้ระบุวันอัปเดตล่าสุด)
        const [{ data: profiles }, { data: provinces }] = await Promise.all([
            supabase
                .from('profiles')
                .select('slug, lastUpdated, created_at, imagePath, name')
                .eq('active', true)
                .order('lastUpdated', { ascending: false })
                .limit(2000), 
            supabase
                .from('provinces')
                .select('key')
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

        const today = new Date().toISOString();

        // 1. หน้าแรก
        xml += `
<url>
  <loc>${CONFIG.DOMAIN}/</loc>
  <lastmod>${today}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>`;

        // 2. หน้า Static Pages ยอดนิยม
        ['blog', 'contact', 'faq'].forEach(page => {
            xml += `
<url>
  <loc>${CONFIG.DOMAIN}/${page}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.5</priority>
</url>`;
        });

        // 3. หน้าจังหวัด (Location Pages)
        if (provinces) {
            provinces.forEach(p => {
                if (p.key) {
                    xml += `
<url>
  <loc>${CONFIG.DOMAIN}/location/${encodeURIComponent(p.key)}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>`;
                }
            });
        }

        // 4. หน้าโปรไฟล์ (Profile Pages) พร้อมข้อมูลรูปภาพ
        if (profiles) {
            profiles.forEach(p => {
                if (p.slug) {
                    const safeSlug = encodeURIComponent(p.slug.trim());
                    // ใช้วันอัปเดตล่าสุดจริงจาก DB
                    const dateStr = p.lastUpdated || p.created_at || today;
                    const modDate = new Date(dateStr).toISOString();

                    let imageXml = '';
                    if (p.imagePath) {
                        // ระบบรูปภาพ Hybrid
                        let imgUrl = p.imagePath.startsWith('http') 
                            ? p.imagePath 
                            : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
                        
                        imageXml = `
    <image:image>
        <image:loc>${escapeXml(imgUrl)}</image:loc>
        <image:title>${escapeXml(p.name)}</image:title>
    </image:image>`;
                    }

                    xml += `
<url>
  <loc>${CONFIG.DOMAIN}/sideline/${safeSlug}</loc>
  <lastmod>${modDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>${imageXml}
</url>`;
                }
            });
        }

        xml += `\n</urlset>`;

        return new Response(xml, {
            headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "public, max-age=3600"
            }
        });

    } catch (err) {
        console.error("Sitemap Generator Error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
};