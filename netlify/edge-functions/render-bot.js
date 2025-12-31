import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8';
const STORAGE_BUCKET = 'profile-images';
const SITE_DOMAIN = 'https://sidelinechiangmai.netlify.app';

// ฟังก์ชันสุ่มตัวเลขแบบคงที่ (Stable Random)
function getStableRandom(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default async (request, context) => {
  // 1. 🛡️ Bot Detection
  const userAgent = request.headers.get('User-Agent') || '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|discordbot|whatsapp|linkedinbot|embedly|quora\ link\ preview|outbrain|pinterest|skypeuripreview/i.test(userAgent);

  if (!isBot) return context.next();

  try {
    // 2. 🔗 URL Parsing & Data Fetching
    const url = new URL(request.url);
    const slug = decodeURIComponent(url.pathname.split('/').pop() || '');
    
    if (!slug) return context.next();

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, provinces(nameThai)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !profile) return context.next();

    // 3. 🛡️ Data Prep (Handle Null & Undefined)
    const pName = profile.name || 'สาวสวย';
    let pProv = 'เชียงใหม่';
    if (profile.provinces) {
      pProv = Array.isArray(profile.provinces) ? (profile.provinces[0]?.nameThai || 'เชียงใหม่') : (profile.provinces?.nameThai || 'เชียงใหม่');
    }
    const pLoc = profile.location || pProv;
    const pAge = profile.age ? `${profile.age} ปี` : '20+ ปี';
    const rawPrice = profile.rate ? profile.rate.toString().replace(/[^0-9]/g, '') : '1500';
    const displayPrice = profile.rate || '1,500';

    // 4. 🎲 Smart Random Logic (Stable for SEO)
    const seed = getStableRandom(slug);
    const reviewCount = (seed % 205) + 45;
    const ratingBase = 4.7;
    const ratingDecimal = (seed % 4) / 10;
    let ratingValue = (ratingBase + ratingDecimal).toFixed(1);
    if (parseFloat(ratingValue) > 5.0) ratingValue = "5.0";

    const jobTypes = ['ไซด์ไลน์', 'รับงาน N', 'งาน En', 'น้องรับงาน', 'เพื่อนเที่ยว', 'นวดผ่อนคลาย'];
    const adjectives = ['ตรงปก 100%', 'ตัวจริงสวยมาก', 'งานดีไม่เร่ง', 'ฟีลแฟน', 'ขี้อ้อน', 'บริการดีเยี่ยม'];
    const jobType = jobTypes[seed % jobTypes.length];
    const adj = adjectives[(seed + 5) % adjectives.length];

    const title = `น้อง${pName} ${jobType} ${pProv} (${pLoc}) - ${adj} เริ่ม ${displayPrice} | Sideline Chiangmai`;
    const description = `บริการ${jobType}${pProv} น้อง${pName} โซน${pLoc} อายุ ${pAge}. ${profile.stats ? `สัดส่วน ${profile.stats}.` : ''} ${profile.description ? profile.description.substring(0, 150).replace(/["\n\\]/g, ' ') : 'นิสัยน่ารัก คุยเก่ง งานดี ไม่เร่งรีบ'}. รับงานเอง ปลอดภัย จ่ายหน้างาน 100%. รีวิวแน่น ${reviewCount} คน`.replace(/\s+/g, ' ').trim();

    // Handle Image URL Safely
    const imagePath = profile.imagePath || '';
    const imageUrl = imagePath.startsWith('http') 
      ? imagePath 
      : (imagePath ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${imagePath}` : 'https://sidelinechiangmai.netlify.app/default-og.jpg');

    const pageUrl = `${SITE_DOMAIN}/sideline/${slug}`;

    // 5. ⭐ JSON-LD Schema (Safe Stringify)
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": `น้อง ${pName} (${pProv})`,
      "image": imageUrl,
      "description": description,
      "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": reviewCount.toString()
      },
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "THB",
        "price": rawPrice,
        "availability": "https://schema.org/InStock"
      }
    };

    // 6. 🚀 Generate HTML
    const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${pageUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:type" content="profile">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        body { font-family: 'Prompt', sans-serif; margin: 0; background: #fdf2f8; color: #1f2937; line-height: 1.6; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; min-height: 100vh; }
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
        .content { padding: 20px; }
        h1 { color: #ec4899; font-size: 22px; margin-bottom: 10px; }
        .rating-badge { background: #fffbeb; color: #b45309; padding: 6px 12px; border-radius: 8px; font-weight: bold; display: inline-block; border: 1px solid #fcd34d; margin-bottom: 15px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
        .meta-item { background: #f3f4f6; padding: 12px; border-radius: 10px; }
        .meta-label { font-size: 12px; color: #6b7280; display: block; }
        .meta-val { font-size: 15px; font-weight: 600; }
        .cta-btn { display: block; background: #06c755; color: white; text-align: center; padding: 16px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; margin-top: 25px; box-shadow: 0 4px 12px rgba(6,199,85,0.3); }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" alt="${pName}" class="hero-img">
        <div class="content">
            <div class="rating-badge">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${title}</h1>
            <div class="meta-grid">
                <div class="meta-item"><span class="meta-label">ราคาเริ่มต้น</span><span class="meta-val">${displayPrice}</span></div>
                <div class="meta-item"><span class="meta-label">พื้นที่</span><span class="meta-val">${pLoc}</span></div>
                <div class="meta-item"><span class="meta-label">สัดส่วน</span><span class="meta-val">${profile.stats || '-'}</span></div>
                <div class="meta-item"><span class="meta-label">อายุ</span><span class="meta-val">${pAge}</span></div>
            </div>
            <p>${profile.description || 'สนใจสอบถามข้อมูลเพิ่มเติม แอดไลน์คุยกับน้องได้โดยตรงเลยค่ะ'}</p>
            <a href="https://line.me/ti/p/${profile.lineId || ''}" class="cta-btn">📲 แอดไลน์จองคิว</a>
            <div style="text-align:center; margin-top:40px; font-size:14px;">
                <a href="/" style="color:#ec4899; text-decoration:none;">🏠 กลับหน้าหลัก</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Netlify-CDN-Cache-Control": "public, s-maxage=3600",
        "Cache-Control": "public, max-age=600"
      }
    });

  } catch (err) {
    console.error("SSR Error:", err);
    return context.next();
  }
};