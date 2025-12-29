// =================================================================
// FILE: render-bot.js (ฉบับสมบูรณ์แบบขั้นสูงสุด - The Ultimate Edition)
// =================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const STORAGE_BUCKET = 'profile-images';
const BRAND_NAME = "Sideline Chiangmai"; // กำหนดชื่อแบรนด์/เว็บไซต์
const BRAND_URL = "https://sidelinechiangmai.netlify.app/"; // ใส่ URL เว็บไซต์หลักของคุณ

// ✅ [ULTIMATE] ฟังก์ชันสร้าง JSON-LD ที่ละเอียดและเชื่อมโยงข้อมูลสมบูรณ์ที่สุด
const createUltimateJsonLd = (profile, imageUrl, pageUrl) => {
  const provinceName = profile.provinces?.nameThai || 'ไม่ระบุ';
  const location = profile.location || provinceName;
  const title = `น้อง${profile.name} - ไซด์ไลน์${location}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [ // ใช้ @graph เพื่อเชื่อมโยงข้อมูลหลายส่วนเข้าด้วยกัน
      {
        "@type": "Person",
        "@id": `${pageUrl.href}#person`, // สร้าง ID ให้กับบุคคลนี้
        "name": `น้อง${profile.name}`,
        "url": pageUrl.href,
        "jobTitle": `ไซด์ไลน์ ${provinceName}`,
        "description": profile.description || `ติดต่อ น้อง${profile.name} (${profile.age || 'ไม่ระบุ'} ปี) ไซด์ไลน์${provinceName}. ${profile.quote || 'บริการดี เป็นกันเอง.'}`,
        "image": {
          "@id": `${pageUrl.href}#image` // เชื่อมโยงไปยัง ImageObject
        },
        "worksFor": {
          "@id": `${BRAND_URL}#organization` // เชื่อมโยงไปยังองค์กร
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location,
          "addressRegion": provinceName,
          "addressCountry": "TH"
        }
      },
      {
        "@type": "ImageObject",
        "@id": `${pageUrl.href}#image`,
        "url": imageUrl,
        "caption": title,
        "representativeOfPage": "True"
      },
      {
        "@type": "WebSite",
        "@id": `${BRAND_URL}#website`,
        "url": BRAND_URL,
        "name": BRAND_NAME
      },
      {
        "@type": "Organization",
        "@id": `${BRAND_URL}#organization`,
        "name": BRAND_NAME,
        "url": BRAND_URL
      }
    ]
  };

  // เพิ่มข้อมูลคะแนนรีวิว (AggregateRating) เข้าไปใน Person Schema ถ้ามี
  if (profile.rating && profile.reviewCount) {
    schema["@graph"][0].aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": profile.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": profile.reviewCount
    };
  }

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
};

export default async (request, context) => {
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|discordbot|whatsapp|linkedinbot/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    const url = new URL(request.url);
    const slug = decodeURIComponent(url.pathname.split('/').pop());
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ดึงข้อมูลที่จำเป็น: rating, reviewCount
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai)')
      .eq('slug', slug)
      .maybeSingle();

    if (!profile) return context.next();
    
    const provinceName = profile.provinces?.nameThai || 'จังหวัด';
    const location = profile.location || provinceName;
    
    // 1. สร้าง Title & Description ที่คมคายที่สุด
    const title = `น้อง${profile.name} (${profile.age}) ไซด์ไลน์${provinceName} รับงาน${location} | ${BRAND_NAME}`;
    const styleTagsText = (profile.styleTags && profile.styleTags.length > 0) ? ` สไตล์: ${profile.styleTags.join(', ')}.` : '';
    const description = `ติดต่อ น้อง${profile.name}, ${profile.age} ปี. ไซด์ไลน์${provinceName} เกรดพรีเมียม. ${styleTagsText} สัดส่วน ${profile.stats || 'สอบถาม'}. ${profile.quote || 'บริการประทับใจ.'} ดูรูปและข้อมูลติดต่อที่นี่.`;
    
    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`;

    // 2. สร้าง JSON-LD ขั้นสูงสุด
    const jsonLd = createUltimateJsonLd(profile, imageUrl, url);

    const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- 3. Technical SEO: Canonical URL -->
  <link rel="canonical" href="${url.href}" />
  
  <!-- 4. Social Media SEO: Open Graph (Facebook, WhatsApp, etc.) -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${url.href}">
  <meta property="og:site_name" content="${BRAND_NAME}">
  <meta property="og:type" content="profile">
  <meta property="profile:first_name" content="${profile.name}">

  <!-- 5. Social Media SEO: Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- 6. พิมพ์เขียวสำหรับ GOOGLE (JSON-LD) -->
  ${jsonLd}

  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 20px; color: #333; }
    img.profile-image { display: block; max-width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px; }
    h1, h2 { color: #111; }
    .details { background-color: #f9f9f9; padding: 15px; border-radius: 8px; }
    .details p { margin: 10px 0; }
  </style>
</head>
<body>
  <header>
    <!-- 7. Semantic HTML: H1 หนึ่งเดียวและสำคัญที่สุด -->
    <h1>${title}</h1>
  </header>
  
  <main>
    <img src="${imageUrl}" class="profile-image" alt="รูปโปรไฟล์ของ ${title}">
    
    <section class="details">
      <h2>ข้อมูลเบื้องต้น</h2>
      <p><b>ชื่อ:</b> น้อง${profile.name}</p>
      <p><b>อายุ:</b> ${profile.age || 'ไม่ระบุ'} ปี</p>
      <p><b>พิกัด:</b> ${location}, ${provinceName}</p>
      <p><b>ราคา:</b> ${profile.rate || 'สอบถามโดยตรง'}</p>
      <p><b>สัดส่วน:</b> ${profile.stats || 'สอบถามโดยตรง'}</p>
    </section>
    
    <section>
      <h2>เกี่ยวกับน้อง</h2>
      <p>${profile.description || 'สามารถสอบถามรายละเอียดเพิ่มเติมได้โดยตรงค่ะ'}</p>
    </section>
  </main>
  
  <footer>
    <hr>
    <a href="/">กลับสู่หน้าหลักของ ${BRAND_NAME}</a>
  </footer>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    console.error("Render-Bot Ultimate Error:", error);
    return context.next();
  }
};