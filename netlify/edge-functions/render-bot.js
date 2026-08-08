/**
 * [ SYSTEM BOT RENDERING CORE - PROD-READY ULTRA-OPTIMIZED 2026 ]
 * Project: First Model Hub - Serverless Profile Renderer
 * Fixes Applied:
 *   1. FIXED GOOGLE RICH RESULTS TEST ERROR: Always serve valid pre-rendered JSON-LD & HTML.
 *   2. Replaced {{SCHEMA_JSON}} with clean Schema.org graph (Escaped '<' to '\\u003c').
 *   3. Fixed Chiang Mai & Province Routing: Breadcrumbs now link directly to /location/[province].
 *   4. Comprehensive Thai Typo Sanitization & Emoji Cleanup (Strips 🚨 and ASCII borders).
 *   5. Clean HTML Output without duplicate script tags or fake phone numbers.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const CONFIG = {
    get SUPABASE_URL() {
        try { return Deno.env.get("SUPABASE_URL") || 'https://zxetzqwjaiumqhrpumln.supabase.co'; } catch { return 'https://zxetzqwjaiumqhrpumln.supabase.co'; }
    },
    get SUPABASE_KEY() {
        try { return Deno.env.get("SUPABASE_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; } catch { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZXR6cXdqYWl1bXFocnB1bWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMzMTIsImV4cCI6MjA4NzE4OTMxMn0.ZNJq1fF51rlKnfvIw-AZ65R1OpCmgA3-CkE2OtxpaX4'; }
    },
    DOMAIN: 'https://firstmodelhub.com',
    BRAND_NAME: 'First Model Hub',
    SOCIAL_PROFILES: {
        line: 'https://line.me/ti/p/ksLUWB89Y_',
        tiktok: 'https://tiktok.com/@firstmodelhub',
        twitter: 'https://twitter.com/firstmodelhub',
        linkedin: 'https://linkedin.com/in/cuteti-sexythailand-398567280',
        biosite: 'https://bio.site/firstmodelhub',
        linktree: 'https://linktr.ee/firstmodelhub',
        bluesky: 'https://bsky.app/profile/firstmodelhub.bsky.social'
    }
};

// 🟢 ระบบล้างคำผิดภาษาไทย + ลบ Emoji/สัญลักษณ์พิเศษจากชื่อและเนื้อหา
const sanitizeText = (str) => {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/นิมาน|นิทาน/g, "นิมมาน")
        .replace(/ฟื้นที่/g, "พื้นที่")
        .replace(/ไกล้เคียง|ใกล้เครยง/g, "ใกล้เคียง")
        .replace(/พาพับ/g, "พายัพ")
        .replace(/ของแก่น/g, "ขอนแก่น")
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🚨]/gu, "") // ลบ Emoji และ 🚨
        .replace(/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬„•ㅅ•„]+/g, "") // ลบเส้นกรอบ ASCII
        .replace(/\n\s*\n/g, "\n")
        .trim();
};

const sanitizeName = (rawName) => {
    if (!rawName || typeof rawName !== "string") return "สาวสวย";
    let cleaned = sanitizeText(rawName).replace(/^(น้อง\s?)+/gi, "").trim();
    if (!cleaned) return "สาวสวย";
    return `น้อง${cleaned}`;
};

// 🟢 1. เปลี่ยนรูป Fallback ใน optimizeImg
const optimizeImg = (path, width = 600, height = 800) => {
    if (!path) return `${CONFIG.DOMAIN}/images/firstmodelhub.webp`;
    if (path.includes('res.cloudinary.com')) {
        const cleanPath = path.replace(/\/image\/upload\/[^/]+\/(v\d+\/)/, '/image/upload/$1');
        return cleanPath.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
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

const escapeHTML = (str) => str ? String(str).replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])) : '';
const stripHTML = (str) => str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '';

export default async (request, context) => {
    const url = new URL(request.url);
    const dynamicDomain = `${url.protocol}//${url.host}`; 

    try {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts[0] !== 'sideline' || pathParts.length < 2) return context.next();
        
        const slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (['province', 'category', 'search', 'app'].includes(slug)) return context.next();

        const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        const { data: p } = await supabase
            .from('profiles')
            .select('id, slug, name, imagePath, location, rate, age, height, weight, stats, bust, waist, hips, cup_size, description, provinceKey, lineId, slogan, quote, is_featured, verified, provinces(nameThai, key)')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (!p) {
            return context.next();
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

        const displayName = sanitizeName(p.name);
        const provinceName = p.provinces?.nameThai || sanitizeText(p.location) || 'เชียงใหม่';
        const provinceKey = (p.provinces?.key || p.provinceKey || 'chiangmai').toLowerCase().replace(/_/g, '-');
        
        // 🟢 ให้ URL จังหวัดชี้ไปที่ /location/chiangmai (ไม่ใช่หน้าหลัก domain เปล่าๆ)
        const correctProvinceUrl = `${dynamicDomain}/location/${provinceKey}`;

        const cleanedRate = String(p.rate || "1500").replace(/[^0-9]/g, '');
        const rawRate = parseInt(cleanedRate, 10) || 1500;
        const displayPrice = rawRate.toLocaleString() + ".-";
        
        const baseImageUrl = optimizeImg(p.imagePath, 600, 800);
        const lcpImageUrl = optimizeImg(p.imagePath, 400, 533);
        const imageSrcSet = generateSrcSet(p.imagePath);
        
     let finalLineUrl = p.lineId || 'ksLUWB89Y_';
if (!finalLineUrl.startsWith('http')) {
    const cleanLineId = finalLineUrl.replace(/^[@~]/, '').trim();
    finalLineUrl = cleanLineId.startsWith('http') ? cleanLineId : `https://line.me/ti/p/${cleanLineId}`;
}

        const ageVal = (p.age && String(p.age).trim() !== "-" && String(p.age).trim() !== "0") ? `${p.age} ปี` : "ไม่ระบุ";
        const heightVal = (p.height && String(p.height).trim() !== "-" && String(p.height).trim() !== "0") ? `${p.height} ซม.` : "ไม่ระบุ";
        
        let bwhVal = "ไม่ระบุ";
        if (p.bust && p.waist && p.hips) {
            const cup = (p.cup_size || p.cupSize || "").toUpperCase().trim();
            bwhVal = `${p.bust}${cup}-${p.waist}-${p.hips}`;
        } else if (p.stats && String(p.stats).trim() !== "-") {
            bwhVal = sanitizeText(p.stats);
        }

        const localizedZone = p.location ? `ย่าน${sanitizeText(p.location)} ในจังหวัด${provinceName}` : `จังหวัด${provinceName}`;
        
        let naturalDescriptionText = "";
        if (p.description && p.description.trim().length > 10) {
            naturalDescriptionText = sanitizeText(p.description);
        } else {
            naturalDescriptionText = `โปรไฟล์แนะนำของ ${displayName} ผู้ให้บริการเพื่อนเที่ยวและนำเที่ยวพรีเมียมในเขตพื้นที่ ${localizedZone} อายุ ${ageVal} สัดส่วน ${bwhVal} รูปร่างสมส่วน สุภาพเรียบร้อย ดูแลดีสไตล์ฟิวแฟน การันตีความปลอดภัย นัดเจอตัวจริงค่อยชำระค่าบริการหน้างาน ไม่มีการโอนเงินมัดจำล่วงหน้าทุกกรณี`;
        }
        
        const pageTitle = `${displayName} ไซด์ไลน์${provinceName} เพื่อนเที่ยวสไตล์ฟิวแฟน ตรงปก`;
        const metaDesc = `โปรไฟล์แนะนำของ ${displayName} สาวสวยไซด์ไลน์พิกัดบริการบริเวณ ${sanitizeText(p.location) || provinceName} อายุ ${ageVal} สัดส่วน ${bwhVal} ดูแลเอาใจใส่สไตล์ฟิวแฟนอย่างสุภาพ ตรวจสอบประวัติจริงตรงปก ปลอดภัยสูงสุด ไม่โอนมัดจำล่วงหน้า`;
        
        const canonicalUrl = `${dynamicDomain}/sideline/${encodeURIComponent(slug)}`;

        // 🟢 Breadcrumb สากล
        const breadcrumbElements = [
            { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": dynamicDomain },
            { "@type": "ListItem", "position": 2, "name": `สาวรับงาน${provinceName}`, "item": correctProvinceUrl },
            { "@type": "ListItem", "position": 3, "name": displayName, "item": canonicalUrl }
        ];

        // 🟢 โครงสร้าง Schema JSON-LD สากลที่ผ่านการตรวจสอบ 100%
        const schemaData = {
            "@context": "https://schema.org/",
            "@graph": [
                {
                    "@type": ["LocalBusiness", "EntertainmentBusiness"],
                    "@id": `${canonicalUrl}#serviceprovider`,
                    "name": `${displayName} - ไซด์ไลน์${provinceName}`,
                    "image": [baseImageUrl],
                    "description": stripHTML(metaDesc),
                    "url": canonicalUrl,
                    "priceRange": "฿฿",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": provinceName,
                        "addressRegion": provinceName,
                        "addressCountry": "TH"
                    }
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
                            "name": `ต้องการตรวจสอบตารางเวลาหรือขอจองคิว ${displayName} พิกัด ${sanitizeText(p.location) || provinceName} ได้ที่ช่องทางใด?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `สามารถดำเนินการคลิกแอดไลน์ปุ่ม 'ทักไลน์จองคิว' บนหน้าเว็บ เพื่อดำเนินการขอตรวจสอบคิวงาน สแตนด์บายตารางงาน และจองคิวรับบริการเพื่อความสะดวกและรวดเร็วที่สุดผ่านไลน์แอดมินเจ้าหน้าที่อย่างเป็นทางการ`
                            }
                        }
                    ]
                }
            ]
        };

        // 🟢 แปลง JSON และ Encode เครื่องหมาย '<' เป็น '\u003c' ป้องกันไวยากรณ์แตก
        const jsonLdString = JSON.stringify(schemaData).replace(/</g, '\\u003c');

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(pageTitle)} | สารบัญตรวจสอบประวัติตรงปก</title>
    <meta name="description" content="${escapeHTML(metaDesc)}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <link rel="preconnect" href="${CONFIG.SUPABASE_URL}" crossorigin>
    <link rel="preload" as="image" href="${lcpImageUrl}" ${imageSrcSet ? `imagesrcset="${imageSrcSet}" imagesizes="(max-width: 600px) 100vw, 400px"` : ''} fetchpriority="high">
    <meta name="theme-color" content="#FF2E63">
    
    <meta property="og:site_name" content="${CONFIG.BRAND_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(pageTitle)}">
    <meta name="twitter:description" content="${escapeHTML(metaDesc)}">
    <meta name="twitter:image" content="${baseImageUrl}">
    <meta property="og:image" content="${baseImageUrl}">
    <meta property="og:image:width" content="600">   
    <meta property="og:image:height" content="800">
    
    <link rel="shortcut icon" href="/images/favicon.ico">
    
    <meta property="og:title" content="${escapeHTML(pageTitle)}">
    <meta property="og:description" content="${escapeHTML(metaDesc)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">

    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    
    <!-- 🟢 การันตี JSON-LD สะอาด ชัดเจน 100% -->
    <script type="application/ld+json" id="dynamic-schema">${jsonLdString}</script>
    
    <style>
        :root { --p:#FF2E63; --s:#34d399; --bg:#07070A; --card:#111116; --txt:#f8fafc; --gold:#fbbf24; --muted:#cbd5e1; --bw:rgba(255,255,255,0.06); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--txt); line-height: 1.6; overflow-x: hidden; }
        .container { position: relative; max-width: 500px; margin: 0 auto; background: var(--card); min-height: 100vh; box-shadow: 0 0 60px rgba(0,0,0,0.6); border-left: 1px solid var(--bw); border-right: 1px solid var(--bw); }
        @media (min-width: 768px) { .container { max-width: 600px; } }
        
        .fixed-nav { position: absolute; top: 0; left: 0; width: 100%; z-index: 100; background: linear-gradient(to bottom, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%); backdrop-filter: blur(12px); border-bottom: 1px solid var(--bw); }
        .nav-content { display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; height: 64px; }
        .logo-text { font-size: 18px; font-weight: 800; color: #FFFFFF; text-decoration: none; }
        
        .breadcrumb { padding: 84px 1.25rem 0.5rem 1.25rem; font-size: 0.85rem; color: var(--muted); }
        .breadcrumb a { color: var(--p); text-decoration: none; }
        
        .main-content { padding: 0.5rem 1.25rem 2rem 1.25rem; }
        .hero-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 1.5rem; box-shadow: 0 24px 48px rgba(0,0,0,0.7); border: 1px solid var(--bw); display: block; }
        .profile-meta-header { text-align: center; margin: 1.5rem 0; }
        h1 { font-size: clamp(1.8rem, 5vw, 2.3rem); font-weight: 900; line-height: 1.2; }
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
    </style>
</head>
<body>

    <div class="container">
        <header class="fixed-nav">
            <div class="nav-content">
                <a href="/" class="logo-text">First Model <span style="color: #C084FC;">Hub</span></a>
            </div>
        </header>

        <nav aria-label="breadcrumb" class="breadcrumb">
            <a href="/">หน้าแรก</a> &raquo; 
            <a href="${correctProvinceUrl}">ดูรายชื่อน้องๆ ไซด์ไลน์${provinceName}</a> &raquo; 
            <span>${escapeHTML(displayName)}</span>
        </nav>

        <main class="main-content">
            <article>
                <section class="hero-section">
<img src="${lcpImageUrl}" 
     ${imageSrcSet ? `srcset="${imageSrcSet}" sizes="(max-width: 600px) 100vw, 400px"` : ''}
     class="hero-img" alt="${escapeHTML(displayName)} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" 
     loading="eager" fetchpriority="high" decoding="async" 
     width="400" height="533">
                </section>

                <header class="profile-meta-header">
                    <h1>${escapeHTML(pageTitle)}</h1>
                </header>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ค่าขนม</span>
                        <span class="info-value">${displayPrice}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">อายุ</span>
                        <span class="info-value">${escapeHTML(ageVal)}</span>
                    </div>
                </div>

                <div class="specs-grid">
                    <dl class="spec-box"><dt>สัดส่วน</dt><dd>${escapeHTML(bwhVal)}</dd></dl>
                    <dl class="spec-box"><dt>ส่วนสูง</dt><dd>${escapeHTML(heightVal)}</dd></dl>
                </div>

                <div class="description">
                    ${escapeHTML(naturalDescriptionText)}
                </div>

                <a href="${finalLineUrl}" class="btn-line" rel="nofollow noopener" target="_blank">ทักไลน์จองคิว</a>

                <section class="pricing-section">
                    <h2 class="pricing-title">ราคาบริการ</h2>
                    <div class="pricing-grid">
                        <div class="pricing-item"><div>1 ชม.</div><strong>${rawRate.toLocaleString()}</strong></div>
                        <div class="pricing-item"><div>2 ชม.</div><strong>${Math.floor(rawRate * 1.8).toLocaleString()}</strong></div>
                        <div class="pricing-item"><div>ค้างคืน</div><strong>${Math.floor(rawRate * 4.5).toLocaleString()}</strong></div>
                    </div>
                </section>

                <section class="faq-section">
                    <h2 class="faq-title">คำถามพบบ่อย</h2>
                    <div class="faq-item">
                        <h3>${escapeHTML(displayName)} มีมัดจำไหม?</h3>
                        <p>ไม่มีนโยบายการรับเงินโอนจองมัดจำล่วงหน้าใดๆ ทุกกรณีค่ะ ลูกค้าสามารถเดินทางมานัดพบหน้างานเพื่อตรวจสอบสิทธิ์ความตรงปกเรียบร้อยแล้ว ค่อยตกลงชำระค่าขนมโดยตรงหน้างานเพื่อความปลอดภัย 100%</p>
                    </div>
                </section>

                ${related.length > 0 ? `
                <section class="faq-section" style="margin-top: 3.5rem;">
                    <h2 class="faq-title">น้องๆ โซน${provinceName} ที่น่าสนใจ</h2>
                    <div class="related-grid">
                        ${related.map(r => {
                            const displayRelName = sanitizeName(r.name);
                            return `
                            <a href="/sideline/${encodeURIComponent(r.slug)}" class="related-card" title="${escapeHTML(displayRelName)}">
                                <img src="${optimizeImg(r.imagePath, 300, 400)}" class="related-img" alt="${escapeHTML(displayRelName)} สาวรับงาน${provinceName} ไซด์ไลน์${provinceName} ฟิวแฟน" loading="lazy" width="300" height="400">
                                <div class="related-name">${escapeHTML(displayRelName)}</div>
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
                <a href="/profiles">โปรไฟล์น้องๆ ทั้งหมด</a>
                <a href="/locations">พิกัดรับงานทั่วประเทศ</a>
            </nav>
            © 2026 ${CONFIG.BRAND_NAME} - บริการด้วยความจริงใจ
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
                "X-XSS-Protection": "1; mode=block",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
                "Content-Security-Policy": "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' https: 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' https: 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:; frame-src 'self' https:;"
            }
        });

    } catch (err) {
        console.error("Bot rendering crash:", err);
        return context.next();
    }
};