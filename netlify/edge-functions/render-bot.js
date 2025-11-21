// netlify/edge-functions/render-bot.js
//
// Edge Function สำหรับ SSR โปรไฟล์ Supabase (SEO Bot SSR)
// - Detect Bot/Crawler แล้วสร้าง HTML แบบ SEO-rich ด้วย meta/og/schema/FAQ/review/person/profile
// - รองรับการแสดงผลโปรไฟล์แต่ละคนที่ /app/{slug}
// - สามารถพัฒนา/ขยายเพิ่มเติม SEO schema หรือเนื้อหาได้ตามต้องการ

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ------------------------------------------
// CONFIGURATION (แนะนำใช้ Environment Variables ใน Production)
const SUPABASE_URL = 'https://hgzbgpbmymoiwjpaypvl.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8'; 
const TABLE_NAME = 'profiles';
const STORAGE_BUCKET = 'profile-images';
const SLUG_COLUMN = 'slug'; 
const DOMAIN_URL = "https://sidelinechiangmai.netlify.app";

// ------------------------------------------
// Helpers: Generate Review/AggregateRating schema per profile
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
      "name": profileData.reviewAuthor || "รีวิวลูกค้าจริง"
    },
    "reviewBody": profileData.reviewText || "บริการดี ตรงปกจริง!"
  };
}

// Helper: Generate Breadcrumb for SEO navigation
function genBreadcrumb(profileData, profileSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": DOMAIN_URL + "/" },
      { "@type": "ListItem", "position": 2, "name": "โปรไฟล์ไซด์ไลน์", "item": DOMAIN_URL + "/profiles" },
      { "@type": "ListItem", "position": 3, "name": profileData.name || profileSlug, "item": DOMAIN_URL + `/app/${profileSlug}` }
    ]
  };
}

// Main SSR Profile HTML generator for Bots/Crawlers
const generateProfileHTML = (profileData, profileSlug) => {
    const name = profileData.name || `น้อง ${profileSlug}`;
    const province = profileData.provinceKey || 'เชียงใหม่';
    const age = profileData.age || 'ไม่ระบุ';
    const stats = profileData.stats || 'ไม่ระบุ';
    const rate = profileData.rate || 'สอบถาม';
    const location = profileData.location || province;
    const availability = profileData.availability || 'สอบถามคิว';

    const rawDescription = profileData.description || '';
    const metaDescription = rawDescription.length > 150 ? rawDescription.substring(0, 150) + '...' : (rawDescription || `ดูโปรไฟล์น้อง ${name} ไซด์ไลน์${province} รับงานเอง ปลอดภัย ตรงปก`);
    let imageUrl = '';
    if (profileData.imagePath) {
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${profileData.imagePath}`;
    } else {
        imageUrl = `${DOMAIN_URL}/images/og-default.webp`;
    }
    const pageTitle = `${name} - สาวไซด์ไลน์${province} รับงานฟิวแฟน ตรงปก | Sideline Chiang Mai`;

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "FAQPage",
                "mainEntity": [
                    { "@type": "Question", "name": "บริการไซด์ไลน์เชียงใหม่ ปลอดภัยและเป็นความลับหรือไม่?", "acceptedAnswer": { "@type": "Answer", "text": "Sideline Chiang Mai ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของลูกค้า ข้อมูลจะถูกเก็บเป็นความลับ" } },
                    { "@type": "Question", "name": "จำเป็นต้องโอนเงินมัดจำก่อนใช้บริการหรือไม่?", "acceptedAnswer": { "@type": "Answer", "text": "ไม่จำเป็นต้องโอนเงินมัดจำ สามารถชำระค่าบริการเต็มจำนวนที่หน้างานได้เลย" } },
                    { "@type": "Question", "name": "น้องๆ ตรงปกตามรูปโปรไฟล์จริงหรือ?", "acceptedAnswer": { "@type": "Answer", "text": "เราคัดกรองและยืนยันตัวตนพร้อมรูปภาพอย่างละเอียด การันตีตรงปก 100%" } }
                ]
            }
        ]
    };

    // Person/Profile Schema
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "description": metaDescription,
        "image": imageUrl,
        "url": `${DOMAIN_URL}/app/${profileSlug}`,
        "address": { "@type": "PostalAddress", "addressLocality": province, "addressCountry": "TH" }
    };

    // Review/AggregateRating schema
    const reviewSchema = genReviewSchema(profileData);

    // Breadcrumb schema
    const breadcrumbSchema = genBreadcrumb(profileData, profileSlug);

    // HTML Content
    const profileContentHTML = `
        <article class="profile-container" itemscope itemtype="https://schema.org/Person">
            <header>
                <h1 itemprop="name">${name} (${province})</h1>
                <div class="meta-info">
                    <span itemprop="age">อายุ: ${age} ปี</span> | 
                    <span>สัดส่วน: ${stats}</span> | 
                    <span itemprop="address">${province}</span>
                </div>
            </header>
            <figure>
                <img src="${imageUrl}" alt="รูปโปรไฟล์ของ ${name}" itemprop="image" style="max-width:100%; height:auto; border-radius:8px; margin:20px 0;">
                <figcaption>${profileData.altText || `น้อง ${name} รับงาน${province}`}</figcaption>
            </figure>
            <section class="details">
                <h2>รายละเอียดบริการ</h2>
                <div class="description-content" itemprop="description">
                    ${profileData.description ? profileData.description.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียดเพิ่มเติม'}
                </div>
                <div class="additional-info">
                    <p><strong>เรทราคา:</strong> <span itemprop="price">${rate}</span></p>
                    <p><strong>สถานที่รับงาน:</strong> ${location}</p>
                    <p><strong>สถานะ:</strong> ${availability}</p>
                </div>
            </section>
            ${profileData.reviewText ? `<section class="review-section"><h3>รีวิวจริง</h3><blockquote>${profileData.reviewText} <footer>${profileData.reviewAuthor || ""}</footer></blockquote></section>` : ""}
            <section class="cta">
                <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-main">จองคิวผ่าน LINE</a>
            </section>
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
    <link rel="canonical" href="${DOMAIN_URL}/app/${profileSlug}">
    <meta property="og:type" content="profile">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${DOMAIN_URL}/app/${profileSlug}">
    <meta property="og:site_name" content="Sideline Chiang Mai">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    <meta name="twitter:image" content="${imageUrl}">
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(reviewSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <style>
        body { font-family: 'Prompt', sans-serif; line-height:1.6; color:#333; max-width:860px; margin:0 auto; padding:20px; background:#fff;}
        h1 { color:#d53f8c; }
        .btn-main {display:inline-block; padding:10px 24px; background:#d53f8c; color:#fff; font-weight:600; border-radius:2em; box-shadow:0 4px 10px 0 rgba(213,63,140,0.10);}
        .meta-info { font-weight: bold; color: #555; margin-bottom: 10px; }
        .details { margin-top: 20px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
        .review-section {margin:24px 0 0 0; padding:18px 20px; background:#faf3fa; border-radius:8px;}
        .cta {margin:28px 0 4px 0;}
        @media(max-width:700px){body{padding:10px;}}
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
    if (!isBot) return context.next(); // Only bot gets SSR, users get SPA

    // parse /app/{slug}
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(s => s.length > 0);
    const profileSlug = pathSegments[1]; // [0] = app, [1] = slug
    if (!profileSlug) return context.next();

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq(SLUG_COLUMN, profileSlug)
            .maybeSingle();

        if (error || !data) {
            console.log(`Bot request for /app/${profileSlug} - not found`);
            return context.next();
        }

        const renderedHTML = generateProfileHTML(data, profileSlug);
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