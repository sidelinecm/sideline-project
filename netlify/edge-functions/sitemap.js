import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const DOMAIN = 'https://sidelinechiangmai.netlify.app';
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-images`;

// --- 2. HELPER FUNCTIONS ---
const escapeXml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;'; case '>': return '&gt;';
      case '&': return '&amp;'; case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// --- 🌟 REFINEMENT: สร้าง URL entry เป็นฟังก์ชันเพื่อลดโค้ดซ้ำ ---
const createUrlEntry = (loc, lastmod, changefreq, priority, imageXml = '') => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;

// --- 3. MAIN FUNCTION ---
export default async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 🚀 PERFORMANCE UPGRADE: เลือกเฉพาะคอลัมน์ที่ใช้จริงๆ ---
    // ใช้ updated_at ซึ่ง Supabase จัดการให้ จะแม่นยำกว่า
    const [{ data: profiles }, { data: provinces }] = await Promise.all([
      supabase
        .from('profiles')
        .select('slug, updated_at, imagePath, name') 
        .eq('status', 'active') // ควรกรองจาก status มากกว่า active
        .limit(5000), 
      supabase
        .from('provinces')
        .select('slug') // ใช้ slug แทน key เพื่อความสอดคล้อง
    ]);

    const sitemapEntries = [];

    // A. หน้าแรก (Home)
    sitemapEntries.push(createUrlEntry(`${DOMAIN}/`, new Date().toISOString(), 'daily', '1.0'));

    // B. หน้าทั่วไป (Static Pages)
    // --- 🌟 REFINEMENT: กรองเฉพาะหน้าที่มีอยู่จริง ---
    const staticPages = ['profiles', 'locations']; 
    staticPages.forEach(page => {
      sitemapEntries.push(createUrlEntry(`${DOMAIN}/${page}`, null, 'weekly', '0.7'));
    });

    // C. หน้าจังหวัด (Provinces)
    provinces?.forEach(p => {
      if (p.slug) {
        sitemapEntries.push(createUrlEntry(`${DOMAIN}/location/${encodeURIComponent(p.slug)}`, null, 'daily', '0.9'));
      }
    });

    // D. หน้าโปรไฟล์น้องๆ (Profiles)
    profiles?.forEach(p => {
      if (p.slug) {
        // --- 🚀 ROBUSTNESS UPGRADE: จัดการวันที่ให้ปลอดภัยขึ้น ---
        const lastMod = new Date(p.updated_at || Date.now()).toISOString();
        
        let imageXml = '';
        if (p.imagePath) {
          const imgUrl = p.imagePath.startsWith('http') 
            ? p.imagePath 
            : `${STORAGE_URL}/${p.imagePath}`;
          
          imageXml = `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(p.name || 'Sideline Profile')}</image:title>
    </image:image>`;
        }

        sitemapEntries.push(createUrlEntry(`${DOMAIN}/sideline/${encodeURIComponent(p.slug)}`, lastMod, 'daily', '0.8', imageXml));
      }
    });

    // สร้าง XML ทั้งหมด
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${sitemapEntries.join('')}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Netlify-CDN-Cache-Control": "public, max-age=86400, durable"
      }
    });

  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return new Response("Internal Server Error generating sitemap.", { status: 500 });
  }
};