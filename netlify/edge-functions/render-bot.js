/* global URL, Response, fetch */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ==========================================
// 1. CONFIGURATION & SEO ENTITY
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai',
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
    // 2. ADVANCED CLOAKING LAYER
    // ==========================================
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
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

    // คนจริง -> ไปหน้าเว็บหลัก (Client-side app)
    if (!isBot && !isSuspicious && !isDataCenter) return context.next();

    // ==========================================
    // 3. SERVER-SIDE RENDERING (SSR) FOR BOTS
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

        // --- เตรียมข้อมูล Dynamic ---
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const displayPrice = p.rate ? `${parseInt(p.rate).toLocaleString()}` : '1,500';
        const imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/default.webp`;
        
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // --- SEO Optimization: Meta Tags ---
        const pageTitle = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
        const metaDesc = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี บริการฟิวแฟน ไม่ต้องโอนมัดจำ ชำระเงินหน้างาน รูปตรงปกปลอดภัย 100% พิกัด${p.location || provinceName} จองคิวคลิก!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // --- B. STRUCTURED DATA (JSON-LD) ---
        const jsonLd = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
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
                    "name": pageTitle,
                    "image": imageUrl,
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": displayPrice.replace(',', ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl
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
                        "author": { "@type": "Person", "name": "Verified Client" },
                        "reviewBody": `น้อง${p.name} งานดีมากครับ พิกัด${p.location} ตรงปกไม่จกตา`,
                        "reviewRating": { "@type": "Rating", "ratingValue": "5" }
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [{
                        "@type": "Question",
                        "name": `จองคิวน้อง${p.name} ต้องมัดจำไหม?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `ไม่ต้องโอนมัดจำล่วงหน้า ชำระเงินหน้างานเมื่อเจอน้อง${p.name} เท่านั้น ปลอดภัย 100%`
                        }
                    }]
                }
            ]
        };

        // --- 4. HTML OUTPUT (SSR) ---
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <meta property="og:type" content="website">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, sans-serif; background: #fff; line-height: 1.6; }
        .container { max-width: 500px; margin: 0 auto; }
        .hero { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
        .content { padding: 25px; }
        .stars { color: #fbbf24; font-weight: bold; }
        h1 { color: #db2777; font-size: 24px; margin: 10px 0; }
        .price-tag { font-size: 20px; font-weight: bold; color: #111; margin: 15px 0; }
        .btn { display: block; background: #06c755; color: #fff; text-align: center; padding: 18px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 30px; box-shadow: 0 4px 15px rgba(6,199,85,0.4); }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero" alt="${p.name}">
        <div class="content">
            <div class="stars">⭐ ${ratingValue} (${reviewCount} รีวิวจากลูกค้าจริง)</div>
            <h1>${pageTitle}</h1>
            <div class="price-tag">ค่าขนมเริ่มต้น: ${displayPrice}.-</div>
            <p><b>พิกัดงาน:</b> ${p.location || provinceName}</p>
            <p>น้อง${p.name} รับงานไซด์ไลน์ ฟิวแฟน บริการดี เป็นกันเอง ไม่ต้องโอนมัดจำ เจอตัวก่อนค่อยจ่าย ปลอดภัยแน่นอน</p>
            <a href="https://line.me/ti/p/${p.lineId || 'ksLUWB89Y_'}" class="btn">📲 ทักไลน์จองคิว น้อง${p.name}</a>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow" 
            } 
        });

    } catch (e) {
        return context.next();
    }
};