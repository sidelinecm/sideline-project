/**
 * [ SYSTEM SITEMAP ENGINE - PRODUCTION FIXED ]
 * Project: First Model Hub - DYNAMIC SITEMAP GENERATOR
 * Fixes: Forced HTTPS Canonical Domain (Zero 301 Redirects for Googlebot)
 *        Strict ISO Dates & Clean XML Escaping
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
  SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
  CANONICAL_DOMAIN: 'https://firstmodelhub.com' // 🟢 บังคับใช้ HTTPS เสมอ แก้ปัญหา 301 Redirect
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

const safeGetIsoDate = (dateStr, fallbackIso) => {
  if (!dateStr) return fallbackIso;
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? fallbackIso : d.toISOString();
  } catch {
    return fallbackIso;
  }
};

export default async (request, context) => {
  try {
    const url = new URL(request.url);
    
    // 🟢 FIX 1: บังคับใช้ HTTPS เสมอ! ป้องกันการเกิด 301 Redirect (HTTP -> HTTPS)
    const domain = CONFIG.CANONICAL_DOMAIN;
    
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
        .select('key, updated_at')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    const nowIso = new Date().toISOString();

    // 1. หน้าแรกระดับประเทศ (Priority 1.0)
    xml += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // 2. หน้าหลักรวมน้องๆ (Priority 0.9)
    xml += `  <url>\n    <loc>${domain}/profiles</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // 3. หน้าพิกัดทุกจังหวัด (Priority 0.9)
    if (provinces && provinces.length > 0) {
      provinces.forEach(p => {
        if (p.key) {
          const cleanKey = p.key.trim().toLowerCase();
          const provDate = safeGetIsoDate(p.updated_at, nowIso);
          xml += `  <url>\n    <loc>${domain}/location/${encodeURIComponent(cleanKey)}</loc>\n    <lastmod>${provDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        }
      });
    }

    // 4. หน้าโปรไฟล์ส่วนตัวน้องๆ (Priority 0.8 + Image Sitemap)
    if (profiles && profiles.length > 0) {
      profiles.forEach(p => {
        if (p.slug) {
          const cleanSlug = p.slug.trim();
          const safeSlugUrl = `${domain}/sideline/${encodeURIComponent(cleanSlug)}`;
          const modDate = safeGetIsoDate(p.lastUpdated || p.created_at, nowIso);

          let imageXml = '';
          if (p.imagePath) {
            let imgUrl = p.imagePath.startsWith('http') 
              ? p.imagePath 
              : `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
            
            imageXml = `\n    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:title>รูปโปรไฟล์น้อง ${escapeXml(p.name || 'สาวสวย')}</image:title>\n    </image:image>`;
          }

          xml += `  <url>\n    <loc>${safeSlugUrl}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageXml}\n  </url>\n`;
        }
      });
    }

    // 5. หน้า Static หลักอื่นๆ
    const staticPages = ['locations', 'about', 'faq', 'terms-of-service', 'privacy-policy'];
    staticPages.forEach(page => {
      xml += `  <url>\n    <loc>${domain}/${page}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.4</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=7200"
      }
    });

  } catch (err) {
    console.error("Sitemap Generator Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};