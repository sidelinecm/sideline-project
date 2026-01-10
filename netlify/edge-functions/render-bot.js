import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ดักจับ Bot และ Inspection Tool
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).maybeSingle();
        if (!p) return context.next();

        // เตรียมข้อมูล
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const schemaPrice = rawRate > 0 ? rawRate : 1500;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        const ageText = (p.age && p.age !== 'null') ? p.age : '20+';
        const imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        
        // คำนวณดาว
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // SEO Texts
        const pageTitle = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
        const metaDesc = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${ageText}ปี ${p.stats || ''} รับงานฟิวแฟน ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น รูปตรงปก 100% ปลอดภัย พิกัด${p.location || provinceName} จองคิวคลิกเลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // Schema
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN }, { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/sideline/province/${provinceKey}` }, { "@type": "ListItem", "position": 3, "name": `น้อง${p.name}`, "item": canonicalUrl }] },
                {
                    "@type": "Product",
                    "name": `น้อง${p.name} ไซด์ไลน์${provinceName}`,
                    "image": imageUrl,
                    "description": metaDesc,
                    "sku": `SL-${p.id}`,
                    "mpn": `${p.slug}`,
                    "brand": { "@type": "Brand", "name": "Sideline Chiangmai" },
                    "offers": { "@type": "Offer", "url": canonicalUrl, "priceCurrency": "THB", "price": schemaPrice, "priceValidUntil": "2026-12-31", "availability": "https://schema.org/InStock", "itemCondition": "https://schema.org/NewCondition" },
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount, "bestRating": "5", "worstRating": "1" },
                    "review": { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "ลูกค้าสมาชิก (Verified User)" }, "datePublished": p.created_at ? p.created_at.split('T')[0] : "2024-01-01", "reviewBody": `น้อง${p.name} ตัวจริงน่ารักมากครับ ตรงปกตามรูปเลย ไม่ผิดหวัง บริการเป็นกันเองสุดๆ แนะนำครับ` }
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
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
        body { margin: 0; padding: 0; font-family: 'Sarabun', 'Prompt', sans-serif; background-color: #ffffff; color: #333; line-height: 1.5; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; padding-bottom: 40px; border-right: 1px solid #f0f0f0; border-left: 1px solid #f0f0f0; min-height: 100vh; }
        .hero-img { width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 4/3; background-color: #eee; }
        .content { padding: 20px; }
        .rating-box { color: #f59e0b; font-weight: bold; font-size: 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 5px; }
        h1 { color: #db2777; font-size: 22px; margin: 0 0 20px 0; font-weight: 700; line-height: 1.3; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #f9fafb; display: flex; flex-direction: column; justify-content: center; }
        .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
        .info-value { font-size: 15px; font-weight: 700; color: #111; }
        .alert-box { background-color: #fdf2f8; color: #be185d; padding: 14px; border-radius: 12px; font-size: 13px; text-align: center; margin-bottom: 24px; border: 1px solid #fbcfe8; font-weight: 500; }
        .btn-contact { display: flex; align-items: center; justify-content: center; width: 100%; background-color: #06c755; color: white; padding: 14px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 10px rgba(6, 199, 85, 0.25); transition: transform 0.2s; }
        .home-link { display: block; text-align: center; margin-top: 20px; font-size: 13px; color: #9ca3af; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero-img" alt="${pageTitle}" onerror="this.src='${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp'">
        <div class="content">
            <div class="rating-box">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${pageTitle}</h1>
            <div class="info-grid">
                <div class="info-card"><span class="info-label">ราคาเริ่มต้น</span><span class="info-value" style="color: #db2777;">${displayPrice}</span></div>
                <div class="info-card"><span class="info-label">สัดส่วน</span><span class="info-value">${p.stats || '-'}</span></div>
                <div class="info-card"><span class="info-label">อายุ</span><span class="info-value">${ageText} ปี</span></div>
                <div class="info-card"><span class="info-label">พิกัด</span><span class="info-value">${p.location || provinceName}</span></div>
            </div>
            <div class="alert-box">งานดีตรงปก ไม่เร่งรีบ บริการเป็นกันเอง<br>รับรองความประทับใจค่ะ 💕</div>
            <a href="https://line.me/ti/p/${p.lineId || 'ksLUWB89Y_'}" class="btn-contact">📲 ติดต่อสอบถาม / จองคิวคลิก</a>
            <a href="/" class="home-link">🏠 กลับหน้าหลัก Sideline Chiangmai</a>
        </div>
    </div>
</body>
</html>`;
        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } });
    } catch (e) { return context.next(); }
};