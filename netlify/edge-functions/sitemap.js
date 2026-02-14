// --- FILE: sitemap.js ---
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
};

// Helper สำหรับ escape XML
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

        // ดึงข้อมูล (Limit เพื่อไม่ให้ Timeout หากข้อมูลเยอะเกินไป)
        const [{ data: profiles }, { data: provinces }] = await Promise.all([
            supabase
                .from('profiles')
                .select('slug, lastUpdated, created_at, imagePath, name')
                .eq('active', true)
                .order('created_at', { ascending: false })
                .limit(2000), // เพิ่ม Limit ป้องกัน Edge Function Timeout
            supabase
                .from('provinces')
                .select('key')
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

        // 1. หน้าแรก (แก้บั๊ก dateStr)
        const today = new Date().toISOString();
        xml += `
<url>
  <loc>${CONFIG.DOMAIN}/</loc>
  <lastmod>${today}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>`;

        // 2. Static pages
        ['contact', 'faq', 'blog'].forEach(page => {
            xml += `
<url>
  <loc>${CONFIG.DOMAIN}/${page}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`;
        });

        // 3. จังหวัด
        if (provinces) {
            provinces.forEach(p => {
                if (p.key) {
                    xml += `
<url>
  <loc>${CONFIG.DOMAIN}/location/${encodeURIComponent(p.key)}</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>`;
                }
            });
        }

        // 4. โปรไฟล์
        if (profiles) {
            profiles.forEach(p => {
                if (p.slug) {
                    const safeSlug = encodeURIComponent(p.slug.trim());
                    // ใช้ lastUpdated ก่อน ถ้าไม่มีใช้ created_at ถ้าไม่มีใช้วันปัจจุบัน
                    const dateStr = p.lastUpdated || p.created_at || today;
                    const modDate = new Date(dateStr).toISOString();

                    let imageXml = '';
                    if (p.imagePath) {
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
                "Cache-Control": "public, max-age=3600",
                "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
            }
        });

    } catch (err) {
        console.error("Error generating sitemap:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
};