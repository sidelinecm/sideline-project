// = a================================================================
// FILE: ssr-province.js (ฉบับสมบูรณ์แบบขั้นสูงสุด - The Ultimate Edition)
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const BRAND_NAME = "Sideline Chiangmai";
const BRAND_URL = "https://sidelinechiangmai.netlify.app/"; // ใส่ URL เว็บไซต์หลักของคุณ
const DEFAULT_OG_IMAGE = "hero-sidelinechiangmai-1200.webp"; // ใส่ URL รูปภาพหลักสำหรับหน้ารวม

// ✅ [ULTIMATE] ฟังก์ชันสร้าง JSON-LD สำหรับหน้ารายการ (CollectionPage)
const createProvinceJsonLd = (provinceName, profiles, pageUrl) => {
  const itemListElements = profiles.map((profile, index) => {
    return {
      "@type": "ListItem",
      "position": index + 1, // ตำแหน่งเริ่มต้นที่ 1
      "item": {
        "@type": "Person",
        "name": `น้อง${profile.name}`,
        "url": `${BRAND_URL}/sideline/${encodeURIComponent(profile.slug)}` // URL เต็มของโปรไฟล์
      }
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage", // ระบุว่านี่คือ "หน้าคอลเลกชัน"
    "name": `ไซด์ไลน์${provinceName} (${profiles.length} คน) | ${BRAND_NAME}`,
    "url": pageUrl.href,
    "description": `รวมน้องๆ ไซด์ไลน์${provinceName}เกรดพรีเมียมกว่า ${profiles.length} คน อัปเดตล่าสุด. ค้นหาและดูโปรไฟล์ได้ทันที`,
    "mainEntity": {
      "@type": "ItemList", // สิ่งสำคัญในหน้านี้คือ "รายการ"
      "numberOfItems": profiles.length,
      "itemListElement": itemListElements
    }
  };
  
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
};

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /bot|spider|crawl|facebook|twitter|whatsapp/i.test(userAgent);

  if (!isBot) return context.next(); 

  try {
    const url = new URL(request.url);
    const provinceKey = decodeURIComponent(url.pathname.split('/').pop()); 
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: provinceData } = await supabase
      .from('provinces').select('nameThai').eq('key', provinceKey).maybeSingle();

    if (!provinceData) return context.next();

    const { data: profiles } = await supabase
      .from('profiles').select('name, slug').eq('provinceKey', provinceKey).limit(100);

    const provinceName = provinceData.nameThai;
    const profileCount = profiles ? profiles.length : 0;

    // 1. สร้าง Title & Description ที่ดีที่สุด
    const title = `ไซด์ไลน์${provinceName} (${profileCount} คน) อัปเดตล่าสุด | ${BRAND_NAME}`;
    const description = `รวมน้องๆ ไซด์ไลน์${provinceName}เกรดพรีเมียมกว่า ${profileCount} คน. ค้นหาน้องๆ ที่รับงานในพื้นที่${provinceName}ได้ทันที พร้อมรีวิวและข้อมูลติดต่อ`;
    
    // 2. สร้าง JSON-LD ขั้นสูงสุด
    const jsonLd = createProvinceJsonLd(provinceName, profiles || [], url);

    // 3. สร้าง HTML รายการสำหรับแสดงผล
    const listHtml = profiles?.map(p => {
      const safeSlug = encodeURIComponent(p.slug);
      return `<li><a href="/sideline/${safeSlug}">น้อง${p.name}</a></li>`;
    }).join('') || '<li>ไม่มีข้อมูลในขณะนี้</li>';

    const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Technical SEO -->
  <link rel="canonical" href="${url.href}" />

  <!-- Social Media SEO: Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
  <meta property="og:url" content="${url.href}">
  <meta property="og:site_name" content="${BRAND_NAME}">
  <meta property="og:type" content="website">

  <!-- Social Media SEO: Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">

  <!-- พิมพ์เขียวสำหรับ GOOGLE (JSON-LD) -->
  ${jsonLd}

  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 20px; color: #333; }
    h1 { color: #111; }
    ul { list-style-type: none; padding: 0; }
    li a { display: block; padding: 12px 15px; margin-bottom: 8px; background-color: #f9f9f9; border-radius: 8px; text-decoration: none; color: #007bff; }
    li a:hover { background-color: #eef; }
  </style>
</head>
<body>
  <header>
    <h1>${title}</h1>
  </header>
  
  <main>
    <p>${description}</p>
    <h2>รายชื่อน้องๆ ใน${provinceName}</h2>
    <ul>
      ${listHtml}
    </ul>
  </main>
  
  <footer>
    <hr>
    <a href="/">🏠 กลับหน้าหลัก ${BRAND_NAME}</a>
  </footer>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    console.error("SSR Province Ultimate Error:", error);
    return context.next();
  }
};