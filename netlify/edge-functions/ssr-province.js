import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images'; // เพิ่ม Bucket name สำหรับดึงรูปภาพ

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /bot|spider|crawl|facebook|twitter|whatsapp/i.test(userAgent);

  if (!isBot) return context.next(); 

  try {
    const url = new URL(request.url);
    const provinceKey = decodeURIComponent(url.pathname.split('/').pop()); 

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: provinceData } = await supabase
      .from('provinces')
      .select('nameThai')
      .eq('key', provinceKey)
      .maybeSingle();

    if (!provinceData) return context.next();

    // ดึงข้อมูลโปรไฟล์พร้อมรูปภาพ (imagePath) เพื่อใช้กับ Open Graph
    const { data: profiles } = await supabase
      .from('profiles')
      .select('name, slug, imagePath')
      .eq('provinceKey', provinceKey)
      .limit(100);

    // --- ส่วนปรับปรุงเพื่อ SEO ที่ดีที่สุด ---
    const provinceName = provinceData.nameThai;
    const profileCount = profiles?.length || 0;
    const firstFewNames = profiles?.slice(0, 3).map(p => p.name).join(', ') || '';
    
    const siteUrl = url.origin; // ex: https://sidelinechiangmai.netlify.app
    const pageUrl = url.href;   // URL เต็มของหน้านี้

    // สร้าง Title
    const title = `ไซด์ไลน์${provinceName} - น้องๆ ${profileCount} คน รับงาน${provinceName} อัปเดตล่าสุด`;

    // สร้าง Meta Description
    const description = `รวมน้องๆ ไซด์ไลน์${provinceName} คัดพิเศษ รูปจริง ตรงปก 100% พบกับ ${firstFewNames} และอีกมากมาย บริการดี เป็นกันเอง จองคิวง่าย ไม่ต้องโอนมัดจำ`;

    // หารูปภาพสำหรับ Open Graph (ใช้รูปของคนแรก หรือรูปสำรอง)
    const ogImageUrl = profiles?.[0]?.imagePath 
      ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profiles[0].imagePath}`
      : `${siteUrl}/default-og-image.jpg`; // -- ควรสร้างรูป Default ไว้ --

    // สร้าง Structured Data (ItemList)
    const itemListElements = profiles?.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": p.name,
        "url": `${siteUrl}/sideline/${encodeURIComponent(p.slug)}`
      }
    })) || [];

    const listHtml = profiles?.map(p => {
      const safeSlug = encodeURIComponent(p.slug);
      return `<li><a href="/sideline/${safeSlug}">${p.name}</a></li>`;
    }).join('') || '<li>ไม่มีข้อมูล</li>';

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${pageUrl}">

  <!-- Open Graph / Facebook / LINE -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImageUrl}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${pageUrl}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${ogImageUrl}">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${title}",
    "description": "${description}",
    "url": "${pageUrl}",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": ${JSON.stringify(itemListElements)}
    }
  }
  </script>

</head>
<body>
  <h1>รายชื่อไซด์ไลน์ ${provinceName} (${profileCount} คน)</h1>
  <p>พบกับน้องๆ ไซด์ไลน์ที่คัดสรรมาอย่างดีในจังหวัด${provinceName} ทุกคนรูปจริง ตรงปก พร้อมให้บริการที่เป็นกันเอง</p>
  <ul>
    ${listHtml}
  </ul>
  <hr>
  <a href="/">🏠 กลับหน้าหลัก</a>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    console.error("SSR Province Error:", error);
    return context.next();
  }
};