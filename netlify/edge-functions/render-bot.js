import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'sidelinechiangmai ไซด์ไลน์เชียงใหม่',
    SOCIAL_PROFILES: ["https://linktr.ee/sidelinechiangmai", "https://x.com/Sdl_chiangmai"]
};

// Security Helper (จากไฟล์ 2)
const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

// Spintax Helper (จากไฟล์ 2)
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Image Helper (จากไฟล์ 2)
const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

export default async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // Routing Logic (จากไฟล์ 2 - ปลอดภัยกว่า)
    if (path === "/" || path === "/index.html" || !path.startsWith("/sideline/")) return context.next();

    // Bot Detection (รวมๆ กัน)
    const ua = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse|headless|bing|yahoo/i.test(ua);
    const geo = context.geo || {};
    // ยอมรับ TH และ US (เผื่อ Google Bot มาจาก US)
    const isSuspicious = !geo.city || (geo.country?.code !== 'TH' && geo.country?.code !== 'US');

    if (!isBot && !isSuspicious) return context.next();

    try {
        const pathParts = path.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        let slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const cleanSlug = slug.includes('-') ? slug.split('-').slice(0, -1).join('-') : slug;
        
        // Skip System Paths
        if (['province', 'search', 'location', 'admin', 'login', 'register'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // Query Logic (จากไฟล์ 2 - เช็ค active)
        const { data: profile } = await supabase
            .from('profiles')
            .select('*, provinces:provinces!provinceKey(*)')
            .or(`slug.eq."${slug}",slug.eq."${cleanSlug}"`) 
            .eq('active', true) 
            .maybeSingle();

        if (!profile) return context.next();

        // Related Profiles
        let related = [];
        if (profile.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', profile.provinceKey)
                .eq('active', true)
                .neq('id', profile.id)
                .limit(4);
            related = relatedData || [];
        }

        // --- Data Preparation (ผสมผสาน) ---
        const rawName = profile.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;
        const safeDisplayName = escapeHtml(displayName); // Security
        
        const rawPriceValue = (profile.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = parseInt(rawPriceValue).toLocaleString() + ".-";
        
        const imageUrl = optimizeImg(profile.imagePath, 800);
        const provinceName = profile.provinces?.nameThai || profile.location || 'เชียงใหม่';
        const safeProvinceName = escapeHtml(provinceName);
        
        // Rating Logic (จากไฟล์ 1 - ดูมีหลักการกว่านิดหน่อย)
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // Content Spinning (จากไฟล์ 2 - ดีกว่า)
        const titleVariations = [
            `${safeDisplayName} ไซด์ไลน์${safeProvinceName} รับงานเอง ตรงปก ไม่ผ่านเอเย่นต์`,
            `รีวิว ${safeDisplayName} สาวสวย${safeProvinceName} ฟิวแฟน นิสัยดี`,
            `นัดเจอ ${safeDisplayName} พิกัด${profile.location || safeProvinceName} จ่ายหน้างาน 100%`,
            `${safeDisplayName} รับงาน${safeProvinceName} รูปจริง ตัวจริง ตรงปก`
        ];
        const pageTitle = `${spin(titleVariations)} - ${CONFIG.BRAND_NAME}`;

        const descVariations = [
            `น้อง${safeDisplayName} อายุ ${profile.age || '20+'} ปี รับงานไซด์ไลน์${safeProvinceName} พิกัด${profile.location || safeProvinceName} เป็นกันเอง`,
            `หาคนดูแลชั่วคราว? แนะนำ ${safeDisplayName} สาว${safeProvinceName} หน้าตาดี หุ่นดี ฟิวแฟนสุดๆ`,
            `ต้องการคนรู้ใจใน${safeProvinceName}? ทักหา ${safeDisplayName} ได้เลย รับงานเอง ไม่มัดจำ ปลอดภัย`
        ];
        const metaDesc = `${spin(descVariations)} ค่าขนม ${displayPrice} ทักไลน์จองคิวได้เลย`;
        
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${profile.slug}`;
        let finalLineUrl = profile.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;

        // ==========================================
        // SCHEMA (JSON-LD) - ยกมาจากไฟล์แรก (The Best)
        // ==========================================
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["Organization", "LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "logo": { "@type": "ImageObject", "url": `${CONFIG.DOMAIN}/logo.png` },
                    "image": [imageUrl],
                    "telephone": "0915674532", 
                    "priceRange": "฿฿", 
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": profile.location || provinceName,
                        "addressLocality": provinceName,
                        "addressRegion": provinceName,
                        "postalCode": "50000",
                        "addressCountry": "TH"
                    },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${profile.provinceKey || 'chiang-mai'}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": ["Service", "Product"], // ใช้ Product เพื่อ Rich Snippets
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
                        "priceValidUntil": "2026-12-31",
                        "seller": { "@id": `${CONFIG.DOMAIN}/#organization` },
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
                        "reviewBody": `${displayName} งานดีมากครับ พิกัด${profile.location} ตรงปกไม่จกตา บริการเป็นกันเองสุดๆ`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
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
        // HTML Template (ใช้ Style จากไฟล์แรก สวยกว่านิดหน่อย + Logic ไฟล์ 2)
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
    
    <meta property="og:locale" content="th_TH">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root{--p:#db2777;--s:#06c755}body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#1f2937;line-height:1.5}.c{max-width:480px;margin:0 auto;background:#fff;min-height:100vh}.h{width:100%;height:auto;display:block;aspect-ratio:3/4;object-fit:cover;background:#f3f4f6}.d{padding:24px}.r{display:flex;align-items:center;gap:4px;color:#fbbf24;font-weight:700;font-size:15px;margin-bottom:8px}h1{color:var(--p);font-size:22px;margin:0 0 16px 0;font-weight:800;line-height:1.3}.g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}.i{border:1px solid #f3f4f6;border-radius:16px;padding:16px;background:#f9fafb}.i b{display:block;font-size:11px;color:#9ca3af;text-transform:uppercase;margin-bottom:4px}.i span{font-size:16px;font-weight:700;color:#111827}.tx{font-size:15px;color:#4b5563;margin-bottom:24px}.btn{display:flex;align-items:center;justify-content:center;background:var(--s);color:#fff;padding:18px;border-radius:100px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 10px 15px -3px rgba(6,199,85,.4);transition:transform .2s}.btn:active{transform:scale(.98)}.ft{text-align:center;font-size:12px;color:#9ca3af;margin-top:30px;padding:20px}
    </style>
</head>
<body>
    <div class="c">
        <img src="${imageUrl}" class="h" alt="${safeDisplayName}" loading="lazy" decoding="async">
        <div class="d">
            <div class="r">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            <div class="g">
                <div class="i"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="i"><b>พิกัดพื้นที่</b><span>${profile.location || provinceName}</span></div>
            </div>
            <div class="tx">${metaDesc}</div>
            <a href="${finalLineUrl}" class="btn">📲 ทักไลน์จองคิว ${safeDisplayName}</a>

            ${related && related.length > 0 ? `
            <div style="margin-top:40px; padding-top:20px; border-top:2px solid #f3f4f6;">
                <span style="font-weight:800; color:#db2777; display:block; margin-bottom:15px; font-size:18px;">🔥 น้องๆ แนะนำใน${provinceName}:</span>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    ${related.map(r => `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" style="text-decoration:none; color:inherit; display:block;">
                            <img src="${optimizeImg(r.imagePath, 300)}" style="width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:12px; background:#eee;">
                            <div style="font-weight:700; margin-top:8px; font-size:14px; color:#1f2937;">น้อง${r.name}</div>
                            <div style="font-size:12px; color:#9ca3af; margin-top:2px;">📍 ${r.location || provinceName}</div>
                        </a>
                    `).join('')}
                </div>
            </div>` : ''}
            
            <div class="ft">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}</div>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow, max-image-preview:large",
                "cache-control": "public, max-age=7200, s-maxage=86400", // Caching จากไฟล์ 2
                "vary": "User-Agent"
            } 
        });

    } catch (e) {
        console.error("Render Bot Error:", e);
        return context.next();
    }
};