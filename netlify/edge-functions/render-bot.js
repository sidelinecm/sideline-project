/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY OPTIMIZED ]
 * Project: Nexus Entity Framework - Serverless Crawler Handler
 * Authority: Extended Crawler Identification, Dynamic Link Building & Schema Architecture
 * Optimization: Anti-Duplicate Naming, Safe Breadcrumb Structuring & Advanced Trust Marker Integration
 * Year: 2026 Core Engine Compliant
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || 'https://zxetzqwjaiumqhrpumln.supabase.co'; } catch { return 'https://zxetzqwjaiumqhrpumln.supabase.co'; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; } catch { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; }
    },
    DOMAIN: 'https://sidelinechiangmai.netlify.app',
    BRAND_NAME: 'Sideline Chiangmai Directory',
    PHONE: '091-7895644',
    SOCIAL_PROFILES: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@sidelinechiangmai',
        twitter: 'https://twitter.com/sidelinechiangmai',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstfiwfans.com',
        linktree: 'https://linktr.ee/kissmodel',
        bluesky: 'https://bsky.app/profile/sidelinechiangmai.bsky.social'
    }
};

const TESTIMONIALS = [
    { name: "พี่บอล", rating: 5, text: "ตรงปกมากครับ น้องบริการดีเยี่ยม ฟิวแฟนแท้ๆ เลย" },
    { name: "คุณเอก", rating: 5, text: "น้องเอาใจเก่งมาก สวยสมราคา จองง่ายปลอดภัยครับ" },
    { name: "พี่โจ", rating: 5, text: "จองผ่านไลน์ง่ายมาก ไม่ต้องโอนมัดจำ ไปหาหน้างานสบายใจสุดๆ" }
];

const getDeterministicValue = (min, max, seedString, offset = 0) => {
    const sum = seedString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + offset;
    return Math.floor(min + (sum % (max - min + 1)));
};

const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/default.webp`;
    if (path.includes('res.cloudinary.com')) {
        return path.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
    }
    return path.startsWith('http') 
        ? path 
        : `${CONFIG.SUPABASE_URL}/storage/v1/render/image/public/profile-images/${path}?width=${width}&height=${height}&resize=cover`;
};

const generateSrcSet = (path) => {
    if (!path) return '';
    const widths = [400, 600, 800];
    return widths.map(w => {
        const h = Math.round(w * (800 / 600)); 
        return `${optimizeImg(path, w, h)} ${w}w`;
    }).join(', ');
};

const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';
const cleanForJSON = (str) => str ? str.replace(/<[^>]*>?/gm, '').replace(/"/g, '\\"').replace(/\n/g, ' ') : '';

const getNaturalDescription = (p, displayName, provinceName, ageVal, bwhVal, location) => {
    if (p.description && p.description.trim().length > 10) {
        return p.description.trim();
    }
    const localizedZone = location ? `ย่าน${location}` : `โซนต่าง ๆ ในจังหวัด${provinceName}`;
    return `ยินดีต้อนรับสู่โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวระดับพรีเมียมในเขตพื้นที่ ${localizedZone} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} รูปร่างสมส่วน ผิวพรรณดี พร้อมมอบการดูแลเอาใจใส่อย่างเป็นธรรมชาติในสไตล์ฟีลแฟนที่อบอุ่นและสุภาพเรียบร้อย การันตีความปลอดภัยสูงสุดด้วยเงื่อนไขตกลงนัดพบเจอตัวจริงหน้างานเรียบร้อยแล้วจึงค่อยชำระค่าบริการ ปราศจากการเรียกเก็บเงินจองมัดจำล่วงหน้าทุกกรณี`;
};

export default async (request, context) => {
    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`; 
    const ua = (request.headers.get('User-Agent') || '').toLowerCase();
    
    const isBot = /bot|google|spider|crawler|facebook|twitter|line|whatsapp|telegram|discord|curl|wget|inspectiontool|lighthouse|headless|bingbot|yandex|duckduckgo|applebot|gptbot|chatgpt|cohere|anthropic|perplexity|mediapartners-google/i.test(ua);
    
    if (!isBot) return context.next();

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 🛠️ แก้ไข: ลบพารามิเตอร์การ Join ตารางเชิงสัมพันธ์ 'provinces(...)' ออก เพื่อป้องกันการดึงข้อมูลล้มเหลวกรณีระบบคีย์นอกไม่ได้ผูกไว้
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, description, provinceKey, line_id, verified, availability, stats, height, weight, isfeatured, skin_tone, bust, waist, hips, cup_size')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) {
            return new Response(`<!DOCTYPE html><html lang="th"><head><meta name="robots" content="noindex, follow"><title>404 - ไม่พบหน้าเว็บ</title></head><body><h1>404 Not Found</h1></body></html>`, {
                status: 404,
                headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "no-store" } 
            });
        }

        // 🛠️ แก้ไขเพิ่มเติม: แยกมาเขียนคิวรีดึงข้อมูลจังหวัดแยกกันอย่างเป็นอิสระ เพื่อความปลอดภัยสูงสุดในการประมวลผลข้อมูล
        let provinceName = p.location || 'เชียงใหม่';
        let provinceKey = p.provinceKey || 'chiangmai';
        
        if (p.provinceKey) {
            const { data: provData } = await supabase
                .from('provinces')
                .select('nameThai, key')
                .eq('key', p.provinceKey)
                .maybeSingle();
            
            if (provData) {
                provinceName = provData.nameThai || provinceName;
                provinceKey = provData.key || provinceKey;
            }
        }

        let related = [];
        if (p.provinceKey) {
            const { data: relatedData } = await supabase
                .from('profiles')
                .select('slug, name, imagePath, location')
                .eq('provinceKey', p.provinceKey)
                .eq('active', true)
                .neq('id', p.id) 
                .limit(6);
            related = relatedData || [];
        }

        const rawName = p.name || 'สาวสวย';
        let cleanName = rawName.trim().replace(/^(น้อง\s?)+/gi, '');
        const displayName = `น้อง${cleanName}`;
        
        const correctProvinceUrl = provinceKey === 'chiangmai' 
            ? dynamicDomain 
            : `${dynamicDomain}/location/${provinceKey}`;
        
        const rawRate = parseInt(p.rate || "1500");
        const displayPrice = rawRate.toLocaleString() + ".-";
        
        const baseImageUrl = optimizeImg(p.imagePath, 600, 800);
        const lcpImageUrl = optimizeImg(p.imagePath, 400, 533);
        const imageSrcSet = generateSrcSet(p.imagePath);
        
        const rawLineId = p.line_id || p.lineId || 'ksLUWB89Y_';
        let finalLineUrl = rawLineId;
        if (!finalLineUrl.startsWith('http')) {
            finalLineUrl = `https://line.me/ti/p/~${finalLineUrl}`;
        }

        const ageVal = (p.age && p.age !== '-') ? p.age : getDeterministicValue(20, 26, slug, 1);
        const heightVal = (p.height && p.height !== '-') ? p.height : getDeterministicValue(158, 168, slug, 2);
        const weightVal = (p.weight && p.weight !== '-') ? p.weight : getDeterministicValue(44, 52, slug, 3);
        
        let bwhVal = p.stats;
        if ((!bwhVal || bwhVal === '-') && p.bust && p.waist && p.hips) {
            const cup = p.cup_size ? p.cup_size.toUpperCase() : "";
            bwhVal = `${p.bust}${cup}-${p.waist}-${p.hips}`;
        }
        if (!bwhVal || bwhVal === '-') {
            const breastVal = getDeterministicValue(32, 36, slug, 4);
            const waistVal = getDeterministicValue(23, 26, slug, 5);
            const hipVal = getDeterministicValue(33, 37, slug, 6);
            bwhVal = `${breastVal}-${waistVal}-${hipVal}`;
        }

        const isVerified = p.verified === true;

        const charCodeSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingValue = (4.7 + (charCodeSum % 4) / 10).toFixed(1);
        const reviewCount = 150 + (charCodeSum % 100);
        
        const naturalDescriptionText = getNaturalDescription(p, displayName, provinceName, ageVal, bwhVal, p.location);
        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก`;
        const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${p.location || provinceName} อายุ ${ageVal} ปี สัดส่วน ${bwhVal} ดูแลเอาใจใส่เป็นกันเองสไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไร้เงื่อนไขการโอนเงินจองมัดจำล่วงหน้าทุกกรณี`;
        
        const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(slug)}`;

        const schemaReviews = TESTIMONIALS.map(t => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": t.rating.toString(),
                "bestRating": "5"
            },
            "author": {
                "@type": "Person",
                "name": cleanForJSON(t.name)
            },
            "reviewBody": cleanForJSON(t.text)
        }));

        const breadcrumbElements = [
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain }
        ];

        if (provinceKey === 'chiangmai') {
            breadcrumbElements.push({ "@type": "ListItem", "position": 2, "name": "โปรไฟล์ทั้งหมด", "item": `${dynamicDomain}/profiles.html` });
        } else {
            breadcrumbElements.push({ "@type": "ListItem", "position": 2, "name": `ไซด์ไลน์${provinceName}`, "item": correctProvinceUrl });
        }

        breadcrumbElements.push({ "@type": "ListItem", "position": breadcrumbElements.length + 1, "name": displayName, "item": canonicalUrl });

        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${canonicalUrl}#serviceprovider`,
                    "name": `${displayName} - ไซด์ไลน์${provinceName}`,
                    "image": [baseImageUrl],
                    "description": cleanForJSON(metaDesc),
                    "telephone": CONFIG.PHONE || "091-7895644",
                    "url": canonicalUrl,
                    "priceRange": "฿฿",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": ratingValue,
                        "reviewCount": reviewCount.toString()
                    },
                    "review": schemaReviews
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": breadcrumbElements
                },
                {
                    "@type": "FAQPage",
                    "@id": `${canonicalUrl}#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `${displayName} ไซด์ไลน์${provinceName} มีความปลอดภัยและการชำระเงินอย่างไร?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `ทางระบบมีนโยบายให้ลูกค้าพบน้อง ${displayName} ยืนยันความตรงปกหน้างานแล้วจึงชำระค่าบริการแก่ตัวน้องโดยตรง ปราศจากการเรียกเก็บเงินจองคิวมัดจำล่วงหน้าทุกรูปแบบ เพื่อความคุ้มครองและความสบายใจสูงสุดของลูกค้า`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `ต้องการตรวจสอบตารางเวลาหรือขอจองคิว ${displayName} พิกัด ${p.location || provinceName} ได้ที่ช่องทางใด?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `สามารถดำเนินการคลิกแอดไลน์ปุ่ม 'ทักไลน์จองคิว' บนหน้าเว็บ เพื่อดำเนินการขอตรวจสอบคิวงาน สแตนด์บายตารางงาน และจองคิวรับบริการเพื่อความสะดวกและรวดเร็วที่สุดผ่านไลน์แอดมินเจ้าหน้าที่อย่างเป็นทางการ`
                            }
                        }
                    ]
                }
            ]
        };

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} | สารบัญตรวจสอบประวัติตรงปก</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" fetchpriority="high">
    <meta name="theme-color" content="#FF2E63">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${baseImageUrl}">
    <meta property="og:image" content="${baseImageUrl}">
    <meta property="og:image:width" content="600">   
    <meta property="og:image:height" content="800">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta name="google-site-verification" content="7jnWDzrGXlGDdrjl2M75rIPhsjZbTRuzQSdPJ8c_lz4" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />

    <link rel="icon" type="image/png" sizes="72x72" href="/icons/icon-72x72.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-96x96.png">
    <link rel="icon" type="image/png" sizes="128x128" href="/icons/icon-128x128.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png">
    <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">
    <link rel="manifest" href="/manifest.json">
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
    
    <style>
        :root { --p:#FF2E63; --s:#34d399; --bg:#07070A; --card:#111116; --txt:#f8fafc; --gold:#fbbf24; --muted:#cbd5e1; --bw:rgba(255,255,255,0.06); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; overflow-x: hidden; }
        .container { position: relative; max-width: 500px; margin: 0 auto; background: var(--card); min-height: 100vh; box-shadow: 0 0 60px rgba(0,0,0,0.6); border-left: 1px solid var(--bw); border-right: 1px solid var(--bw); }
        @media (min-width: 768px) { .container { max-width: 600px; } }
        
        .fixed-nav { position: absolute; top: 0; left: 0; width: 100%; z-index: 100; background: linear-gradient(to bottom, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%); backdrop-filter: blur(12px); border-bottom: 1px solid var(--bw); }
        .nav-content { display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; height: 64px; }
        .logo-img { height: 26px; width: auto; filter: brightness(2); opacity: 0.95; }
        
        .breadcrumb { padding: 84px 1.25rem 0.5rem 1.25rem; font-size: 0.85rem; color: var(--muted); }
        .breadcrumb a { color: var(--p); text-decoration: none; }
        
        .main-content { padding: 0.5rem 1.25rem 2rem 1.25rem; }
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 1.5rem; box-shadow: 0 24px 48px rgba(0,0,0,0.7); border: 1px solid var(--bw); display: block; }
        .profile-meta-header { text-align: center; margin: 1.5rem 0; }
        h1 { font-size: clamp(1.8rem, 5vw, 2.3rem); font-weight: 900; line-height: 1.2; }
        .rating { display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 700; font-size: 1.1rem; }
        .rating .stars { font-size: 1.2rem; filter: drop-shadow(0 0 6px rgba(250,204,21,0.4)); }
        .rating .rating-value { color: var(--gold); }
        .rating .review-count { color: var(--muted); font-size: 0.95rem; font-weight: 400; }
        .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
        .spec-box { background: rgba(255,255,255,0.02); border: 1px solid var(--bw); border-radius: 1rem; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; }
        .spec-box dt { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
        .spec-box dd { font-size: 1.05rem; font-weight: 800; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
        .info-item { background: rgba(244,114,182,0.06); border: 1px solid rgba(244,114,182,0.2); border-radius: 1.25rem; padding: 1.25rem 0.75rem; text-align: center; }
        .info-label { font-size: 0.85rem; color: var(--p); font-weight: 700; display: block; }
        .info-value { font-size: 1.4rem; font-weight: 900; }
        .description { background: rgba(255,255,255,0.01); border-radius: 1.25rem; padding: 1.5rem; margin: 1.5rem 0; border: 1px solid var(--bw); white-space: pre-line; font-size: 1.05rem; }
        .btn-line { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--p), #db2777); color: #fff; padding: 1.1rem 2rem; border-radius: 3rem; font-weight: 800; font-size: 1.2rem; text-decoration: none; width: 100%; box-shadow: 0 12px 32px rgba(255,46,99,0.3); transition: all 0.25s ease; }
        .pricing-section { margin: 2rem 0; background: rgba(0,0,0,0.2); border-radius: 1.25rem; padding: 1.5rem; border: 1px solid var(--bw); }
        .pricing-title { color: var(--p); text-align: center; font-weight: 800; font-size: 1.2rem; margin-bottom: 1.25rem; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center; }
        .pricing-item { background: rgba(255,255,255,0.03); padding: 0.85rem 0.5rem; border-radius: 0.85rem; border: 1px solid var(--bw); }
        .faq-section { margin: 2.5rem 0; }
        .faq-title { color: var(--p); font-size: 1.25rem; font-weight: 800; text-align: center; margin-bottom: 1.25rem; }
        .faq-item { background: rgba(255,255,255,0.02); border: 1px solid var(--bw); border-radius: 1rem; padding: 1.25rem; margin-bottom: 0.75rem; }
        .faq-item h3 { font-size: 1rem; color: var(--txt); margin-bottom: 0.5rem; }
        
        .related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
        .related-card { background: rgba(255,255,255,0.03); border-radius: 1.25rem; overflow: hidden; border: 1px solid var(--bw); text-decoration: none; color: inherit; display: block; transition: border-color 0.2s; }
        .related-card:hover { border-color: var(--p); }
        .related-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
        .related-name { padding: 0.75rem; text-align: center; font-weight: bold; font-size: 0.95rem; }
        .view-all-btn { display: block; text-align: center; color: var(--p); text-decoration: underline; font-weight: bold; margin-top: 1rem; }
        
        .testimonial { background: rgba(255,255,255,0.01); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid var(--bw); margin-bottom: 1rem; }
        
        .footer { text-align: center; padding: 2.5rem 1rem; background: rgba(0,0,0,0.3); border-top: 1px solid var(--bw); margin-top: 3.5rem; color: var(--muted); font-size: 0.85rem; }
        .footer-nav { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; }
        .footer-nav a { color: var(--muted); text-decoration: underline; }

        body {
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: calc(75px + env(safe-area-inset-bottom, 0px));
        }

        @media (min-width: 768px) {
            body {
                padding-bottom: env(safe-area-inset-bottom, 0px);
            }
        }

        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0.015;
            pointer-events: none;
            z-index: 9999;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
    </style>
</head>
<body>

    <div class="container">
        <header class="fixed-nav">
            <div class="nav-content">
                <a href="/" class="logo-link"><img src="/images/logo-sidelinechiangmai.webp" alt="${CONFIG.BRAND_NAME}" class="logo-img" width="200" height="26" fetchpriority="high" decoding="sync"></a>
            </div>
        </header>

        <nav aria-label="breadcrumb" class="breadcrumb">
            <a href="/">หน้าแรก</a> &raquo; 
            <a href="${correctProvinceUrl}">ดูรายชื่อน้องๆ ไซด์ไลน์${provinceName}</a> &raquo; 
            <span>${displayName}</span>
        </nav>

        <main class="main-content">
            <article>
                <section class="hero-section">
                    <img src="${lcpImageUrl}" 
                         ${imageSrcSet ? `srcset="${imageSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ''}
                         class="hero-img" alt="${displayName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
                         loading="eager" fetchpriority="high" decoding="sync" 
                         width="400" height="533">
                </section>

                <header class="profile-meta-header">
                    <h1>${pageTitle}</h1>
                    <div class="rating">
                        <span class="stars">⭐</span>
                        <span class="rating-value">${ratingValue}</span>
                        <span class="review-count">คะแนนโหวตจากลูกค้า (${reviewCount} รีวิว)</span>
                    </div>
                </header>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ค่าขนม</span>
                        <span class="info-value">${displayPrice}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">อายุ</span>
                        <span class="info-value">${ageVal} ปี</span>
                    </div>
                </div>

                <div class="specs-grid">
                    <dl class="spec-box"><dt>สัดส่วน</dt><dd>${bwhVal}</dd></dl>
                    <dl class="spec-box"><dt>ส่วนสูง</dt><dd>${heightVal} ซม.</dd></dl>
                </div>

                <div class="description">
                    ${escapeHTML(naturalDescriptionText)}
                </div>

                <a href="${finalLineUrl}" class="btn-line" rel="nofollow noopener" target="_blank">ทักไลน์จองคิว</a>

                <section class="pricing-section">
                    <h2 class="pricing-title">ราคาบริการ</h2>
                    <div class="pricing-grid">
                        <div class="pricing-item"><div>1 ชม.</div><strong>${rawRate}</strong></div>
                        <div class="pricing-item"><div>2 ชม.</div><strong>${Math.floor(rawRate * 1.8)}</strong></div>
                        <div class="pricing-item"><div>ค้างคืน</div><strong>${Math.floor(rawRate * 4.5)}</strong></div>
                    </div>
                </section>

                <section class="faq-section">
                    <h2 class="faq-title">คำถามพบบ่อย</h2>
                    <div class="faq-item">
                        <h3>${displayName} มีมัดจำไหม?</h3>
                        <p>ไม่มีนโยบายการรับเงินโอนจองมัดจำล่วงหน้าใดๆ ทุกกรณีค่ะ ลูกค้าสามารถเดินทางมานัดพบหน้างานเพื่อตรวจสอบสิทธิ์ความตรงปกเรียบร้อยแล้ว ค่อยตกลงชำระค่าขนมโดยตรงหน้างานเพื่อความปลอดภัย 100%</p>
                    </div>
                </section>

                <section>
                    <h2 class="faq-title">รีวิวจากลูกค้า</h2>
                    ${TESTIMONIALS.map(t => `
                        <div class="testimonial">
                            <strong>${escapeHTML(t.name)}</strong>
                            <p>${escapeHTML(t.text)}</p>
                        </div>
                    `).join('')}
                </section>
                
                ${related.length > 0 ? `
                <section class="faq-section" style="margin-top: 3.5rem;">
                    <h2 class="faq-title">น้องๆ โซน${provinceName} ที่น่าสนใจ</h2>
                    <div class="related-grid">
                        ${related.map(r => {
                            const rawRelName = r.name || 'สาวสวย';
                            const cleanRelName = rawRelName.replace(/^(น้อง\s?)+/, "");
                            const displayRelName = `น้อง${cleanRelName}`;
                            return `
                            <a href="/sideline/${encodeURIComponent(r.slug)}" class="related-card" title="${displayRelName}">
                                <img src="${optimizeImg(r.imagePath, 300, 400)}" class="related-img" alt="${displayRelName} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" loading="lazy" width="300" height="400">
                                <div class="related-name">${displayRelName}</div>
                            </a>
                            `;
                        }).join('')}
                    </div>
                    <a href="${correctProvinceUrl}" class="view-all-btn">ดูน้องๆ รับงานโซน${provinceName} ทั้งหมด</a>
                </section>
                ` : ''}

                <section class="faq-section" style="margin-top: 2.5rem; border-top: 1px solid var(--bw); padding-top: 2rem;">
                    <h2 class="faq-title">แนวทางปฏิบัติร่วมกันเพื่อความปลอดภัย</h2>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--bw); border-radius: 1rem; padding: 1.25rem; font-size: 0.85rem; color: var(--muted); line-height: 1.75;">
                        <p style="margin-bottom: 0.5rem;"><strong>✓ ข้อกำหนดอายุขั้นต่ำ</strong>: ผู้เข้าชมเพจและขอใช้สิทธิ์บริการจองคิวจะต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไปเท่านั้น</p>
                        <p style="margin-bottom: 0.5rem;"><strong>✓ มาตรการป้องกันมิจฉาชีพ</strong>: โปรดระมัดระวังการโอนเงินจองคิวมัดจำล่วงหน้า ทางระบบยึดมั่นนโยบายจ่ายหน้างานโดยตรงหลังเจอตัวน้องและตรวจสอบความถูกต้องตรงปกเท่านั้น</p>
                        <p><strong>✓ การรักษาความลับ (Zero-Log Policy)</strong>: ข้อมูลการติดต่อและการจองคิวทั้งหมดจะได้รับการดูแลภายใต้มาตรการความเป็นส่วนตัวสูงสุดและจะถูกลบออกจากระบบทันทีหลังจากงานเสร็จสิ้น</p>
                    </div>
                </section>
            </article>
        </main>
        
        <footer class="footer">
            <nav class="footer-nav">
                <a href="/">หน้าแรก</a>
                <a href="/profiles.html">โปรไฟล์น้องๆ ทั้งหมด</a>
                <a href="/locations.html">พิกัดรับงานทั่วประเทศ</a>
            </nav>
            © ${new Date().getFullYear()} ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ
        </footer>
    </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
};
