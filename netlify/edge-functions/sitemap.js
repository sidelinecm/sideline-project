

/**
 * [ SYSTEM SITEMAP ENGINE ]
 * Project: First Model Hub - DYNAMIC SITEMAP GENERATOR
 * Authority: Dynamic Domain Extraction, Strict XML Formatting & Image Indexing
 * Optimization: ISO Time Parsing Safe-guard, Automated Chiang Mai Redirect Skipping
 * Security: Canonical Fallback Override & Case-Sensitive Province Matching
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    CANONICAL_DOMAIN: 'https://firstmodelhub.com'
};

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

const safeGetIsoDate = (dateStr, fallbackToday) => {
    if (!dateStr) return fallbackToday;
    try {
        return new Date(dateStr).toISOString();
    } catch {
        return fallbackToday;
    }
};

export default async (request, context) => {
    try {
        const url = new URL(request.url);
        let dynamicDomain = `${url.protocol}//${url.host}`; 
        if (!dynamicDomain.includes('firstmodelhub.com') && !dynamicDomain.includes('localhost')) {
            dynamicDomain = CONFIG.CANONICAL_DOMAIN;
        }
        
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

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

        // 1. หน้าแรกระดับประเทศ
        xml += `
<url>
  <loc>${dynamicDomain}/</loc>
  <lastmod>${today}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>`;

        // 2. หน้า Static Pages หลัก
        const staticPages = ['profiles', 'locations', 'about', 'faq', 'terms-of-service', 'privacy-policy'];
        staticPages.forEach(page => {
            xml += `
<url>
  <loc>${dynamicDomain}/${page}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.5</priority>
</url>`;
        });

        // 3. หน้าพิกัดทุกจังหวัด (รวมถึง chiangmai ด้วย)
        if (provinces) {
            provinces.forEach(p => {
                if (p.key) {
                    const originalKey = p.key.trim();
                    xml += `
<url>
  <loc>${dynamicDomain}/location/${encodeURIComponent(originalKey)}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>`;
                }
            });
        }

        // 4. หน้าโปรไฟล์ส่วนตัวน้องๆ
        if (profiles) {
            profiles.forEach(p => {
                if (p.slug) {
                    const safeSlug = encodeURIComponent(p.slug.trim());
                    const rawDate = p.lastUpdated || p.created_at || today;
                    const modDate = safeGetIsoDate(rawDate, today);

                    let imageXml = '';
                    if (p.imagePath) {
                        let imgUrl = p.imagePath.startsWith('http') 
                            ? p.imagePath 
                            : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
                        
                        imageXml = `
    <image:image>
        <image:loc>${escapeXml(imgUrl)}</image:loc>
        <image:title>รูปโปรไฟล์น้อง ${escapeXml(p.name)}</image:title>
    </image:image>`;
                    }

                    xml += `
<url>
  <loc>${dynamicDomain}/sideline/${safeSlug}</loc>
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