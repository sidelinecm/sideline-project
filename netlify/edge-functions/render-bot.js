/* global URL, Response, fetch */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ==========================================
// 1. CONFIGURATION & FULL DIGITAL FOOTPRINT
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://bsky.app/profile/sidelinechiangmai.bsky.social",
        "https://www.linkedin.com/in/cuteti-sexythailand-398567280",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// ฟังก์ชันสุ่มคำ (Spintax) เพื่อไม่ให้ Description ซ้ำกัน
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || '';
    
    // ==========================================
    // 2. LAYER 1-3 SECURITY (CLOAKING)
    // ==========================================
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    const geo = context.geo || {};
    const isSuspicious = !geo.city || geo.country?.code !== 'TH';

    let isDataCenter = false;
    if (clientIP && clientIP !== '127.0.0.1' && (isBot || isSuspicious)) {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { isDataCenter = false; }
    }

    // [ACTION] คนไทยตัวจริง -> ไปหน้าเว็บหลัก (Client-side)
    if (!isBot && !isSuspicious && !isDataCenter) return context.next();

    // ==========================================
    // 3. FULL SERVER-SIDE RENDERING (SSR)
    // ==========================================
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: p } = await supabase.from('profiles').select('*, provinces(*)').eq('slug', slug).maybeSingle();
        if (!p) return context.next();

        // --- 🛠️ SMART FIX: จัดการข้อมูลให้ฉลาด ---
        
        // 1. ชื่อ (Name): ป้องกัน "น้องน้อง..."
        const rawName = p.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;

        // 2. ราคา (Price): ดึงเฉพาะตัวเลขให้ Google Schema
        const rawPriceValue = (p.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = parseInt(rawPriceValue).toLocaleString() + ".-";
        
        // 3. รูปภาพ (Image Optimization): ย่อรูปให้โหลดเร็ว + รองรับ Link เต็ม
        let imageUrl = `${CONFIG.DOMAIN}/images/default.webp`;
        if (p.imagePath) {
            if (p.imagePath.startsWith('http')) {
                imageUrl = p.imagePath;
            } else {
                // 🔥 SEO BOOST: เพิ่ม Query Param สั่งย่อรูป (width=800, quality=80)
                imageUrl = `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}?width=800&quality=80&format=webp`;
            }
        }
        
        // 4. LINE Link: รองรับทั้ง ID และ Link เต็ม
        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/${finalLineUrl}`;
        }

        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        
        // คำนวณ Rating ให้คงที่ตาม Slug
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // --- 🔥 SEO SPINTAX: สุ่มคำบรรยายไม่ให้ซ้ำ (Duplicate Content Killer) ---
        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "มาแรง", "ห้ามพลาด"]);
        const descIntro = spin(["โปรไฟล์", "รายละเอียด", "ข้อมูล"]);
        const serviceWord = spin(["บริการฟิวแฟน", "เอาใจเก่ง", "งานดีตรงปก", "เป็นกันเอง"]);
        const payWord = spin(["ไม่รับมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน รูปตรงปก 100%`;
        const metaDesc = `${descIntro}${displayName} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${serviceWord} รับงานเองไม่ผ่านเอเย่นต์ ${payWord} รูปตรงปก พิกัด${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // ==========================================
        // 4. ADVANCED STRUCTURED DATA (JSON-LD)
        // ==========================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/sideline/province/${p.provinces?.key || 'chiangmai'}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": ["Service", "Product"],
                    "@id": `${canonicalUrl}#maincontent`,
                    "name": pageTitle,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": rawPriceValue,
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2026-12-31", // ✅ แก้ Error วันหมดอายุ
                        "shippingDetails": { 
                            "@type": "OfferShippingDetails", 
                            "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "THB" } 
                        },
                        "hasMerchantReturnPolicy": { 
                            "@type": "MerchantReturnPolicy", 
                            "returnPolicyCategory": "https://schema.org/NoReturns" 
                        }
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString(),
                        "bestRating": "5",
                        "worstRating": "1"
                    },
                    "review": {
                        "@type": "Review",
                        "author": { "@type": "Person", "name": "Verified User" },
                        "reviewBody": `${displayName} งานดีมากครับ พิกัด${p.location} ตรงปกไม่จกตา บริการเป็นกันเองสุดๆ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
                    },
                    "areaServed": {
                        "@type": "AdministrativeArea",
                        "name": provinceName,
                        "sameAs": provinceName.includes("เชียงใหม่") ? "https://www.wikidata.org/wiki/Q42430" : undefined
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `จอง${displayName} ต้องโอนมัดจำไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำครับ เว็บไซต์เราเน้นความปลอดภัย ชำระเงินหน้างานเมื่อเจอน้องเท่านั้น" }
                        },
                        {
                            "@type": "Question",
                            "name": `รูป${displayName} ตรงปกไหม?`,
                            "acceptedAnswer": { "@type": "Answer", "text": `รูป${displayName} ตรงปก 100% ตรวจสอบโดยทีมงาน Sideline Chiang Mai เรียบร้อยแล้วครับ` }
                        }
                    ]
                }
            ]
        };

        // ==========================================
        // 5. FULL OPTIMIZED HTML
        // ==========================================
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="language" content="Thai">
    
    <meta property="og:locale" content="th_TH">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:alt" content="${displayName} ไซด์ไลน์${provinceName}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root{--p:#db2777;--s:#06c755}body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#1f2937;line-height:1.5}.c{max-width:480px;margin:0 auto;background:#fff;min-height:100vh}.h{width:100%;height:auto;display:block;aspect-ratio:3/4;object-fit:cover;background:#f3f4f6}.d{padding:24px}.r{display:flex;align-items:center;gap:4px;color:#fbbf24;font-weight:700;font-size:15px;margin-bottom:8px}h1{color:var(--p);font-size:24px;margin:0 0 16px 0;font-weight:800;line-height:1.2}.g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}.i{border:1px solid #f3f4f6;border-radius:16px;padding:16px;background:#f9fafb}.i b{display:block;font-size:11px;color:#9ca3af;text-transform:uppercase;margin-bottom:4px}.i span{font-size:16px;font-weight:700;color:#111827}.tx{font-size:15px;color:#4b5563;margin-bottom:24px}.btn{display:flex;align-items:center;justify-content:center;background:var(--s);color:#fff;padding:18px;border-radius:100px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 10px 15px -3px rgba(6,199,85,.4);transition:transform .2s}.btn:active{transform:scale(.98)}.ft{text-align:center;font-size:12px;color:#9ca3af;margin-top:30px;padding:20px}
    </style>
</head>
<body>
    <div class="c">
        <img src="${imageUrl}" class="h" alt="${displayName} สาวไซด์ไลน์ ${provinceName}" loading="lazy" decoding="async">
        <div class="d">
            <div class="r">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            <div class="g">
                <div class="i"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="i"><b>พิกัดพื้นที่</b><span>${p.location || provinceName}</span></div>
            </div>
            <div class="tx">
                ${metaDesc}
            </div>
            <a href="${finalLineUrl}" class="btn">📲 ทักไลน์จองคิว ${displayName}</a>
        </div>
        <div class="ft">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - มั่นใจ ปลอดภัย ไม่มัดจำ</div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=600"
            } 
        });

    } catch (e) {
        return context.next();
    }
};