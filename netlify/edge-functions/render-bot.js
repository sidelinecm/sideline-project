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

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || '';
    
    // ==========================================
    // 2. LAYER 1-3 SECURITY (CLOAKING)
    // ==========================================
    // ปรับปรุง RegEx ให้ครอบคลุม Bot ตรวจสอบอันดับมากขึ้น
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    const geo = context.geo || {};
    
    // ปรับเงื่อนไขการเช็คเพื่อไม่ให้ Bot หลุด (Bot บางตัวอาจไม่มีข้อมูล City)
    const isOutsideTH = geo.country?.code && geo.country?.code !== 'TH';

    let isDataCenter = false;
    if (clientIP && clientIP !== '127.0.0.1' && (isBot || isOutsideTH)) {
        try {
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) { isDataCenter = false; }
    }

    // [ACTION] ถ้าไม่ใช่ Bot และเป็นคนไทยจริง ให้ไปหน้าเว็บหลัก (Client-side)
    if (!isBot && !isOutsideTH && !isDataCenter) return context.next();

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

        // --- แก้ไขจุดที่ผิดพลาดในระบบเดิม ---
        
        // 1. จัดการเรื่องราคาให้ถูกต้องตาม Schema (ต้องเป็นเลขล้วน ไม่มีจุดหรือขีด)
        const rawPrice = p.rate ? p.rate.toString().replace(/[^0-9]/g, '') : "1500"; 
        const displayPrice = parseInt(rawPrice).toLocaleString() + ".-"; // สำหรับแสดงบนหน้าเว็บ

        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/default.webp`;
        
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        const pageTitle = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน รูปตรงปก 100%`;
        const metaDesc = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี บริการฟิวแฟน รับงานเองไม่ผ่านเอเย่นต์ ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น รูปตรงปก 100% ปลอดภัย พิกัด${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // ==========================================
        // 4. ADVANCED STRUCTURED DATA (เพิ่มข้อมูลที่ขาดหาย)
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
                        { "@type": "ListItem", "position": 3, "name": `น้อง${p.name}`, "item": canonicalUrl }
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
                        "price": rawPrice, // ส่งค่าเฉพาะตัวเลขเพื่อแก้ Error
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2026-12-31",
                        // เพิ่มข้อมูลที่ Google แจ้งเตือนว่าขาดหาย (Warning)
                        "shippingDetails": {
                            "@type": "OfferShippingDetails",
                            "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "THB" },
                            "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" } }
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
                        "reviewBody": `น้อง${p.name} งานดีมากครับ พิกัด${p.location} ตรงปกไม่จกตา บริการเป็นกันเองสุดๆ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
                    },
                    "areaServed": {
                        "@type": "AdministrativeArea",
                        "name": provinceName,
                        "sameAs": provinceName.includes("เชียงใหม่") ? "https://www.wikidata.org/wiki/Q42430" : undefined
                    }
                }
            ]
        };

        // ==========================================
        // 5. OPTIMIZED HTML FOR SEARCH ENGINE
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
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root{--p:#db2777;--s:#06c755}body{margin:0;padding:0;font-family:sans-serif;background:#fff;color:#1f2937}.c{max-width:480px;margin:0 auto}.h{width:100%;aspect-ratio:3/4;object-fit:cover}.d{padding:24px}.r{color:#fbbf24;font-weight:700;margin-bottom:8px}h1{color:var(--p);font-size:24px;margin-bottom:16px}.g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}.i{border:1px solid #f3f4f6;border-radius:16px;padding:16px;background:#f9fafb}.i b{display:block;font-size:11px;color:#9ca3af}.i span{font-size:16px;font-weight:700}.btn{display:flex;align-items:center;justify-content:center;background:var(--s);color:#fff;padding:18px;border-radius:100px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 10px 15px -3px rgba(6,199,85,.4)}.ft{text-align:center;font-size:12px;color:#9ca3af;margin-top:30px;padding:20px}
    </style>
</head>
<body>
    <div class="c">
        <img src="${imageUrl}" class="h" alt="น้อง${p.name}">
        <div class="d">
            <div class="r">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${pageTitle}</h1>
            <div class="g">
                <div class="i"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="i"><b>พิกัดพื้นที่</b><span>${p.location || provinceName}</span></div>
            </div>
            <p>${metaDesc}</p>
            <a href="https://line.me/ti/p/${p.lineId || 'ksLUMz3p_o'}" class="btn">📲 ทักไลน์จองคิว น้อง${p.name}</a>
        </div>
        <div class="ft">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}</div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large"
            } 
        });

    } catch (e) {
        return context.next();
    }
};