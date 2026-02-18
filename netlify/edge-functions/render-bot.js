import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://tskkgyikkeiucndtneoe.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2tneWlra2VpdWNuZHRuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzIyOTMsImV4cCI6MjA4NjEwODI5M30.-x6TN3XQS43QTKv4LpZv9AM4_Tm2q3R4Nd-KGo-KU1E',
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiang Mai (ไซด์ไลน์เชียงใหม่)',
    SOCIAL_PROFILES: [
        "https://linktr.ee/sidelinechiangmai",
        "https://x.com/Sdl_chiangmai",
        "https://line.me/ti/p/ksLUMz3p_o"
    ]
};

// ฟังก์ชันสุ่มคำ (Spintax)
const spin = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ฟังก์ชันย่อรูป (Image Optimization)
const optimizeImg = (path, width = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.startsWith('http')) return path;
    // สั่ง Supabase ย่อรูป + แปลงเป็น WebP
    return `${CONFIG.SUPABASE_URL}/storage/v1/object/public/profile-images/${path}?width=${width}&quality=80&format=webp`;
};

export default async (request, context) => {
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    // 2. LAYER 1: SECURITY & CLOAKING
    // เช็ค Bot แบบละเอียด (รวม Social Media Bot)
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless/i.test(ua);
    
    // ถ้าไม่ใช่ Bot ให้ไปหน้าเว็บหลัก (Client-side Rendering)
    if (!isBot) return context.next();

    // ==========================================
    // 3. SERVER-SIDE RENDERING (SSR)
    // ==========================================
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        // ตรวจสอบ URL ต้องเป็น /sideline/{slug}
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        // เชื่อมต่อ Database
        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // ดึงข้อมูล Profile + Province
        const { data: p } = await supabase
            .from('profiles')
            .select('*, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true) // ต้องเป็น active เท่านั้น
            .maybeSingle();

        if (!p) return context.next(); // ถ้าไม่เจอ ปล่อยไปหน้า 404

        // ดึงน้องๆ แนะนำ (Related) ในจังหวัดเดียวกัน
        let related = [];
        if (p.province_id) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('province_id', p.province_id)
                .eq('active', true)
                .neq('id', p.id) // ไม่เอาคนปัจจุบัน
                .limit(4);
            related = relatedData || [];
        }

        // --- เตรียมข้อมูลสำหรับแสดงผล ---
        const rawName = p.name || 'สาวสวย';
        const displayName = rawName.startsWith('น้อง') ? rawName : `น้อง${rawName}`;
        const provinceName = p.provinces?.nameThai || p.location || 'เชียงใหม่';
        const provinceKey = p.provinces?.key || 'chiangmai';

        const rawPriceValue = (p.rate || "1500").toString().replace(/[^0-9]/g, '');
        const displayPrice = parseInt(rawPriceValue).toLocaleString() + ".-";
        const imageUrl = optimizeImg(p.imagePath, 800);
        
        // Line Link Handling
        let finalLineUrl = p.lineId || 'ksLUMz3p_o';
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/${finalLineUrl}`;
        }

        // Rating Simulation (เพื่อให้ดาวขึ้นใน Google)
        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);

        // --- SEO SPINTAX (สุ่มคำไม่ให้ซ้ำ) ---
        const titleIntro = spin(["แนะนำ", "รีวิว", "พบกับ", "มาแรง", "ห้ามพลาด"]);
        const serviceWord = spin(["บริการฟิวแฟน", "เอาใจเก่ง", "งานดีตรงปก", "เป็นกันเอง", "ขี้อ้อน"]);
        const payWord = spin(["ไม่รับมัดจำ", "จ่ายหน้างานเท่านั้น", "เจอตัวค่อยจ่าย", "ปลอดภัย 100%"]);
        
        const pageTitle = `${titleIntro} ${displayName} - ไซด์ไลน์${provinceName} รับงานเอง ฟิวแฟน รูปตรงปก 100%`;
        const metaDesc = `${displayName} สาวไซด์ไลน์${provinceName} อายุ ${p.age || '20+'}ปี ${serviceWord} รับงานเองไม่ผ่านเอเย่นต์ ${payWord} รูปตรงปก พิกัด${p.location || provinceName} จองคิวทักไลน์เลย!`;
        const canonicalUrl = `${CONFIG.DOMAIN}/sideline/${slug}`;

        // ==========================================
        // SCHEMA MARKUP (JSON-LD) - เต็มสูบ
        // ==========================================
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
                        "price": rawPriceValue,
                        "priceCurrency": "THB",
                        "availability": "https://schema.org/InStock",
                        "url": canonicalUrl,
                        "priceValidUntil": "2026-12-31"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
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
                        { "@type": "Question", "name": `จอง${displayName} ต้องโอนมัดจำไหม?`, "acceptedAnswer": { "@type": "Answer", "text": "ไม่ต้องโอนมัดจำครับ เว็บไซต์เราเน้นความปลอดภัย ชำระเงินหน้างานเมื่อเจอน้องเท่านั้น" } },
                        { "@type": "Question", "name": `รูป${displayName} ตรงปกไหม?`, "acceptedAnswer": { "@type": "Answer", "text": `รูป${displayName} ตรงปก 100% ตรวจสอบโดยทีมงานแล้วครับ` } }
                    ]
                }
            ]
        };

        // ==========================================
        // HTML RENDERING
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
        <img src="${imageUrl}" class="h" alt="${displayName} ${provinceName}" loading="eager">
        <div class="d">
            <div class="r">⭐ ${ratingValue} <span>(${reviewCount} รีวิว)</span></div>
            <h1>${pageTitle}</h1>
            <div class="g">
                <div class="i"><b>ค่าขนมเริ่มต้น</b><span>${displayPrice}</span></div>
                <div class="i"><b>พิกัดพื้นที่</b><span>${p.location || provinceName}</span></div>
            </div>
            <div class="tx">
                ${metaDesc} <br><br>
                น้อง${displayName} เป็นกันเอง เอาใจเก่ง รูปตรงปก 100% สนใจจองคิวทักไลน์ได้เลยค่ะ
            </div>
            <a href="${finalLineUrl}" class="btn">📲 ทักไลน์จองคิว ${displayName}</a>

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
            
            <div class="ft">© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - มั่นใจ ปลอดภัย ไม่มัดจำ</div>
        </div>
    </div>
</body>
</html>`;

        return new Response(html, { 
            headers: { 
                "content-type": "text/html; charset=utf-8",
                "x-robots-tag": "index, follow",
                // CACHE 1 วัน เพื่อลด Load Database
                "Netlify-CDN-Cache-Control": "public, s-maxage=86400",
                "Cache-Control": "public, max-age=3600"
            } 
        });

    } catch (e) {
        console.error("Render Bot Error:", e);
        return context.next();
    }
};