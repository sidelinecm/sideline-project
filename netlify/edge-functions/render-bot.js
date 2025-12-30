import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- CONFIGURATION ---
// ตรวจสอบ Key ให้ถูกต้อง (ใช้ Key ที่คุณส่งมาให้ก่อนหน้านี้)
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const STORAGE_BUCKET = 'profile-images';
const SITE_DOMAIN = 'https://sidelinechiangmai.netlify.app';

export default async (request, context) => {
  // 1. 🛡️ Bot Detection (ตรวจสอบว่าเป็น Bot หรือไม่)
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|discordbot|whatsapp|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest|skypeuripreview/i.test(userAgent);

  // ถ้าไม่ใช่ Bot -> ปล่อยให้ไปโหลดหน้าเว็บปกติ (Client-Side Rendering)
  if (!isBot) return context.next();

  try {
    // 2. 🔗 URL Parsing
    const url = new URL(request.url);
    const slug = decodeURIComponent(url.pathname.split('/').pop()); // ถอดรหัสภาษาไทยจาก URL

    // เชื่อมต่อ Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ดึงข้อมูล Profile และชื่อจังหวัด
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai)')
      .eq('slug', slug)
      .maybeSingle();

    // ถ้าหาไม่เจอ หรือ Database มีปัญหา -> ปล่อยให้ Client จัดการ (ไม่ให้เว็บล่ม)
    if (error || !profile) return context.next();

    // 3. 🛡️ Bulletproof Data Extraction (กันข้อมูลแหว่ง/Error)
    const pName = profile.name || 'สาวสวย';
    
    // ตรวจสอบจังหวัด (กันตาย กรณี Supabase ส่งมาเป็น Array หรือ Object)
    let pProv = 'เชียงใหม่';
    if (profile.provinces) {
      if (Array.isArray(profile.provinces)) {
         pProv = profile.provinces[0]?.nameThai || 'เชียงใหม่';
      } else {
         pProv = profile.provinces?.nameThai || 'เชียงใหม่';
      }
    }
    
    const pLoc = profile.location || pProv; 
    const pAge = profile.age ? `${profile.age} ปี` : 'วัยรุ่น';
    const pPrice = profile.rate ? `${profile.rate}` : 'สอบถาม'; // แปลงเป็น String เสมอ

    // 4. 🧠 Dynamic SEO Content (สุ่มคำเพื่อไม่ให้ซ้ำ)
    const jobTypes = ['ไซด์ไลน์', 'รับงาน N', 'งาน En', 'SL', 'เด็กเอน', 'เพื่อนเที่ยว', 'น้องรับงาน', 'Part-time'];
    const adjectives = ['ตรงปก100%', 'ตัวจริงสวยมาก', 'งานดีไม่เร่ง', 'ฟีลแฟน', 'ขี้อ้อน', 'รับงานเอง', 'ไม่ผ่านเอเจนซี่', 'คัดเกรด A'];
    const actions = ['นัดเจอ', 'หาคนดูแล', 'รับงาน', 'พิกัด', 'จ้างเที่ยว', 'หาเพื่อนทานข้าว'];
    
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // สร้าง Title (หัวข้อ)
    const title = `น้อง${pName} ${rand(jobTypes)} ${pProv} (${pLoc}) - ${rand(adjectives)} เริ่ม ${pPrice} | Sideline Chiangmai`;

    // สร้าง Description (คำบรรยาย)
    const description = `
      ${rand(actions)}${pProv} โซน${pLoc} น้อง${pName} อายุ ${pAge}. 
      ${profile.stats ? `สัดส่วน ${profile.stats}.` : ''} 
      ${profile.description ? profile.description.substring(0, 100).replace(/["\n]/g, '') : 'นิสัยน่ารัก คุยเก่ง งานดี'}. 
      ${rand(adjectives)}. รับงานเอง ปลอดภัย. 
      ${rand(jobTypes)} ${pProv} หาพี่ดูแล ทักไลน์จองคิวได้เลย
    `.replace(/\s+/g, ' ').trim();

    // สร้าง URL รูปภาพ
    const imageUrl = profile.imagePath.startsWith('http') 
      ? profile.imagePath 
      : `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profile.imagePath}`;
    
    const pageUrl = `${SITE_DOMAIN}/sideline/${slug}`;

    // 5. ⭐ JSON-LD Schema (หัวใจสำคัญของดาว)
    // ใช้ type "Product" เพื่อกระตุ้นให้ Google แสดงดาว
    const priceValue = profile.rate ? profile.rate.toString().replace(/[^0-9]/g, '') : '1500';
    
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": `บริการน้อง ${pName} ${pProv}`,
      "image": imageUrl,
      "description": description,
      "brand": {
        "@type": "Brand",
        "name": "Sideline Chiangmai"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "128" 
      },
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "THB",
        "price": priceValue || "1500",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };

    // 6. 🚀 สร้าง HTML Response
    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${pageUrl}">
  <meta name="robots" content="index, follow, max-image-preview:large">

  <!-- Open Graph (Facebook/Line/Twitter) -->
  <meta property="og:site_name" content="Sideline Chiangmai">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="800">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="th_TH">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- ✅ SCHEMA INJECTION ✅ -->
  <script type="application/ld+json">
    ${JSON.stringify(schemaData)}
  </script>

  <style>
    /* CSS สำหรับ Bot และหน้า Preview */
    :root { --primary: #ec4899; --text: #1f2937; --bg: #fdf2f8; }
    body { font-family: 'Prompt', -apple-system, sans-serif; margin: 0; line-height: 1.6; background: var(--bg); color: var(--text); }
    .container { max-width: 480px; margin: 0 auto; background: #fff; min-height: 100vh; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
    .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
    .content { padding: 24px; }
    h1 { color: var(--primary); margin: 0 0 10px 0; font-size: 22px; line-height: 1.3; }
    .rating-badge { display: inline-flex; align-items: center; background: #fffbeb; color: #b45309; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-bottom: 16px; border: 1px solid #fcd34d; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .meta-item { background: #f3f4f6; padding: 10px; border-radius: 8px; font-size: 14px; }
    .meta-label { color: #6b7280; font-size: 12px; display: block; }
    .meta-val { font-weight: 600; color: #111; }
    .desc-box { background: #fdf2f8; padding: 16px; border-radius: 12px; color: #4b5563; font-size: 15px; margin-bottom: 24px; border: 1px dashed #fbcfe8; }
    .cta-btn { display: block; background: #06c755; color: #fff; text-align: center; padding: 16px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(6, 199, 85, 0.3); transition: transform 0.2s; }
    .footer-link { text-align: center; margin-top: 30px; padding-bottom: 30px; font-size: 14px; }
    .footer-link a { color: var(--primary); text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${imageUrl}" alt="${title}" class="hero-img">
    <div class="content">
      <h1>${title}</h1>
      
      <!-- ⭐ Visual Rating (แสดงให้ตรงกับ Schema ป้องกันโดนแบน) -->
      <div class="rating-badge">
        <span>⭐⭐⭐⭐⭐ 4.9 (128 รีวิว)</span>
      </div>

      <div class="meta-grid">
        <div class="meta-item"><span class="meta-label">💰 ราคาเริ่มต้น</span><span class="meta-val">${pPrice}</span></div>
        <div class="meta-item"><span class="meta-label">📍 พิกัด</span><span class="meta-val">${pLoc}</span></div>
        <div class="meta-item"><span class="meta-label">📏 สัดส่วน</span><span class="meta-val">${profile.stats || '-'}</span></div>
        <div class="meta-item"><span class="meta-label">🎂 อายุ</span><span class="meta-val">${pAge}</span></div>
      </div>

      <div class="desc-box">"${profile.description || 'ทักมาคุยรายละเอียดกันก่อนได้นะคะ'}"</div>

      <a href="https://line.me/ti/p/${profile.lineId || ''}" class="cta-btn">📲 แอดไลน์จองคิว</a>

      <div class="footer-link"><a href="/">🏠 กลับสู่หน้าหลัก Sideline Chiangmai</a></div>
    </div>
  </div>
</body>
</html>`;

    // 7. ส่ง Response กลับไปให้ Bot (พร้อม Cache)
    return new Response(html, {
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Netlify-CDN-Cache-Control": "public, s-maxage=86400", // Cache ที่ CDN 24 ชม. (เร็วมาก)
        "Cache-Control": "public, max-age=3600" // Cache ที่ Google 1 ชม.
      }
    });

  } catch (error) {
    // 🚨 Fail-Safe: ถ้ามี Error ใดๆ ก็ตาม ให้ข้ามไปโหลดหน้าเว็บปกติทันที
    console.error('Edge Function Error:', error);
    return context.next();
  }
};