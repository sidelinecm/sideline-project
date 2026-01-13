import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CONFIG = {
    SUPABASE_URL: 'https://hgzbgpbmymoiwjpaypvl.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemJncGJteW1vaXdqcGF5cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyMDYsImV4cCI6MjA2MjY4MTIwNn0.dIzyENU-kpVD97WyhJVZF9owDVotbl1wcYgPTt9JL_8',
    DOMAIN: 'https://sidelinechiangmai.netlify.app'
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const clientIP = request.headers.get('x-nf-client-connection-ip') || ''; // ดึง IP จาก Netlify
    
    // 1. ดักจับ Bot และ Inspection Tool จาก User-Agent
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|skype|curl|wget|inspectiontool|lighthouse/i.test(ua);
    
    // 2. ดักจับคนตรวจสอบที่ปลอมตัวมา (เช็คผ่าน IP Hosting/Data Center)
    let isDataCenter = false;
    if (clientIP && clientIP !== '127.0.0.1') {
        try {
            // ใช้ API เช็คว่า IP นี้มาจากค่าย Hosting (เช่น AWS, Google) หรือไม่
            const ipCheck = await fetch(`http://ip-api.com/json/${clientIP}?fields=hosting`);
            const ipData = await ipCheck.json();
            isDataCenter = ipData.hosting === true;
        } catch (e) {
            isDataCenter = false; // ถ้า API เช็ค IP ล่ม ให้ปล่อยผ่านไปก่อน
        }
    }

    // ถ้าไม่ใช่ Bot และไม่ใช่ IP จาก Data Center ให้แสดงหน้าเว็บจริง (Client-side JS)
    if (!isBot && !isDataCenter) return context.next();

    // --- ถ้าเป็น Bot หรือพวกตรวจสอบ (Data Center) ให้รัน Logic ด้านล่างเพื่อส่งหน้า HTML หลอก/SEO ---
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        const { data: p } = await supabase.from('profiles').select('*, provinces(nameThai, key)').eq('slug', slug).maybeSingle();
        if (!p) return context.next();

        // [ส่วนที่เหลือของโค้ดพี่เหมือนเดิมทั้งหมด...]
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const rawRate = p.rate ? parseInt(p.rate.toString().replace(/[^0-9]/g, '')) : 0;
        const schemaPrice = rawRate > 0 ? rawRate : 1500;
        const displayPrice = rawRate > 0 ? `${rawRate.toLocaleString()}.-` : 'สอบถาม';
        const ageText = (p.age && p.age !== 'null') ? p.age : '20+';
        const imageUrl = p.imagePath ? `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${p.imagePath}` : `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
        
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        const pageTitle = `น้อง${p.name} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน ตรงปก 100%`;
        const metaDesc = `น้อง${p.name} สาวไซด์ไลน์${provinceName} อายุ ${ageText}ปี ${p.stats || ''} รับงานฟิวแฟน ไม่ต้องโอนมัดจำ ชำระเงินหน้างานเท่านั้น รูปตรงปก 100% ปลอดภัย พิกัด${p.location || provinceName} จองคิวคลิกเลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

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
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    <style>
        body { margin: 0; padding: 0; font-family: sans-serif; background-color: #ffffff; color: #333; line-height: 1.5; }
        .container { max-width: 480px; margin: 0 auto; padding-bottom: 40px; }
        .hero-img { width: 100%; height: auto; display: block; }
        .content { padding: 20px; }
        h1 { color: #db2777; font-size: 22px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #f9fafb; }
        .btn-contact { display: block; text-align: center; background-color: #06c755; color: white; padding: 14px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero-img" alt="${pageTitle}">
        <div class="content">
            <div class="rating-box">⭐ ${ratingValue} (${reviewCount} รีวิว)</div>
            <h1>${pageTitle}</h1>
            <div class="info-grid">
                <div class="info-card">ราคาเริ่มต้น: ${displayPrice}</div>
                <div class="info-card">พิกัด: ${p.location || provinceName}</div>
            </div>
            <a href="https://line.me/ti/p/${p.lineId || 'ksLUWB89Y_'}" class="btn-contact">📲 ติดต่อสอบถาม / จองคิวคลิก</a>
        </div>
    </div>
</body>
</html>`;
        return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" } });
    } catch (e) { return context.next(); }
};