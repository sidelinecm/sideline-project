import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

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

// --- HELPERS ---
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ==========================================
    // 2. LAYER 1-3 SECURITY (CLOAKING)
    // ==========================================
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    const geo = context.geo || {};
    const isSuspicious = !geo.city || geo.country?.code !== 'TH';

    // [ACTION] คนไทยตัวจริง -> ไปหน้าเว็บหลัก (Client-side)
    if (!isBot && !isSuspicious) return context.next();

    // ==========================================
    // 3. FULL SERVER-SIDE RENDERING (SSR) - [MASTER EDITION]
    // ==========================================
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        // ตรวจสอบว่าเป็น Path ของโปรไฟล์น้องๆ หรือไม่
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        // 1. ดึง Slug และทำความสะอาด
        let slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const cleanSlug = slug.replace(/(-\d+)(?:-\d+)+$/, '$1');

        // ข้ามคำที่ไม่ใช่ชื่อน้อง
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 2. ค้นหาข้อมูลน้องๆ
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(*)')
            .or(`slug.eq."${slug}",slug.eq."${cleanSlug}"`) 
            .maybeSingle();

        if (!p) return context.next();

        // 3. ดึงน้องๆ แนะนำ
        let related = [];
        if (p.province_id) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('province_id', p.province_id)
                .eq('status', 'active')
                .neq('id', p.id)
                .limit(4);
            related = relatedData || [];
        }

        // --- 🛠️ DATA PREPARATION ---
        const rawName = p.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;

        const rawPriceValue = (p.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = parseInt(rawPriceValue || "1500").toLocaleString() + ".-";
        
        // ใช้ฟังก์ชัน optimizeImg จัดการรูปหลัก
        const imageUrl = optimizeImg(p.imagePath, 800);
        
        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        
        const charCodeSum = cleanSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 3) / 10).toFixed(1);
        const reviewCount = 120 + (charCodeSum % 80);

        // --- SEO SPINTAX ---
        const titleIntro = spin(["แนะนำ", "โปรไฟล์", "รีวิว", "น้อง", "มาแรง"]);
        const serviceWord = spin(["บริการฟิวแฟน", "งานเอนเตอร์เทน", "ดูแลดี", "คุยสนุก"]);
        const payWord = spin(["ไม่ต้องโอนมัดจำ", "จ่ายหน้างานเท่านั้น", "นัดเจอจ่ายสด", "ปลอดภัย 100%"]);
        
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ${serviceWord} ตรงปก`;
        const metaDesc = `${displayName} สาวสวยรับงานไซด์ไลน์ ${provinceName} อายุ ${p.age || '20+'} ปี ${serviceWord} รับงานเองไม่ผ่านเอเย่นต์ ${payWord} พิกัด${p.location || provinceName} ดูรูปตัวจริงและจองคิวทักไลน์ได้เลย`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${cleanSlug}`;
        
        // --- STRUCTURED DATA ---
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
                    "telephone": "0917653458", 
                    "priceRange": "฿฿", 
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": p.location || "Chiang Mai",
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
                        "priceValidUntil": "2026-12-31",
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

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root{--p:#db2777;--s:#06c755}body{margin:0;padding:0;font-family:-apple-system,system-ui,sans-serif;background:#fff;color:#1f2937;line-height:1.5}.c{max-width:480px;margin:0 auto;min-height:100vh}.h{width:100%;height:auto;display:block;aspect-ratio:3/4;object-fit:cover;background:#f3f4f6}.d{padding:24px}.r{display:flex;align-items:center;gap:4px;color:#fbbf24;font-weight:700;margin-bottom:8px}h1{color:var(--p);font-size:24px;margin:0 0 16px 0;font-weight:800}.g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}.i{border:1px solid #f3f4f6;border-radius:16px;padding:16px;background:#f9fafb}.i b{display:block;font-size:11px;color:#9ca3af;text-transform:uppercase}.i span{font-size:16px;font-weight:700;color:#111827}.btn{display:flex;align-items:center;justify-content:center;background:var(--s);color:#fff;padding:18px;border-radius:100px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 10px 15px -3px rgba(6,199,85,.4)}.ft{text-align:center;font-size:12px;color:#9ca3af;margin-top:30px;padding:20px}
    </style>
</head>
<body>
    <div class="c">
        <img src="${imageUrl}" class="h" alt="${displayName}" fetchpriority="high" decoding="async">
        <div class="d">
            <div class="r">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            <div class="g">
                <div class="i"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="i"><b>พิกัดพื้นที่</b><span>${p.location || provinceName}</span></div>
            </div>
            <div style="margin-bottom:24px; color:#4b5563;">${metaDesc}</div>
            <a href="${finalLineUrl}" class="btn">📲 ทักไลน์จองคิว ${displayName}</a>

            ${related && related.length > 0 ? `
            <div style="margin-top:40px; padding-top:20px; border-top:2px solid #f3f4f6;">
                <span style="font-weight:800; color:#db2777; display:block; margin-bottom:15px; font-size:18px;">🔥 น้องๆ แนะนำใน${provinceName}:</span>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    ${related.map(r => `
                        <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" style="text-decoration:none; color:inherit; display:block;">
                            <img src="${optimizeImg(r.imagePath, 350)}" style="width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:12px; background:#eee;">
                            <div style="font-weight:700; margin-top:8px; font-size:14px; color:#1f2937;">น้อง${r.name}</div>
                            <div style="font-size:12px; color:#9ca3af; margin-top:2px;">📍 ${r.location || provinceName}</div>
                        </a>
                    `).join('')}
                </div>
            </div>` : ''}
            
            <div class="ft">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - มั่นใจ ปลอดภัย ไม่มัดจำ</div>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, s-maxage=86400"
            } 
        });

    } catch (e) {
        console.error("Render Bot Error:", e);
        return context.next();
    }
};