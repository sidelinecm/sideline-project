// netlify/edge-functions/render-bot.js
// ฉบับ Ultimate: รองรับ URL /sideline/ และใช้ตารางเดิม

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const TABLE_NAME = 'profiles';
const TABLE_PROVINCES = 'provinces';
const STORAGE_BUCKET = 'profile-images';
const SLUG_COLUMN = 'slug'; 
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

// 1. Schema: Review (ดาวรีวิว)
function genReviewSchema(profileData) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": profileData.reviewRating || "5",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": profileData.reviewAuthor || "รีวิวจากลูกค้าจริง"
    },
    "reviewBody": profileData.reviewText || "น้องตัวจริงน่ารักมาก งานดี ไม่เร่ง ตรงปกครับ"
  };
}

// 2. Schema: Breadcrumb (แก้ให้ลิงก์กลับไป /location/ แทน /province/)
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

// 3. Schema: Product (Google ชอบอันนี้สำหรับงานบริการ)
function genProductSchema(profileData, provinceName, imageUrl) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `บริการรับงานน้อง ${profileData.name}`,
        "image": imageUrl,
        "description": profileData.description || `น้อง ${profileData.name} รับงาน${provinceName}`,
        "brand": {
            "@type": "Brand",
            "name": "SidelineChiangmai"
        },
        "offers": {
            "@type": "Offer",
            "url": `${DOMAIN_URL}/sideline/${profileData.slug}`,
            "priceCurrency": "THB",
            "price": parseInt(profileData.rate) || 1500,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };
}

const generateProfileHTML = (profileData, provinceData) => {
    const name = profileData.name || 'ไม่ระบุชื่อ';
    // ดึงชื่อจังหวัดไทยจากตาราง provinces ถ้าไม่มีใช้ค่า fallback
    const provinceName = provinceData?.nameThai || profileData.provinceKey || 'เชียงใหม่';
    const age = profileData.age || '20+';
    const stats = profileData.stats || 'สัดส่วนมาตรฐาน';
    const rate = profileData.rate || 'สอบถาม';
    
    // SEO Title: สูตร [ชื่อ] + [จังหวัด] + [จุดเด่น]
    const pageTitle = `${name} ไซด์ไลน์${provinceName} รับงาน${profileData.location || ''} รูปจริง ตรงปก 100%`;
    
    // SEO Description
    const metaDescription = `น้อง${name} อายุ ${age} สัดส่วน ${stats} พิกัด${provinceName} ${profileData.location || ''} ${profileData.description?.substring(0, 100) || ''} แอดไลน์จองคิวได้เลย`;

    let imageUrl = `${DOMAIN_URL}/images/og-default.webp`;
    if (profileData.imagePath) {
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profileData.imagePath}`;
    }

    // Alt Text: ดึงจาก DB หรือสร้างเอง
    const finalAltText = profileData.altText || `${name} สาวไซด์ไลน์ ${provinceName} รับงาน${profileData.location || ''} ฟิวแฟน รูปตัวจริง`;

    const breadcrumbSchema = genBreadcrumb(profileData, provinceName);
    const reviewSchema = genReviewSchema(profileData);
    const productSchema = genProductSchema(profileData, provinceName, imageUrl);

    // HTML Content (ตัด CSS ออกมาใส่ใน <style> ด้านล่างเพื่อให้ Code สะอาด)
    const profileContentHTML = `
        <article class="profile-container">
            <header>
                <h1>${name} <span class="province-badge">(${provinceName})</span></h1>
                <div class="meta-tags">
                    <span>🔥 ตรงปก</span> <span>✅ ${provinceName}</span> <span>💖 ฟิวแฟน</span>
                </div>
            </header>
            <figure>
                <img src="${imageUrl}" alt="${finalAltText}">
                <figcaption style="display:none;">${finalAltText}</figcaption>
            </figure>
            <div class="info-box">
                <p><strong>💰 เรทราคา:</strong> ${rate}</p>
                <p><strong>📍 พิกัด:</strong> ${profileData.location || provinceName}</p>
                <p><strong>📏 สัดส่วน:</strong> ${stats} (อายุ ${age})</p>
                <hr>
                <div class="desc">
                    ${profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'สอบถามรายละเอียดเพิ่มเติมทางไลน์'}
                </div>
            </div>
            <div class="cta-box">
                <a href="https://line.me/ti/p/ksLUWB89Y_" class="line-btn">📲 จองคิวผ่าน LINE (คลิก)</a>
            </div>
            <div class="back-link">
                <!-- ลิงก์ย้อนกลับไปหน้า location -->
                <a href="/location/${profileData.provinceKey}">⬅️ ดูสาวๆ ${provinceName} คนอื่น</a>
            </div>
        </article>
    `;

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
        .profile-container{max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:15px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
        h1{color:#d53f8c;margin-bottom:10px;text-align:center;font-size:1.8rem;}
        .province-badge{font-size:0.6em;color:#666;vertical-align:middle;}
        .meta-tags{text-align:center;margin-bottom:20px;}
        .meta-tags span{background:#fce7f3;color:#be185d;padding:4px 10px;border-radius:20px;font-size:0.85em;margin:0 2px;}
        figure{margin:0 0 20px 0;}
        figure img{width:100%;height:auto;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);object-fit:cover;}
        .info-box{background:#fdf2f8;padding:20px;border-radius:12px;margin-top:20px;}
        .info-box p{margin:5px 0;}
        .info-box hr{border:0;border-top:1px solid #f3dce9;margin:15px 0;}
        .desc{font-size:0.95em;}
        .line-btn{display:block;width:100%;padding:15px;background:#06c755;color:#fff;text-align:center;text-decoration:none;border-radius:50px;font-weight:bold;font-size:1.2em;margin-top:25px;box-shadow:0 4px 10px rgba(6,199,85,0.3);transition:transform 0.2s;}
        .line-btn:active{transform:scale(0.98);}
        .back-link{text-align:center;margin-top:25px;}
        .back-link a{color:#888;text-decoration:none;font-size:0.9em;}
    </style>
</head>
<body>
    ${profileContentHTML}
</body>
</html>
    `;
};

// --------- Edge Function Handler ---------
export default async (request, context) => {
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|facebookexternalhit|twitterbot|discordbot|linkedinbot|embedly|baiduspider/i.test(userAgent);
    if (!isBot) return context.next(); 

    const url = new URL(request.url);
    // ตรวจสอบ path ว่าเป็นแบบไหน (รองรับทั้งแบบเก่าและแบบใหม่)
    // แบบใหม่: /sideline/{slug}
    // แบบเก่า: /profile/{slug} หรือ /app/{slug}
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // ถ้าไม่ใช่ path ที่เกี่ยวกับโปรไฟล์ ให้ผ่านไป
    if (!['sideline', 'profile', 'app'].includes(pathSegments[0])) return context.next();
    
    const profileSlug = pathSegments[1];
    if (!profileSlug) return context.next();

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // 1. ดึงข้อมูล Profile
        const { data: profileData } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq(SLUG_COLUMN, profileSlug)
            .maybeSingle();

        if (!profileData) {
            console.log(`Bot request for ${profileSlug} - not found`);
            return context.next();
        }

        // 2. ดึงข้อมูลชื่อจังหวัด (เพื่อเอาไปทำ Title/Breadcrumb สวยๆ)
        const { data: provinceData } = await supabase
            .from(TABLE_PROVINCES)
            .select('nameThai')
            .eq('key', profileData.provinceKey)
            .maybeSingle();

        const renderedHTML = generateProfileHTML(profileData, provinceData);
        return new Response(renderedHTML, {
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow"
            },
            status: 200
        });
    } catch (e) {
        console.error("Edge Function Critical Error:", e);
        return context.next();
    }
};