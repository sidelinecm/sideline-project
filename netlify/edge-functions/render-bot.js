import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://zxetzqwjaiumqhrpumln.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// ฟังก์ชันสุ่มคำ (Spintax) เพื่อให้เนื้อหาไม่ซ้ำกันในสายตา Google
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ฟังก์ชันดึงรูปภาพแบบ Hybrid (รองรับทั้ง Cloudinary และ Supabase Storage)
const optimizeImg = (path) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path; // หากเป็นลิงก์ Cloudinary ให้ใช้ตรงๆ
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}`; // หากเป็นชื่อไฟล์ให้ดึงจาก Supabase
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // ตรวจสอบว่าเป็น Bot หรือ Social Media Crawler หรือไม่
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    
    // ถ้าไม่ใช่ Bot ให้ปล่อยผ่านไปใช้ Client-side Rendering ปกติ
    if (!isBot) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        // ตรวจสอบว่าต้องเป็น URL รูปแบบ /sideline/{slug}
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        
        // ป้องกัน slug ที่เป็นคำสั่งระบบ
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        // เชื่อมต่อ Database
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูล Profile และข้อมูลจังหวัดที่เชื่อมโยงกัน
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        // หากไม่พบข้อมูลโปรไฟล์ ให้ปล่อยไปหน้า 404 ของระบบหลัก
        if (!p) return context.next();

        // ดึงโปรไฟล์แนะนำในจังหวัดเดียวกัน (Related Profiles)
        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', p.provinceKey)
                .eq('active', true)
                .neq('id', p.id) 
                .limit(4);
            related = relatedData || [];
        }

        // เตรียมตัวแปรสำหรับแสดงผล
        const displayName = p.name || 'สาวสวย';
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';
        const displayPrice = parseInt(p.rate || "1500").toLocaleString() + ".-";
        const imageUrl = optimizeImg(p.imagePath);
        
        // จัดการลิงก์ LINE (รองรับทั้ง ID และ URL)
        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        // จำลอง Rating เพื่อให้ Google แสดงผล Rich Snippets (ดาว)
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // SEO Spintax
        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "มาแรง", "ห้ามพลาด"]);
        const serviceWord = spin(["บริการฟิวแฟน", "เอาใจเก่ง", "งานดีตรงปก", "เป็นกันเอง", "ขี้อ้อน"]);
        const payWord = spin(["ไม่รับมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน รูปตรงปก 100%`;
        const metaDesc = `${displayName} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${serviceWord} รับงานเองไม่ผ่านเอเย่นต์ ${payWord} รูปตรงปก พิกัด${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // สร้าง Schema Markup (JSON-LD)
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["Organization", "LocalBusiness"],
                    "@id": `${CONFIG.DOMAIN}/#organization`,
                    "name": CONFIG.BRAND_NAME,
                    "url": CONFIG.DOMAIN,
                    "image": [imageUrl],
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressCountry": "TH"
                    },
                    "sameAs": CONFIG.SOCIAL_PROFILES
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
                    ]
                },
                {
                    "@type": "Product",
                    "@id": `${canonicalUrl}#product`,
                    "name": pageTitle,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "brand": { "@type": "Brand", "name": CONFIG.BRAND_NAME },
                    "offers": {
                        "@type": "Offer",
                        "price": (p.rate || "1500").toString().replace(/[^0-9]/g, ''),
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    }
                }
            ]
        };

        // โครงสร้าง HTML (Full Version)
        const html = `<!DOCTYPE html>
<html lang="th" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:locale" content="th_TH">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">

    <!-- Schema Markup -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --primary: #db2777; --success: #06c755; --dark: #1f2937; --light: #f3f4f6; }
        body { margin: 0; padding: 0; font-family: -apple-system, sans-serif; background: #fff; color: var(--dark); line-height: 1.6; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; min-height: 100vh; border-left: 1px solid var(--light); border-right: 1px solid var(--light); }
        .hero-img { width: 100%; height: auto; display: block; aspect-ratio: 3/4; object-fit: cover; background: var(--light); }
        .content { padding: 24px; }
        .rating-box { display: flex; align-items: center; gap: 4px; color: #fbbf24; font-weight: 700; font-size: 15px; margin-bottom: 8px; }
        h1 { color: var(--primary); font-size: 24px; margin: 0 0 16px 0; font-weight: 800; line-height: 1.2; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-item { border: 1px solid var(--light); border-radius: 16px; padding: 16px; background: #f9fafb; }
        .info-item b { display: block; font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; }
        .info-item span { font-size: 16px; font-weight: 700; color: #111827; }
        .description { font-size: 15px; color: #4b5563; margin-bottom: 24px; white-space: pre-line; }
        .btn-line { display: flex; align-items: center; justify-content: center; background: var(--success); color: #fff; padding: 18px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 10px 15px -3px rgba(6,199,85,.4); margin-bottom: 30px; }
        .related-title { font-weight: 800; color: var(--primary); display: block; margin-bottom: 15px; font-size: 18px; border-top: 1px solid var(--light); pt: 20px; }
        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .related-card { text-decoration: none; color: inherit; display: block; }
        .related-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 12px; background: #eee; }
        .related-card-name { font-weight: 700; margin-top: 8px; font-size: 14px; color: var(--dark); }
        .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 40px; padding: 20px; border-top: 1px solid var(--light); }
    </style>
</head>
<body>
    <div class="container">
        <img src="${imageUrl}" class="hero-img" alt="${displayName} ${provinceName}">
        <div class="content">
            <div class="rating-box">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            <div class="info-grid">
                <div class="info-item"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="info-item"><b>พิกัดพื้นที่</b><span>${p.location || provinceName}</span></div>
            </div>
            <div class="description">
                ${p.description || metaDesc}
            </div>
            <a href="${finalLineUrl}" class="btn-line">📲 ทักไลน์จองคิว ${displayName}</a>

            ${related.length > 0 ? `
            <span class="related-title">🔥 น้องๆ แนะนำใน${provinceName}:</span>
            <div class="related-grid">
                ${related.map(r => `
                    <a href="${CONFIG.DOMAIN}/sideline/${r.slug}" class="related-card">
                        <img src="${optimizeImg(r.imagePath)}" alt="${r.name}">
                        <div class="related-card-name">${r.name}</div>
                        <div style="font-size:12px; color:#9ca3af; margin-top:2px;">📍 ${r.location || provinceName}</div>
                    </a>
                `).join('')}
            </div>` : ''}
            
            <div class="footer">
                © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - มั่นใจ ปลอดภัย ไม่มีการมัดจำ
            </div>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                "Cache-Control": "public, s-maxage=86400"
            } 
        });

    } catch (e) {
        console.error("Render Bot Error:", e);
        return context.next();
    }
};