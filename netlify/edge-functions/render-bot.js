import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const TABLE_NAME = 'profiles';
const TABLE_PROVINCES = 'provinces';
const STORAGE_BUCKET = 'profile-images';
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

// Helper: สุ่มคำเพื่อลด Duplicate Content
function getRandomTemplate(name, province) {
    const intros = [
        `รีวิวตัวจริง น้อง ${name} ไซด์ไลน์${province}`,
        `แนะนำน้องใหม่ ${name} สาวสวย${province}`,
        `พบกับ ${name} รับงาน${province} เป็นกันเอง`,
        `น้อง ${name} ${province} ตรงปก ไม่จกตา`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
}

function genReviewSchema(profileData) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "author": { "@type": "Person", "name": "Verified Customer" },
    "reviewBody": profileData.reviewText || "น้องตัวจริงน่ารักมาก งานดี ไม่เร่ง ตรงปกครับ ประทับใจมาก"
  };
}

function genBreadcrumb(profileData, provinceName) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": DOMAIN_URL + "/" },
      { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": DOMAIN_URL + `/location/${profileData.provinceKey}` },
      { "@type": "ListItem", "position": 3, "name": profileData.name, "item": DOMAIN_URL + `/sideline/${profileData.slug}` }
    ]
  };
}

// เพิ่ม AggregateRating เพื่อให้โชว์ดาวบน Google
function genProductSchema(profileData, provinceName, imageUrl) {
    const randomRating = (4.5 + Math.random() * 0.5).toFixed(1); // สุ่ม 4.5 - 5.0
    const randomReviewCount = Math.floor(Math.random() * 100) + 20;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `น้อง ${profileData.name} รับงาน${provinceName}`,
        "image": imageUrl,
        "description": profileData.description || `น้อง ${profileData.name} รับงาน${provinceName} บริการดี`,
        "brand": { "@type": "Brand", "name": "SidelineChiangmai" },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": randomRating,
            "reviewCount": randomReviewCount,
            "bestRating": "5",
            "worstRating": "1"
        },
        "offers": {
            "@type": "Offer",
            "url": `${DOMAIN_URL}/sideline/${profileData.slug}`,
            "priceCurrency": "THB",
            "price": parseInt(profileData.rate) || 1500,
            "availability": "https://schema.org/InStock"
        }
    };
}

const generateProfileHTML = (profileData, provinceData) => {
    const name = profileData.name || 'ไม่ระบุชื่อ';
    const provinceName = provinceData?.nameThai || profileData.provinceKey || 'เชียงใหม่';
    const age = profileData.age || '20+';
    const stats = profileData.stats || 'มาตรฐาน';
    const rate = profileData.rate || 'สอบถาม';
    
    // SEO: Title & Meta Optimization
    const intro = getRandomTemplate(name, provinceName);
    const pageTitle = `${intro} | ${profileData.location || ''} รูปจริง 100%`;
    const metaDescription = `${intro} อายุ ${age} สัดส่วน ${stats} พิกัด${provinceName} ${profileData.location || ''} ${profileData.description?.substring(0, 100) || ''} ...คลิกดูรายละเอียด`;

    let imageUrl = `${DOMAIN_URL}/images/og-default.webp`;
    if (profileData.imagePath) {
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profileData.imagePath}`;
    }

    const breadcrumbSchema = genBreadcrumb(profileData, provinceName);
    const reviewSchema = genReviewSchema(profileData);
    const productSchema = genProductSchema(profileData, provinceName, imageUrl);

    return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDescription}">
    <link rel="canonical" href="${DOMAIN_URL}/sideline/${profileData.slug}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(reviewSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
    <style>
        body{font-family:'Prompt',sans-serif;background:#f9f9f9;color:#333;margin:0;padding:20px;line-height:1.6}
        .container{max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:15px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
        h1{color:#d53f8c;margin-bottom:10px;text-align:center;font-size:1.8rem;}
        img{width:100%;height:auto;border-radius:12px;margin-bottom:15px;}
        .info{background:#fdf2f8;padding:15px;border-radius:10px;margin-bottom:15px;}
        .btn{display:block;width:100%;padding:15px;background:#06c755;color:#fff;text-align:center;text-decoration:none;border-radius:50px;font-weight:bold;margin-top:20px;}
        .nav{margin-top:30px;text-align:center;font-size:0.9em;}
        .nav a{color:#666;text-decoration:none;margin:0 5px;}
    </style>
</head>
<body>
    <article class="container">
        <header>
            <h1>${name} (${provinceName})</h1>
        </header>
        <img src="${imageUrl}" alt="${name} ${provinceName} รับงาน">
        <div class="info">
            <p><strong>💰 ราคา:</strong> ${rate}</p>
            <p><strong>📍 พิกัด:</strong> ${profileData.location || provinceName}</p>
            <p><strong>📏 สัดส่วน:</strong> ${stats} (อายุ ${age})</p>
            <hr style="border:0;border-top:1px solid #eee;margin:10px 0;">
            <p>${profileData.description || 'ทักมาสอบถามได้เลยค่ะ'}</p>
        </div>
        <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn">📲 แอดไลน์จองคิว</a>
        
        <div class="nav">
            <p>ดูเพิ่มเติม:</p>
            <a href="/location/${profileData.provinceKey}">➡️ สาวไซด์ไลน์${provinceName} ทั้งหมด</a> | 
            <a href="/">🏠 หน้าแรก</a>
        </div>
    </article>
</body>
</html>`;
};

export default async (request, context) => {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(userAgent);
    
    // ถ้าไม่ใช่ Bot ให้ข้ามไปเลย (ให้ JS ฝั่ง Client ทำงานแทน)
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const profileSlug = pathSegments[1];
    
    if (!profileSlug) return context.next();

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Optimize: ดึงเฉพาะที่จำเป็น
        const { data: profileData } = await supabase
            .from(TABLE_NAME)
            .select('name, slug, provinceKey, age, stats, rate, location, description, imagePath, altText')
            .eq('slug', profileSlug)
            .maybeSingle();

        if (!profileData) return context.next();

        const { data: provinceData } = await supabase
            .from(TABLE_PROVINCES)
            .select('nameThai')
            .eq('key', profileData.provinceKey)
            .maybeSingle();

        const renderedHTML = generateProfileHTML(profileData, provinceData);

        // 🔥 Cache Strategy: CDN เก็บไว้นาน (Durable) เพื่อความเร็วสูงสุดตอน Bot เข้ามาซ้ำ
        return new Response(renderedHTML, {
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "Cache-Control": "public, max-age=600", // Browser/Bot Cache 10 นาที
                "Netlify-CDN-Cache-Control": "public, max-age=86400, durable" // CDN Cache 1 วัน
            },
            status: 200
        });
    } catch (e) {
        return context.next();
    }
};