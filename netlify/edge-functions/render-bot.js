import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    STORAGE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co/storage/v1/object/public/profile-images',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: ["https://linktr.ee/sidelinechiangmai", "https://x.com/Sdl_chiangmai"]
};

const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];
const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/sidelinechiangmai-social-preview.webp`;
    if (path.startsWith('http')) return path;
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|applebot|telegram|discord|lighthouse|headless/i.test(ua);
    
    // ✅ นำส่วน Security/Geo กลับมา
    const geo = context.geo || {};
    const isSuspicious = !geo.city || (geo.country?.code !== 'TH' && geo.country?.code !== 'US');

    if (!isBot && !isSuspicious) return context.next();

    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();

        let slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        const cleanSlug = slug.includes('-') ? slug.split('-').slice(0, -1).join('-') : slug;
        if (['province', 'search', 'location'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูลตาม Schema จริง (provinceKey / active)
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces:provinces!provinceKey(*)')
            .or(`slug.eq."${slug}",slug.eq."${cleanSlug}"`) 
            .eq('active', true) 
            .maybeSingle();

        if (!p) return context.next(); 

        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase.from('profiles').select('slug, name, imagePath, location').eq('provinceKey', p.provinceKey).eq('active', true).neq('id', p.id).limit(4);
            related = relatedData || [];
        }

        const displayName = p.name.startsWith('น้อง') ? p.name : `น้อง${p.name}`;
        const rawPrice = (p.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = (parseInt(rawPrice) || 1500).toLocaleString() + ".-";
        const imageUrl = optimizeImg(p.imagePath, 800);
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const ratingValue = (4.7 + (p.id % 3) / 10).toFixed(1);
        const reviewCount = (120 + (p.id % 80)).toString();

        // ✅ FIX: ประกาศตัวแปร canonicalUrl และ finalLineUrl ที่ขาดหายไป
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${p.slug}`;
        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        const pageTitle = `${spin(["โปรไฟล์","รีวิว","แนะนำ"])} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ตรงปก`;
        const metaDesc = `${displayName} รับงานไซด์ไลน์ ${provinceName} อายุ ${p.age || '20+'} ปี ฟิวแฟน รับงานเองไม่ผ่านเอเย่นต์ จ่ายหน้างานเท่านั้น พิกัด${p.location || provinceName}`;

        // ✅ นำ Schema กลับมาครบชุด (Organization, Breadcrumb, Product, FAQ)
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                { "@type": "Organization", "name": CONFIG.BRAND_NAME, "url": CONFIG.DOMAIN, "logo": `${CONFIG.DOMAIN}/logo.png` },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": CONFIG.DOMAIN },
                        { "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": `${CONFIG.DOMAIN}/location/${p.provinceKey}` },
                        { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl } // FIX: ใช้ตัวแปรที่ประกาศไว้
                    ]
                },
                {
                    "@type": "Product",
                    "name": pageTitle,
                    "image": [imageUrl],
                    "description": metaDesc,
                    "offers": { "@type": "Offer", "price": rawPrice, "priceCurrency": "THB", "availability": "https://schema.org/InStock" },
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        { "@type": "Question", "name": `จอง${displayName} ต้องมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องมัดจำครับ จ่ายเงินหน้างานเท่านั้น" } },
                        { "@type": "Question", "name": `พิกัดของ ${displayName} อยู่แถวไหน?`, "acceptedAnswer": { "@type": "Answer", "text": `น้องอยู่ที่ ${p.location || provinceName} ครับ` } }
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
    <meta name="google-site-verification" content="0N_IQUDZv9Y2WtNhjqSPTV3TuPsildmmO-TPwdMlSfg" />
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
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root{--p:#db2777;--s:#06c755}body{margin:0;padding:0;font-family:-apple-system,system-ui,sans-serif;background:#fff;color:#1f2937;line-height:1.5}.c{max-width:480px;margin:0 auto;min-height:100vh}.h{width:100%;height:auto;display:block;aspect-ratio:3/4;object-fit:cover;background:#f3f4f6}.d{padding:24px}.r{display:flex;align-items:center;gap:4px;color:#fbbf24;font-weight:700;margin-bottom:8px}h1{color:var(--p);font-size:24px;margin:0 0 16px 0;font-weight:800}.g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}.i{border:1px solid #f3f4f6;border-radius:16px;padding:16px;background:#f9fafb}.i b{display:block;font-size:11px;color:#9ca3af;text-transform:uppercase}.i span{font-size:16px;font-weight:700;color:#111827}.btn{display:flex;align-items:center;justify-content:center;background:var(--s);color:#fff;padding:18px;border-radius:100px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 10px 15px -3px rgba(6,199,85,.4)}.ft{text-align:center;font-size:12px;color:#9ca3af;margin-top:30px;padding:20px}
    </style>
</head>
<body>
    <div class="c">
        <img src="${imageUrl}" class="h" alt="${displayName} ไซด์ไลน์${provinceName}" fetchpriority="high" decoding="async">
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
                            <img src="${optimizeImg(r.imagePath, 350)}" style="width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:12px; background:#eee;" alt="โปรไฟล์แนะนำ น้อง${r.name} ไซด์ไลน์${provinceName}">
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
