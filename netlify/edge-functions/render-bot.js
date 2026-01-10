import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // Bot Detection Includes Google Inspection Tool & Social Media
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .maybeSingle();
        
        if (!p) return context.next();

        // --- Data Preparation ---
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        
        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const schemaPrice = rawRate > 0 ? rawRate : 1500;
        const displayPrice = rawRate > 0 ? rawRate.toLocaleString() : 'สอบถาม';
        
        const ageText = (p.age && p.age !== 'null') ? `${p.age} ปี` : '20+ ปี';
        const imageUrl = `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}`;
        
        // Rating Logic
        const seed = slug.length;
        const ratingValue = (4.5 + (seed % 5) / 10).toFixed(1);
        const reviewCount = 85 + (seed % 60);

        // 🔥 SEO UPDATE: ปรับ Wording ให้ตรงกับ GSC และ main.js
        const pageTitle = `น้อง${p.name} ไซด์ไลน์${provinceName} รับงานเอง ราคา ${displayPrice} ไม่มัดจำ จ่ายหน้างาน | Sideline Chiangmai`;
        const metaDesc = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${ageText} พิกัด ${p.location || provinceName} รับงานฟิวแฟน รูปตรงปก 100% ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น ปลอดภัย มีแอดมินดูแล`;
        
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // --- Schema.org ---
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN
                    },{
                        "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/sideline/province/${provinceKey}`
                    },{
                        "@type": "ListItem", "position": 3, "name": `น้อง${p.name}`, "item": canonicalUrl
                    }]
                },
                {
                    "@type": "Product",
                    "name": `น้อง${p.name} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": metaDesc,
                    "sku": `SL-${p.id || slug}`,
                    "mpn": `SL-${p.id || slug}`,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": {
                        "@type": "Offer",
                        "url": canonicalUrl,
                        "priceCurrency": "THB",
                        "price": schemaPrice, // Number Format
                        "priceValidUntil": "2026-12-31",
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount,
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [{
                        "@type": "Question",
                        "name": `น้อง ${p.name} รับงานโซนไหนบ้าง?`,
                        "acceptedAnswer": { "@type": "Answer", "text": `น้อง ${p.name} สะดวกรับงานในโซน ${p.location || provinceName} และพื้นที่ใกล้เคียง` }
                    }, {
                        "@type": "Question",
                        "name": "รับประกันตัวจริงตรงปกไหม?",
                        "acceptedAnswer": { "@type": "Answer", "text": "ทางเว็บการันตีรูปถ่ายตัวจริง 100% น้องๆ ผ่านการยืนยันตัวตนแล้ว รับประกันความตรงปกค่ะ" }
                    }, {
                        "@type": "Question",
                        "name": "ต้องโอนมัดจำไหม?",
                        "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำครับ เว็บ Sideline Chiangmai ให้ชำระเงินหน้างานกับน้องโดยตรง ปลอดภัย 100%" }
                    }]
                }
            ]
        };

        // --- HTML Output ---
        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:type" content="profile">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:site_name" content="Sideline Chiangmai">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        body { font-family: 'Prompt', sans-serif; margin: 0; background: #f3f4f6; color: #1f2937; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; min-height: 100vh; position: relative; }
        .hero-wrapper { position: relative; width: 100%; aspect-ratio: 1/1; background: #eee; }
        .hero-img { width: 100%; height: 100%; object-fit: cover; }
        .verified-badge { position: absolute; bottom: 10px; right: 10px; background: #06c755; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .content { padding: 20px; }
        .breadcrumb { font-size: 12px; color: #6b7280; margin-bottom: 15px; }
        .breadcrumb a { color: #6b7280; text-decoration: none; }
        h1 { color: #db2777; font-size: 20px; margin: 0 0 10px 0; line-height: 1.4; }
        .rating { color: #f59e0b; font-size: 14px; font-weight: bold; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .info-box { background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center; }
        .label { font-size: 11px; color: #6b7280; display: block; }
        .val { font-weight: bold; font-size: 14px; color: #111; }
        .val.price { color: #db2777; font-size: 16px; }
        .description { background: #fff1f2; padding: 15px; border-radius: 10px; font-size: 14px; line-height: 1.6; margin-bottom: 20px; border: 1px solid #fecdd3; }
        .btn-line { display: block; background: #06c755; color: white; text-align: center; padding: 15px; border-radius: 50px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 10px rgba(6,199,85,0.3); }
        .home-link { display: block; text-align: center; margin-top: 20px; color: #db2777; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero-wrapper">
            <img src="${imageUrl}" alt="${p.name} ${provinceName}" class="hero-img" onerror="this.src='${CONFIG.DOMAIN}/sidelinechiangmai-social-preview.webp'">
            ${p.verified ? '<div class="verified-badge">✓ ยืนยันตัวตนแล้ว</div>' : ''}
        </div>
        <div class="content">
            <div class="breadcrumb">
                <a href="/">หน้าแรก</a> &rsaquo; 
                <a href="/sideline/province/${provinceKey}">${provinceName}</a> &rsaquo; 
                <span>น้อง${p.name}</span>
            </div>
            <div class="rating">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง</h1>
            <div class="info-grid">
                <div class="info-box"><span class="label">ค่าขนม</span><span class="val price">${displayPrice}</span></div>
                <div class="info-box"><span class="label">สัดส่วน</span><span class="val">${p.stats || '-'}</span></div>
                <div class="info-box"><span class="label">อายุ</span><span class="val">${ageText}</span></div>
                <div class="info-box"><span class="label">พิกัด</span><span class="val">${p.location || provinceName}</span></div>
            </div>
            <div class="description">
                ${p.description || 'รับงานเอง ใจดี ตรงปก ไม่เร่งรีบ คุยง่าย บริการเป็นกันเอง รับรองความประทับใจค่ะ'}
                <br><br><strong>📌 การันตี: ไม่มัดจำ จ่ายหน้างาน 100%</strong>
            </div>
            <a href="https://line.me/ti/p/ksLUWB89Y_" class="btn-line">📲 ทักไลน์ / จองคิว</a>
            <a href="/" class="home-link">🏠 กลับหน้าหลัก</a>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    } catch (e) { return context.next(); }
};